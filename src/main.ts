import {
  abort,
  appendBufferToFile,
  cliExecute,
  cliExecuteOutput,
  choiceFollowsFight,
  currentRound,
  fightFollowsChoice,
  fileToBuffer,
  gamedayToInt,
  getProperty,
  handlingChoice,
  historicalPrice,
  inMultiFight,
  isDarkMode,
  Item,
  myAdventures,
  myId,
  print,
  runChoice,
  setProperty,
} from "kolmafia";
import { $items, get, Kmail, property, Session, set, sinceKolmafiaRevision } from "libram";

import { prepareWaterSheepRoute, traceTargetPrediction } from "./don_combo_runtime";
import {
  LIVE_RARE_SHARE_PREF,
  LIVE_RARE_SHARE_RECIPIENT,
  liveRareFromAction,
  liveRareKmailBatches,
  type LiveRareShareRow,
} from "./runtime/live-rare-share";
import {
  loadMlTraceEvents,
  recordBeachObservation,
  type BeachOutcome,
} from "./runtime/observations";
import {
  roundedPrescoreSeconds,
  prescoreWaitPhrase,
  prescoreProgressNotice,
} from "./runtime/prescore-progress";
import { firstVisibleSandCastle } from "./runtime/sandcastle-observer";
import {
  observeRunAction, startRunInterface, runProgress,
  renderRunObservation, renderRunValue,
} from "./runtime/run-interface";
import { summarizeShadowRun, type ShadowRunContext } from "./runtime/shadow-learning";
import {
  compileShadowTop11,
  compileWaterSheepRoute,
  MAX_WATERSHEEP_ROUTE_COMBS,
  type ShadowRouteSnapshot,
} from "./runtime/shadow-route";

// Gotta print in a legible colour.
const HIGHLIGHT = isDarkMode() ? "yellow" : "blue";

type BeachTile = { minute: number; row: number; column: number };

// This is too big a data set to cram into a file
// JSON or "JavaScript Object Notation" is a way of storing JS objects in strings
// fileToBuffer is a mafia ASH function that reads .txt files into a "buffer"
// JS doesn't have buffers, so this is coered into a string
// We assert that rareTiles will be an array of BeachTiles, because this script doesn't otherwise know.
// If we didn't make this assertion, a lot of things would explode.
// Unfortunately, this can mean some bad things could happen were our data file to get messed up
const rareTiles: BeachTile[] = JSON.parse(fileToBuffer("raretiles.json"));

// A list of all the common items found in infreqeunt twinkles to detect when we actually combed an infrequent tile instead of a rare
const infrequentItemNames =
  $items`sand dollar, dull fish scale, rough fish scale, lucky rabbitfish fin, spearfish fishing spear, waders, pristine fish scale, piece of coral`.map(
    (item) => item.name.toLowerCase(),
  );

function parseFalseRares(): BeachTile[] {
  // Get the property and split it by the divider of ;
  const knownFalseRares = getProperty("combo_false_rares")
    .split(";")
    .filter((s) => s.length > 0);
  const beachTiles = knownFalseRares.map((s): BeachTile => {
    const [minute, row, column] = s.split(",").map(Number);

    return { minute, row, column };
  });

  return beachTiles;
}

let falseRares: BeachTile[];
function getFalseRares(): BeachTile[] {
  if (!falseRares) falseRares = parseFalseRares();
  return falseRares;
}

function isFalseRare(tile: BeachTile): boolean {
  return getFalseRares().some(
    (t) => tile.minute === t.minute && tile.row === t.row && tile.column === t.column,
  );
}

// Invoked when a tile is actually an infrequent tile instead of a rare as expected
function addFalseRare(tile: BeachTile) {
  // If we already knew this was a false rare, skip it
  if (isFalseRare(tile)) {
    return;
  }

  const knownFalseRares = getFalseRares();

  // Push it to the list of known false rares
  knownFalseRares.push(tile);

  // Save the property
  setProperty(
    "combo_false_rares",
    knownFalseRares.map((tile) => `${tile.minute},${tile.row},${tile.column}`).join(";"),
  );
}

// We precede the function name with an underscore to show that it's not a front, user-facing function
// In this script, really only main is, but we may port this code into libram at some point
// We'd want to export the comb function, but not _comb
let activeShadowRun: ShadowRunContext | null = null;
let activeRunInterface: ReturnType<typeof startRunInterface> | null = null;
let autoTraceWaterSheepRun = false;
// Per-run memory only. Never populated from saved ML events or session history.
let activeLiveRareShare: LiveRareShareRow[] | null = null;

function shareDataEnabled(): boolean {
  return getProperty(LIVE_RARE_SHARE_PREF) === "true";
}

function safeToKmail(): boolean {
  // Match Excavator's no-combat/no-choice transport boundary.
  return (
    currentRound() === 0 &&
    !handlingChoice() &&
    !fightFollowsChoice() &&
    !choiceFollowsFight() &&
    !inMultiFight()
  );
}

function mlTraceEnabled(): boolean {
  return ["1", "true", "target", "on"].includes(
    String(getProperty("don_combo_ml_trace") || "").toLowerCase(),
  );
}

function captureTargetPrediction(
  minute: number,
  row: number,
  column: number,
): Record<string, unknown> | null {
  if (!mlTraceEnabled() && !autoTraceWaterSheepRun) return null;
  try {
    return traceTargetPrediction(minute, row, column);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    print(`don_combo ML trace unavailable: ${message} · Combo continues normally.`, "gray");
    return {
      schema: "don-combo-target-prediction/v0.1",
      generated_at: new Date().toISOString(),
      minute,
      error: message,
      authority: "none",
    };
  }
}

function sessionDelta(before: Session): { meat: number; items: Record<string, number> } {
  const delta = Session.current().diff(before);
  const items: Record<string, number> = {};
  for (const [item, quantity] of delta.items) {
    if (quantity) items[item.name] = quantity;
  }
  return { meat: delta.meat, items };
}

function consumeInterruptRequest(): boolean {
  if (!get("don_combo_interrupt", false)) return false;
  set("don_combo_interrupt", false);
  set("don_combo_last_run_interrupt_consumed", true);
  return true;
}

function _comb(tile: BeachTile): void {
  // Here, we destructure the BeachTile object into three separate variables
  // It's going to be really tedious to write tile.minute and tile.row all the time
  // So this is nice looking
  const { minute, row, column } = tile;
  if (!cliExecute(`beach wander ${minute};`))
    throw new Error(`Could not visit beach minute ${minute}; route stopped.`);
  const layoutString = property.getString("_beachLayout");
  const preActionObservedAt = new Date().toISOString();
  print(`DON_COMBO_OBSERVATION minute=${minute} layout=${layoutString}`, "gray");

  // Mafia's _beachLayout property generates strings that look like
  // 4:rrrrrrrrrr,5:rrrrrrrrrr,6:rrcrrrrrcr,7:crrrrrrrrr,8:rrrrrrrrrr,9:rrrrrrrrrr,10:rrrrrrcrrr
  // We start by turning this into a multidimensional array, and then parse it as a map
  // We use maps because we want to be able to "look up" a row using its index
  const layout = new Map<number, string[]>(
    layoutString
      .split(",")
      .map((element) => element.split(":"))
      // While you and I both know, looking at the property, that every element at this point will look like [3, ["r","r","r","r","r","r","r","r","r","r"]]
      // TypeScript doesn't know that! the "as" called a "Type Assertion", which is exactly what it sounds like
      // This way, our compiler and our IDE don't start shouting at us for things that we, the reader, know are fine.
      .map((rowLayout) => [parseInt(rowLayout[0]), rowLayout[1].split("")] as [number, string[]]),
  );

  const preActionPrediction = captureTargetPrediction(minute, row, column);
  const finishObservation = (
    outcome: BeachOutcome,
    actualRow: number,
    actualColumn: number,
    before: Session,
    actionOutput: string,
  ) => {
    const delta = sessionDelta(before);
    recordBeachObservation(minute, layoutString, outcome, {
      planned_target: { minute, row, column },
      actual_comb: { minute, row: actualRow, column: actualColumn },
      items: delta.items,
      meat: delta.meat,
      action_output: actionOutput,
      pre_action_prediction: preActionPrediction,
      pre_action_observed_at: preActionObservedAt,
      run_context: activeShadowRun,
    });
    // Passive per-comb report: one observation, never a game action.
    if (activeRunInterface) {
      const seen = observeRunAction(activeRunInterface, {
        minute, layout: layoutString, outcome,
        planned_row: row, planned_col: column,
        actual_row: actualRow, actual_col: actualColumn,
        items: delta.items, output: actionOutput,
      });
      print(
        "+ event_observed=" + (seen.observed ? "T" : "F") +
          " event_name=" + (seen.names.join(",") || "none"),
        "gray",
      );
    }
    // Only this just-completed native comb's delta can enter a sharing run.
    if (activeLiveRareShare !== null && shareDataEnabled()) {
      const sighting = liveRareFromAction({
        minute,
        row: actualRow,
        column: actualColumn,
        pre_action_layout: layoutString,
        outcome,
        items: delta.items,
        action_output: actionOutput,
        observed_at_utc: new Date().toISOString(),
      });
      if (sighting) activeLiveRareShare.push(sighting);
    }
  };

  // the Array.find() method returnns either an element of the array that fits, or undefined
  // We convert our Map to an Array here to use the .find() method
  // We check for a whale here just because wouldn't it be neat if we had a whale?
  const whaleRow = Array.from(layout.entries()).find((rowLayout) => rowLayout[1].includes("W"));
  if (whaleRow) {
    // Mafia inexplicably indexes columns starting at 0, and rows starting at 1
    // This is beneficial to us! Arrays are indexed starting at 1, so .findIndex() gets us just what we want
    const whaleColumn = whaleRow[1].findIndex((x) => x === "W");
    print("We found a whale. To hey deze's heart, we'll stab at it.", "red");
    const before = Session.current();
    const output = cliExecuteOutput(`beach comb ${whaleRow[0]} ${whaleColumn}`);
    finishObservation("whale", whaleRow[0], whaleColumn, before, output);
    // By returning partway through, we avoid needing to use "else"
    // With the exception of try...finally shenanigans, using the return keyword will just immediately terminate the function
    return;
  }

  const rareRow = layout.get(row);
  if (rareRow) {
    let falseRareRough = false;
    // Here we make sure that the tile we were going to comb wasn't actually rough sand
    // This uses `hasTwinkleVision` which was added in r27618, but this is not required.
    if (get("hasTwinkleVision", false) && rareRow[column] === "r") {
      print(
        "Although our rare tile was uncombed, it is actually rough sand. Lets avoid this tile in the future.",
        HIGHLIGHT,
      );
      // Note that it is not a rare tile, then invoke a function to add it to the false rares
      addFalseRare(tile);
      falseRareRough = true;
    }

    // Here we make sure that the tile we were going to comb wasn't already combed
    if (rareRow[column] !== "c") {
      print("Our rare tile is uncombed, so let's go ahead and change that.", "red");
      // Grab the output of our comb and lowercase the resulting text
      const before = Session.current();
      const actionOutput = cliExecuteOutput(`beach comb ${row} ${column}`);
      const output = actionOutput.toLowerCase();

      // We exclude grain of sand as it means we didn't comb a twinkle as expected
      // We check if the output contained an item only found in infrequent twinkles
      // If it did contain such an item, it means this tile was not actually a rare
      const hasCommonItem =
        !output.includes("grain of sand") &&
        infrequentItemNames.some((name) => output.includes(name));

      // If it was not actually a rare, invoke a function to add it to a list of known false rares
      if (hasCommonItem) {
        addFalseRare(tile);
      }

      finishObservation(
        rareRow[column] === "C"
          ? "sand_castle_target"
          : falseRareRough
            ? "false_rare_rough"
            : hasCommonItem
              ? "false_rare_item"
              : "rare_target",
        row,
        column,
        before,
        actionOutput,
      );
      return;
    }
  }

  // Preserve the existing whale and genuine uncombed rare target priorities.
  // If the planned rare is already combed, a visible castle is a deliberate
  // fallback before twinkle/rough sand. Its ordinary drops are NOT rare loot.
  const castle = firstVisibleSandCastle(layoutString, minute);
  if (castle) {
    print("Our rare tile is combed, but a sand castle is visible. Demolishing it.", HIGHLIGHT);
    const before = Session.current();
    const output = cliExecuteOutput(`beach comb ${castle.row} ${castle.column}`);
    finishObservation("sand_castle_fallback", castle.row, castle.column, before, output);
    return;
  }

  const firstTwinkleRow = Array.from(layout.entries()).find((rowLayout) =>
    rowLayout[1].includes("t"),
  );
  if (firstTwinkleRow) {
    print("Our rare tile is combed, but we found a twinkle!", HIGHLIGHT);
    const twinkleColumn = firstTwinkleRow[1].findIndex((x) => x === "t");
    const before = Session.current();
    const output = cliExecuteOutput(`beach comb ${firstTwinkleRow[0]} ${twinkleColumn}`);
    finishObservation("twinkle_fallback", firstTwinkleRow[0], twinkleColumn, before, output);
    return;
  }

  const firstRoughRow = Array.from(layout.entries()).find((rowLayout) =>
    rowLayout[1].includes("r"),
  );
  if (firstRoughRow) {
    print(
      "Our rare tile is combed, but we found some rough sand. So I guess there's that.",
      HIGHLIGHT,
    );
    const roughcolumn = firstRoughRow[1].findIndex((x) => x === "r");
    const before = Session.current();
    const output = cliExecuteOutput(`beach comb ${firstRoughRow[0]} ${roughcolumn}`);
    finishObservation("rough_fallback", firstRoughRow[0], roughcolumn, before, output);
    return;
  }

  print("We've exhausted all other options, so we're combing an already-combed tile.", HIGHLIGHT);
  const before = Session.current();
  const output = cliExecuteOutput(`beach comb ${row} ${column}`);
  finishObservation("exhausted_fallback", row, column, before, output);
}

// Alright now this is pretty cool
// We need a way to shuffle the array deterministically--we want it to have the same order for every player every time
// Obviously what that means is that we seed it by player id.
// Have you ever shoved an integer into the sine function? It's nasty
// This isn't super duper random. But it's random enough!
let seed = parseInt(myId());
function deterministicRandom(): number {
  seed++;
  return Math.sin(seed);
}

// Here, we disassemble the old array while constructing a new one.
// We pull a random card from the deck, put it on top of the new stack.
// Repeat ad infinitum
// If this was a more rigorous script, maybe we'd want to copy the input array so we don't destroy it
// For this script, meh
function deterministicShuffle<T>(array: T[]): T[] {
  const returnValue: T[] = [];
  while (array.length > 0) {
    const index = Math.floor(deterministicRandom() * array.length);
    returnValue.push(...array.splice(index));
  }
  return returnValue;
}

let shuffledArray: BeachTile[];

function getShuffledArray(): BeachTile[] {
  if (!shuffledArray) {
    shuffledArray = deterministicShuffle(rareTiles);
  }
  return shuffledArray;
}

// This comb function returns a boolean value based on whether we actually end up coming
// We predict whether the tile in question will be hidden by the tides, and if it will, we just don't go!
function comb(): boolean {
  const tileList = getShuffledArray();
  const index = (get("combo_lastTileCombed", 0) + 1) % tileList.length;
  const tile = tileList[index];

  // This little bit of tech comes from SSBBHax
  // The tides are on an 8-day cycle
  // We have 8-day months on the in-game calendar
  // Turns out to work out nicely!
  const dayOfMonth = 1 + (gamedayToInt() % 8);
  const rowsHidden = 4 - Math.abs(4 - dayOfMonth);
  const rowVisible = tile.row > rowsHidden;

  // If the row is visible and this has not been observed as a false rare
  const shouldComb = rowVisible && !isFalseRare(tile);

  if (shouldComb) _comb(tile);

  // We increment our lastTileCombed regardless of whether we actually comb it
  // This isn't best beheavior, but it isn't worst!
  set("combo_lastTileCombed", index);
  return shouldComb;
}

// A relay confirmation selects a pre-scored local same-player/day snapshot.
// No model inference runs during execution, and the model cannot supply coordinates.
function loadShadowTop11Route(requestedCombs?: number, freeOnly = true): BeachTile[] {
  const raw = String(fileToBuffer("don_combo_matrix_runtime.json") || "");
  if (!raw) abort("No frozen Shadow Route Lab snapshot; refresh first.");
  const snapshot = JSON.parse(raw) as ShadowRouteSnapshot;
  const invalid = new Set(
    getFalseRares().map((tile) => `${tile.minute},${tile.row},${tile.column}`),
  );
  const parameters = [
    snapshot,
    rareTiles,
    invalid,
    Number(myId()),
    gamedayToInt(),
    get("_freeBeachWalksUsed", 0),
    Date.now() / 1000,
  ] as const;
  return requestedCombs === undefined
    ? compileShadowTop11(...parameters)
    : compileWaterSheepRoute(...parameters, requestedCombs, freeOnly);
}

function printSession(session: Session) {
  const items: [Item, number][] = [...session.items];

  // Sorts the items to be printed from most profitable, to least
  items.sort(([item1, amount1], [item2, amount2]) => {
    return historicalPrice(item2) * amount2 - historicalPrice(item1) * amount1;
  });

  print(`-Found ${session.meat} meat`);
  for (const [item, quantity] of items) {
    print(`-Found ${quantity} ${item}`);
  }
}

// When called from the CLI, this will only ever have string inputs
// We use string | number so that people can call this directly from other scripts, should they so desire
// Realistically, everyone will do the CLI option. But it costs us nothing!
export function main(args?: string | number): void {
  // Sometimes people try to run things with insanely old mafia versions and run into problems
  // Think of this as babyproofing
  sinceKolmafiaRevision(26118);
  const invocationStartMs = Date.now(); // Includes optional pre-scoring and consent wait.

  // Read-only installation diagnostic. This string is deliberately absent
  // from upstream Combo, making executable resolution easy to verify.
  if (args === "info" || args === "help") {
    print("DonCombo extended CLI active (collision-resistant entrypoint: doncombo).", HIGHLIGHT);
    print(
      "Commands: doncombo N | doncombo watersheep-N | doncombo watersheep-free | doncombo shadow11",
    );
    print(
      "Read-only: doncombo info | doncombo help | doncombo lifetime | doncombo watersheep-preview",
    );
    print("Compatibility entrypoint: combo N (may conflict with upstream loathers/combo).");
    print("No beach walks or WaterSheep requests were made by this diagnostic.");
    return;
  }

  if (args === "lifetime") {
    const lifetime = Session.fromFile("combo_results.json");
    print("===LIFETIME RESULTS ===");
    printSession(lifetime);
    return;
  }

  if (args === "watersheep-preview") {
    // Read-only relay validation. It cannot wander, comb or request paid actions.
    setProperty("don_combo_shadow11_preview_status", "blocked");
    setProperty("don_combo_shadow11_preview_snapshot", "");
    try {
      if (get("don_combo_running", false)) throw new Error("Combo is already running.");
      const route = loadShadowTop11Route();
      const snapshot = JSON.parse(
        String(fileToBuffer("don_combo_matrix_runtime.json")),
      ) as ShadowRouteSnapshot;
      setProperty("don_combo_shadow11_preview_status", "ready");
      setProperty("don_combo_shadow11_preview_snapshot", snapshot.generated_at);
      setProperty(
        "don_combo_shadow11_preview_message",
        `Ready: ${route.length} free-only WaterSheep targets from snapshot ${snapshot.generated_at}.`,
      );
      print(
        `WaterSheep preview: ${route.length} ranked free combs available; no KoL actions taken.`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setProperty("don_combo_shadow11_preview_message", message);
      print(`WaterSheep preview blocked: ${message}`, "red");
    }
    return;
  }

  // Use a wrapper around session tracking to record our results
  // We do this by first tracking what the session results are right now
  // Later, we will subtract these items and meat from our final results
  if (get("don_combo_running", false)) abort("Another Combo run is already active.");
  const rawArg = typeof args === "string" ? args.trim() : args;
  const shadow11 = rawArg === "shadow11";
  const wsFree = rawArg === "watersheep-free";
  const wsPaidMatch = typeof rawArg === "string" ? /^watersheep-([1-9][0-9]*)$/.exec(rawArg) : null;
  const wsPaid = wsPaidMatch !== null;
  if (typeof rawArg === "string" && rawArg.startsWith("watersheep-") && !wsFree && !wsPaid)
    abort("Expected 'watersheep-free' or 'watersheep-<positive count>'.");
  const freeRemaining = Math.max(0, 11 - get("_freeBeachWalksUsed", 0));
  const wsCount = wsFree ? freeRemaining : wsPaid ? Number(wsPaidMatch![1]) : 0;
  if (
    (wsFree || wsPaid) &&
    (!Number.isInteger(wsCount) || wsCount < 1 || wsCount > MAX_WATERSHEEP_ROUTE_COMBS)
  )
    abort(wsFree ? "No free beach combs remain." : "WaterSheep route must request 1–100 combs.");
  if (wsPaid && wsCount > freeRemaining + myAdventures())
    abort("Insufficient remaining free combs and adventures for this explicit paid route.");

  // Warn BEFORE scoring, routing and beach actions, not after they have
  // produced data. Changes from OFF -> ON during a run never auto-enroll.
  set("don_combo_interrupt", false);
  let shareThisRun = shareDataEnabled();
  if (shareThisRun) {
    print("'don_combo_share_data=true' Your current beach findings are set to share.", "red");
    print(
      "If this is a mistake, hit Interrupt Comb in the relay for a safe stop, or Esc for a hard stop. In gCLI enter 'set don_combo_share_data=false' to turn off.",
      "red",
    );
    if (!cliExecute("wait 5")) {
      print("don_combo: share warning wait interrupted; no combs or Kmails sent.", "red");
      return;
    }
    if (consumeInterruptRequest()) {
      print("don_combo: interrupted during share warning; no combs or Kmails sent.", "red");
      return;
    }
    shareThisRun = shareDataEnabled();
    if (!shareThisRun) print("don_combo: sharing disabled before the run.", "gray");
  }
  if (wsFree || wsPaid) {
    print(
      `WaterSheep: pre-scoring ${wsCount} rare-front targets (${wsFree ? "free-only" : "adventure-cost allowed"})... please wait ${prescoreWaitPhrase(wsCount)} (estimated)`,
      HIGHLIGHT,
    );
    let lastPrintedRemaining = roundedPrescoreSeconds(wsCount);
    // Progress is tied to completed model responses, not an independent
    // countdown. Candidate pool size can include a blinded baseline target.
    prepareWaterSheepRoute(wsCount, (completed, total) => {
      const progress = prescoreProgressNotice(completed, total, lastPrintedRemaining);
      if (progress.message) {
        print(progress.message, "gray");
        lastPrintedRemaining = progress.rounded_remaining_seconds;
      }
    });
    print("WaterSheep: pre-scoring complete; ranked snapshot saved.", HIGHLIGHT);
  }
  const frozenRoute = shadow11
    ? loadShadowTop11Route()
    : wsFree || wsPaid
      ? loadShadowTop11Route(wsCount, wsFree)
      : null;
  const routeMode = wsPaid
    ? "watersheep-paid"
    : wsFree || shadow11
      ? "watersheep-free"
      : "combo-default";
  const freeOnly = wsFree || shadow11;
  const baseline = Session.current();

  // Here we collapse our two possibilities into one
  // If args is already a number, combs is a number
  // If args is a string, we convert it to a number
  const combs = frozenRoute
    ? frozenRoute.length
    : typeof args === "string"
      ? parseInt(args)
      : (args ?? 11 - get("_freeBeachWalksUsed"));
  if (!Number.isInteger(combs) || isNaN(combs)) abort("Invalid argument!");
  if (combs <= 0) return;
  const oldFilter = get("logPreferenceChangeFilter");
  set("don_combo_running", true);
  set("don_combo_last_run_status", "running");
  set("don_combo_last_run_requested", combs);
  set("don_combo_last_run_route_mode", routeMode);
  set("don_combo_last_run_paid_combs", 0);
  set("don_combo_last_run_combs", 0);
  set("don_combo_last_run_end_reason", "running");
  set("don_combo_last_run_interrupt_consumed", false);
  set("don_combo_last_run_started_at", new Date().toISOString());
  set("don_combo_last_run_ended_at", "");
  const mlEventsBefore = loadMlTraceEvents(0).total;
  set("don_combo_last_run_ml_events_before", mlEventsBefore);
  set("don_combo_last_run_ml_events_after", mlEventsBefore);
  set(
    "logPreferenceChangeFilter",
    [
      ...new Set([
        ...oldFilter.split(","),
        "spadingData",
        "combo_lastTileCombed",
        "_beachLayout",
        "_beachMinutes",
        "_beachCombing",
        "don_combo_interrupt",
        "don_combo_running",
        "don_combo_last_run_status",
        "don_combo_last_run_requested",
        "don_combo_last_run_route_mode",
        "don_combo_last_run_paid_combs",
        "don_combo_last_run_combs",
        "don_combo_last_run_end_reason",
        "don_combo_last_run_interrupt_consumed",
        "don_combo_last_run_started_at",
        "don_combo_last_run_ended_at",
        "don_combo_last_run_ml_events_before",
        "don_combo_last_run_ml_events_after",
      ]),
    ]
      .filter((x) => x)
      .join(","),
  );

  const frozenPlayer = Number(myId());
  const frozenGameday = gamedayToInt();
  const runContext: ShadowRunContext = {
    run_id: `${frozenGameday}-${frozenPlayer}-${Date.now()}`,
    gameday: frozenGameday,
    player_id: frozenPlayer,
    route_mode: routeMode,
    started_at: getProperty("don_combo_last_run_started_at"),
  };
  const freeBefore = get("_freeBeachWalksUsed", 0);
  activeShadowRun = runContext;
  const runInterface = startRunInterface(combs, invocationStartMs, routeMode);
  activeRunInterface = runInterface;
  activeLiveRareShare = shareThisRun ? [] : null;
  // Routed WaterSheep gets a pre-action prediction per target automatically;
  // vanilla Combo keeps the existing opt-in don_combo_ml_trace property.
  autoTraceWaterSheepRun = shadow11 || wsFree || wsPaid;
  let completedCombs = 0;
  let interrupted = false;
  let cleanFinish = false;
  print("+ Runtime timer started: " + runInterface.started_at, "gray");
  print(runProgress(0, combs), "gray");
  try {
    while (completedCombs < combs) {
      // A relay interrupt is cooperative: never cut through an in-flight comb.
      // If the request arrives between combs, stop before starting another one.
      if (consumeInterruptRequest()) {
        interrupted = true;
        break;
      }

      if (frozenRoute) {
        // Free-only guard at the exact action boundary. A changed counter
        // can never authorize paid turns or an unplanned tile.
        const before = get("_freeBeachWalksUsed", 0);
        const beforeAdventures = myAdventures();
        if (freeOnly && (before < 0 || before >= 11))
          throw new Error("No free combs remain; paid comb prevented.");
        if (!freeOnly && before >= 11 && beforeAdventures < 1)
          throw new Error("No adventures remain for a paid beach comb.");
        const target = frozenRoute[completedCombs];
        if (!target || gamedayToInt() !== frozenGameday || Number(myId()) !== frozenPlayer)
          throw new Error("Shadow route day/player changed during execution.");
        _comb(target);
        const after = get("_freeBeachWalksUsed", 0);
        const afterAdventures = myAdventures();
        const freeSpent = after === before + 1;
        const paidSpent = afterAdventures < beforeAdventures;
        if (freeOnly && (!freeSpent || paidSpent))
          throw new Error("Free-only action could not be verified; stopping.");
        if (!freeOnly && !freeSpent && !paidSpent)
          throw new Error("No verified beach comb or adventure spend; stopping.");
        if (paidSpent)
          set("don_combo_last_run_paid_combs", get("don_combo_last_run_paid_combs", 0) + 1);
        completedCombs++;
      } else {
        // Preserve normal Combo's deterministic shuffled rare route.
        if (comb()) completedCombs++;
      }

      print(runProgress(completedCombs, combs), "gray");
      // If the request arrived during the comb, the observation/loot trace has
      // already been finalized. Stop here before beginning the next target.
      if (consumeInterruptRequest()) {
        interrupted = true;
        break;
      }
    }

    if (interrupted) {
      print(
        `don_combo: interrupt received; ending cleanly after ${completedCombs} completed comb${completedCombs === 1 ? "" : "s"}.`,
        HIGHLIGHT,
      );
    }

    print("don_combo: beach combing finished; closing choice and finalizing results.", "gray");
    // Always leave the Beach choice cleanly, including cooperative interrupts.
    if (handlingChoice()) runChoice(5);
    if (get("spadingScript").toLowerCase().includes("excavator")) cliExecute("spade autoconfirm");
    // A late relay interrupt must also suppress external sharing.
    if (consumeInterruptRequest()) interrupted = true;
    cleanFinish = true;
    if (!interrupted && shareThisRun && shareDataEnabled() && activeLiveRareShare?.length) {
      const batches = liveRareKmailBatches(activeLiveRareShare);
      let sent = 0;
      if (!safeToKmail()) {
        print("don_combo: sharing skipped (combat/choice state); no retry queued.", "red");
      } else {
        for (const batch of batches) {
          if (!shareDataEnabled() || get("don_combo_interrupt", false) || !safeToKmail()) break;
          let delivered = false;
          try {
            delivered = Kmail.send(LIVE_RARE_SHARE_RECIPIENT, batch);
          } catch {
            delivered = false;
          }
          if (!delivered) {
            print("don_combo: sharing Kmail failed; no retry queued.", "red");
            break;
          }
          sent++;
        }
        if (sent)
          print(
            `don_combo: sent ${sent} opt-in live rare-tile Kmail batch${sent === 1 ? "" : "es"}.`,
            "gray",
          );
      }
    }
  } finally {
    activeLiveRareShare = null; // discard, never persist for replay
    activeRunInterface = null; // no global report state between invocations
    set("logPreferenceChangeFilter", oldFilter);
    set("don_combo_running", false);
    set("don_combo_interrupt", false);
    set("don_combo_last_run_combs", completedCombs);
    set(
      "don_combo_last_run_status",
      cleanFinish ? (interrupted ? "interrupted" : "completed") : "failed",
    );
    set(
      "don_combo_last_run_end_reason",
      cleanFinish
        ? interrupted
          ? "user_cooperative_interrupt"
          : "requested_combs_completed"
        : "runtime_failure",
    );
    set("don_combo_last_run_ended_at", new Date().toISOString());
    // One readback supplies both the final counter and the run-scoped tail.
    const finalTrace = loadMlTraceEvents(Math.max(100, completedCombs + 12));
    set("don_combo_last_run_ml_events_after", finalTrace.total);
    try {
      const learned = summarizeShadowRun(
        finalTrace.events,
        runContext,
        getProperty("don_combo_last_run_ended_at"),
        cleanFinish ? (interrupted ? "interrupted" : "completed") : "failed",
        combs,
        completedCombs,
        get("_freeBeachWalksUsed", 0) - freeBefore,
        get("don_combo_last_run_paid_combs", 0),
      );
      appendBufferToFile(`${JSON.stringify(learned)}\n`, "don_combo_daily_shadow_runs.jsonl");
      setProperty("don_combo_last_learning_run_id", runContext.run_id);
      setProperty("don_combo_last_learning_traced", String(learned.prediction_ready));
      setProperty("don_combo_last_learning_events", String(learned.recorded_events));
      print(
        `Shadow learning: ${learned.recorded_events}/${completedCombs} events, ${learned.prediction_ready} pre-action predictions, ${learned.incidental_fallback_twinkles} incidental twinkle fallbacks, ${learned.planned_rare_previously_combed} previously-combed rare targets (no model training or extra beach turns).`,
        "gray",
      );
    } catch (error) {
      print(
        `don_combo: daily shadow learning summary unavailable: ${error instanceof Error ? error.message : String(error)}`,
        "gray",
      );
    } finally {
      autoTraceWaterSheepRun = false;
      activeShadowRun = null;
    }
  }

  // Subtract the original session from our current session
  // the resulting session will only have what we found during combo
  const final = Session.current().diff(baseline);
  if (interrupted) print("=== INTERRUPTED CLEANLY ===", HIGHLIGHT);
  print("=== RESULTS ===");
  printSession(final);

  const lifetime = Session.add(final, Session.fromFile("combo_results.json"));
  lifetime.toFile("combo_results.json");

  // Final human-readable report and passive machine-readable receipt.
  // Read only the local mallprices.txt cache; never invoke mallPrice().
  const reportEndedAtMs = Date.now();
  const observationLines = renderRunObservation(runInterface, completedCombs, reportEndedAtMs);
  for (const line of observationLines) print(line, "gray");
  let priceText = "";
  try { priceText = String(fileToBuffer("mallprices.txt") || ""); } catch { /* absent cache */ }
  const value = renderRunValue(
    [...final.items].map(([item, quantity]) => ({ id: item.id, name: item.name, quantity })),
    final.meat,
    priceText,
  );
  for (const line of value.lines) print(line, "gray");
  print("");
  try {
    appendBufferToFile(
      JSON.stringify({
        ...runInterface,
        completed_combs: completedCombs,
        status: interrupted ? "interrupted" : "completed",
        ended_at: new Date(reportEndedAtMs).toISOString(),
        elapsed_ms: reportEndedAtMs - invocationStartMs,
        value: { estimated_total_known_meat: value.estimated_total_known_meat,
          unpriced_item_types: value.unpriced, local_cache_valid: value.file_valid },
      }) + "\n",
      "don_combo_run_reports.jsonl",
    );
  } catch (error) {
    print("don_combo: CLI report archive unavailable: " + String(error), "gray");
  }
  print("don_combo: results saved; script finished.", "gray");
}
