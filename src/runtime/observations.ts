import {
  appendBufferToFile,
  bufferToFile,
  fileToBuffer,
  getProperty,
  myId,
  turnsPlayed,
} from "kolmafia";

import { parseBottleOutput, type BottleObservation } from "./bottle-observer";
import type { ObservationEntry, ObservationLedger } from "./contracts";
import {
  emptyRecoveryLedger,
  observeTile,
  stateAt,
  tileKey,
  type TileRecoveryLedger,
} from "./recovery";
import { sandCastleAction, type SandCastleAction } from "./sandcastle-observer";
import {
  addScratchVisit,
  emptyScratchLedger,
  SCRATCH_LEDGER_SCHEMA,
  type ScratchLedger,
} from "./scratch-interest";
import type { ShadowRunContext } from "./shadow-learning";
import { poolForItem } from "./two-pool-cooldown";
import { recordPoolLabels, type PoolObservation } from "./two-pool-cooldown";

export type BeachOutcome =
  | "whale"
  | "rare_target"
  | "sand_castle_target"
  | "sand_castle_fallback"
  | "false_rare_item"
  | "false_rare_rough"
  | "twinkle_fallback"
  | "rough_fallback"
  | "exhausted_fallback"
  | "unknown";

export interface BeachObservationDetail {
  planned_target?: { minute: number; row: number; column: number } | null;
  actual_comb?: { minute: number; row: number; column: number } | null;
  items?: Record<string, number>;
  meat?: number;
  action_output?: string;
  pre_action_prediction?: Record<string, unknown> | null;
  pre_action_observed_at?: string;
  run_context?: ShadowRunContext | null;
}

export interface MlTraceEvent {
  schema: "don-combo-ml-event/v0.1";
  event_id: string;
  observed_at: string;
  pre_action_observed_at?: string;
  turn: number;
  minute: number;
  outcome: BeachOutcome;
  planned_target: BeachObservationDetail["planned_target"];
  actual_comb: BeachObservationDetail["actual_comb"];
  items: Record<string, number>;
  meat: number;
  special_events?: Array<BottleObservation | SandCastleAction>;
  action_output_capture?: "captured" | "empty" | "legacy-unavailable";
  layout: string;
  layout_symbols: Record<string, number>;
  pre_action_prediction: Record<string, unknown> | null;
  pool_observations?: PoolObservation[];
  run_context?: ShadowRunContext | null;
}

export interface MlTraceLog {
  file: string;
  total: number;
  events: MlTraceEvent[];
}

const LEDGER_FILE = "don_combo_matrix_ledger.json";
const ML_EVENT_FILE = "don_combo_ml_events.jsonl";
const RECOVERY_FILE = "don_combo_tile_recovery.json";
const SCRATCH_FILE = "don_combo_scratch_observations.json";

// The live scratch ledger is player-scoped. Legacy unbound ML events are kept
// separately by the read-only historical backfill and never rewritten here.
export function loadScratchLedger(): ScratchLedger {
  const player = Number(myId());
  try {
    const raw = String(fileToBuffer(SCRATCH_FILE) || "").trim();
    if (!raw) return emptyScratchLedger(player);
    const parsed = JSON.parse(raw) as ScratchLedger;
    if (
      parsed.schema !== SCRATCH_LEDGER_SCHEMA ||
      parsed.player_id !== player ||
      !parsed.fronts ||
      typeof parsed.fronts !== "object"
    )
      return emptyScratchLedger(player);
    return parsed;
  } catch {
    return emptyScratchLedger(player);
  }
}

export function recordScratchObservation(minute: number, layout: string, observedAt: string): void {
  const ledger = loadScratchLedger();
  if (!addScratchVisit(ledger, minute, layout, observedAt, "live")) return;
  bufferToFile(`${JSON.stringify(ledger)}\n`, SCRATCH_FILE);
}

export function loadTileRecoveryLedger(): TileRecoveryLedger {
  try {
    const raw = String(fileToBuffer(RECOVERY_FILE) || "").trim();
    if (!raw) return emptyRecoveryLedger();
    const parsed = JSON.parse(raw) as TileRecoveryLedger;
    if (
      parsed.schema !== "don-combo-tile-recovery/v0.1" ||
      !parsed.tiles ||
      typeof parsed.tiles !== "object"
    )
      return emptyRecoveryLedger();
    return parsed;
  } catch {
    return emptyRecoveryLedger();
  }
}
function captureTileRecovery(
  minute: number,
  layout: string,
  outcome: BeachOutcome,
  detail: BeachObservationDetail,
  atEpoch: number,
): void {
  const corpus = JSON.parse(String(fileToBuffer("raretiles.json") || "[]")) as Array<{
    minute: number;
    row: number;
    column: number;
  }>;
  const matches = corpus.filter((tile) => tile.minute === minute);
  if (!matches.length) return;
  const ledger = loadTileRecoveryLedger();
  const actual = detail.actual_comb;
  // Only explicitly classified rare reward deltas may mark a known tile as
  // harvested for cooldown calculations. Many ordinary beach items were not
  // included in the old generic exclusion list, causing false harvests.
  // Unclassified deltas are still preserved in the immutable ML event log.
  const positiveItems = Object.entries(detail.items || {})
    .filter(([name, quantity]) => quantity > 0 && poolForItem(name, quantity) !== null)
    .sort(([a], [b]) => a.localeCompare(b));
  const twinkleVision = getProperty("hasTwinkleVision") === "true";
  for (const tile of matches) {
    // A submerged row absent from the layout is not an observation.
    if (!layout.split(",").some((part) => part.startsWith(`${tile.row}:`))) continue;
    const key = tileKey(tile.minute, tile.row, tile.column);
    const selected =
      !!actual &&
      actual.minute === tile.minute &&
      actual.row === tile.row &&
      actual.column === tile.column;
    // A rare_target is an ATTEMPT, never sufficient for a harvest event alone.
    const harvested =
      selected && outcome === "rare_target" && positiveItems.length > 0
        ? positiveItems[0][0]
        : null;
    ledger.tiles[key] = observeTile(
      ledger.tiles[key],
      atEpoch,
      stateAt(layout, tile.row, tile.column, twinkleVision),
      harvested,
    );
  }
  ledger.updated_at = new Date(atEpoch * 1000).toISOString();
  bufferToFile(`${JSON.stringify(ledger)}\n`, RECOVERY_FILE);
}

function blankLedger(): ObservationLedger {
  return {
    schema: "don-combo-observation-ledger/v0.6",
    fronts: {},
    updated_at: null,
  };
}

export function loadObservationLedger(): ObservationLedger {
  const raw = String(fileToBuffer(LEDGER_FILE) || "").trim();
  if (!raw) return blankLedger();
  try {
    const parsed = JSON.parse(raw) as ObservationLedger;
    if (!parsed || typeof parsed !== "object" || typeof parsed.fronts !== "object") {
      return blankLedger();
    }
    parsed.schema = "don-combo-observation-ledger/v0.6";
    return parsed;
  } catch {
    return blankLedger();
  }
}

export function loadMlTraceEvents(limit = 500): MlTraceLog {
  let raw: string;
  try {
    raw = String(fileToBuffer(ML_EVENT_FILE) || "");
  } catch {
    raw = "";
  }
  const events: MlTraceEvent[] = [];
  let total = 0;
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const parsed = JSON.parse(trimmed) as MlTraceEvent;
      if (parsed && parsed.schema === "don-combo-ml-event/v0.1") {
        total++;
        events.push(parsed);
      }
    } catch {
      // Keep a malformed historical line from breaking live Combo.
    }
  }
  return {
    file: ML_EVENT_FILE,
    total,
    events: events.slice(Math.max(0, events.length - limit)),
  };
}

function ensureEntry(ledger: ObservationLedger, minute: number): ObservationEntry {
  const key = String(minute);
  if (!ledger.fronts[key]) {
    ledger.fronts[key] = {
      layout_snapshots: 0,
      session_events: 0,
      symbols: { whale: 0, twinkle: 0, rough: 0, combed: 0, other: 0, visible: 0 },
      outcomes: {},
      items: {},
      last_seen_epoch: null,
      last_seen_turn: null,
      sources: [],
      last_layout: null,
    };
  }
  const entry = ledger.fronts[key];
  entry.symbols ??= { whale: 0, twinkle: 0, rough: 0, combed: 0, other: 0, visible: 0 };
  entry.outcomes ??= {};
  entry.items ??= {};
  entry.sources ??= [];
  return entry;
}

function add(map: Record<string, number>, key: string, amount = 1): void {
  map[key] = (map[key] || 0) + amount;
}

function countLayout(layout: string): Record<string, number> {
  const counts: Record<string, number> = {
    whale: 0,
    sand_castle: 0,
    twinkle: 0,
    rough: 0,
    combed: 0,
    other: 0,
    visible: 0,
  };
  for (const part of String(layout || "").split(",")) {
    const split = part.indexOf(":");
    if (split < 0) continue;
    const symbols = part.substring(split + 1).slice(0, 10);
    for (const symbol of symbols) {
      counts.visible++;
      if (symbol === "W") counts.whale++;
      else if (symbol === "C") counts.sand_castle++;
      else if (symbol === "t") counts.twinkle++;
      else if (symbol === "r") counts.rough++;
      else if (symbol === "c") counts.combed++;
      else counts.other++;
    }
  }
  return counts;
}

export function recordBeachObservation(
  minute: number,
  layout: string,
  outcome: BeachOutcome,
  detail: BeachObservationDetail = {},
): void {
  if (!Number.isInteger(minute) || minute < 1 || minute > 10000 || !layout) return;

  const ledger = loadObservationLedger();
  const entry = ensureEntry(ledger, minute);
  entry.session_events = (entry.session_events || 0) + 1;
  entry.layout_snapshots = (entry.layout_snapshots || 0) + 1;

  const counts = countLayout(layout);
  for (const [name, amount] of Object.entries(counts)) add(entry.symbols!, name, amount);
  add(entry.outcomes!, outcome);
  for (const [name, amount] of Object.entries(detail.items || {})) {
    if (amount) add(entry.items!, name, amount);
  }

  if (!entry.sources!.includes("combo-native")) entry.sources!.push("combo-native");
  const now = new Date();
  entry.last_seen_epoch = Math.floor(now.getTime() / 1000);
  entry.last_seen_turn = turnsPlayed();
  entry.last_layout = layout;
  ledger.updated_at = now.toISOString();

  bufferToFile(`${JSON.stringify(ledger, null, 2)}\n`, LEDGER_FILE);

  const actual = detail.actual_comb || null;
  const event: MlTraceEvent = {
    schema: "don-combo-ml-event/v0.1",
    event_id: `${now.getTime()}-${turnsPlayed()}-${minute}-${
      actual ? `${actual.row}-${actual.column}` : "na"
    }`,
    observed_at: now.toISOString(),
    pre_action_observed_at: detail.pre_action_observed_at || undefined,
    turn: turnsPlayed(),
    minute,
    outcome,
    planned_target: detail.planned_target || null,
    actual_comb: actual,
    items: detail.items || {},
    meat: detail.meat || 0,
    special_events: [
      ...parseBottleOutput(detail.action_output || ""),
      ...(actual
        ? [
            sandCastleAction(
              layout,
              minute,
              actual.row,
              actual.column,
              outcome,
              detail.action_output || "",
            ),
          ].filter((action): action is SandCastleAction => action !== null)
        : []),
    ],
    action_output_capture:
      detail.action_output === undefined
        ? "legacy-unavailable"
        : detail.action_output.length
          ? "captured"
          : "empty",
    layout,
    layout_symbols: counts,
    pre_action_prediction: detail.pre_action_prediction || null,
    run_context: detail.run_context || null,
  };
  // Explicit structured pool labels in EVERY ordinary, shadow, free and paid
  // routed event; original deltas/layout are preserved for historical replay.
  try {
    event.pool_observations = recordPoolLabels(event, Number(myId()));
  } catch {
    event.pool_observations = [];
  }
  appendBufferToFile(`${JSON.stringify(event)}\n`, ML_EVENT_FILE);
  try {
    recordScratchObservation(minute, layout, detail.pre_action_observed_at || now.toISOString());
  } catch {
    // Scratch evidence is supplemental; original ML event log is a durable
    // backfill source, and errors cannot cause duplicate beach actions.
  }
  try {
    captureTileRecovery(minute, layout, outcome, detail, Math.floor(now.getTime() / 1000));
  } catch {
    // Recovery indexing is supplemental; never break the existing Combo path.
  }
}
