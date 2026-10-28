import { appendBufferToFile, bufferToFile, fileToBuffer, getProperty, turnsPlayed } from "kolmafia";
import { emptyRecoveryLedger, observeTile, stateAt, tileKey, type TileRecoveryLedger } from "./recovery";

import type { ObservationEntry, ObservationLedger } from "./contracts";

export type BeachOutcome =
  | "whale"
  | "rare_target"
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
  pre_action_prediction?: Record<string, unknown> | null;
}

export interface MlTraceEvent {
  schema: "don-combo-ml-event/v0.1";
  event_id: string;
  observed_at: string;
  turn: number;
  minute: number;
  outcome: BeachOutcome;
  planned_target: BeachObservationDetail["planned_target"];
  actual_comb: BeachObservationDetail["actual_comb"];
  items: Record<string, number>;
  meat: number;
  layout: string;
  layout_symbols: Record<string, number>;
  pre_action_prediction: Record<string, unknown> | null;
}

export interface MlTraceLog {
  file: string;
  total: number;
  events: MlTraceEvent[];
}

const LEDGER_FILE = "don_combo_matrix_ledger.json";
const ML_EVENT_FILE = "don_combo_ml_events.jsonl";
const RECOVERY_FILE = "don_combo_tile_recovery.json";
const NON_RARE_LOOT = new Set([
  "grain of sand", "sand dollar", "dull fish scale", "rough fish scale",
  "lucky rabbitfish fin", "spearfish fishing spear", "waders",
  "pristine fish scale", "piece of coral",
]);
export function loadTileRecoveryLedger(): TileRecoveryLedger {
  try {
    const raw = String(fileToBuffer(RECOVERY_FILE) || "").trim();
    if (!raw) return emptyRecoveryLedger();
    const parsed = JSON.parse(raw) as TileRecoveryLedger;
    if (parsed.schema !== "don-combo-tile-recovery/v0.1" ||
        !parsed.tiles || typeof parsed.tiles !== "object") return emptyRecoveryLedger();
    return parsed;
  } catch {
    return emptyRecoveryLedger();
  }
}
function captureTileRecovery(minute: number, layout: string, outcome: BeachOutcome,
  detail: BeachObservationDetail, atEpoch: number): void {
  const corpus = JSON.parse(String(fileToBuffer("raretiles.json") || "[]")) as
    Array<{ minute: number; row: number; column: number }>;
  const matches = corpus.filter(tile => tile.minute === minute);
  if (!matches.length) return;
  const ledger = loadTileRecoveryLedger();
  const actual = detail.actual_comb;
  const positiveItems = Object.entries(detail.items || {})
    .filter(([name, quantity]) => quantity > 0 && !NON_RARE_LOOT.has(name.toLowerCase()))
    .sort(([a], [b]) => a.localeCompare(b));
  const twinkleVision = getProperty("hasTwinkleVision") === "true";
  for (const tile of matches) {
    const key = tileKey(tile.minute, tile.row, tile.column);
    const selected = !!actual && actual.minute === tile.minute &&
      actual.row === tile.row && actual.column === tile.column;
    // A rare_target is an ATTEMPT, never sufficient for a harvest event alone.
    const harvested = selected && outcome === "rare_target" && positiveItems.length > 0
      ? positiveItems[0][0] : null;
    ledger.tiles[key] = observeTile(ledger.tiles[key], atEpoch,
      stateAt(layout, tile.row, tile.column, twinkleVision), harvested);
  }
  ledger.updated_at = new Date(atEpoch * 1000).toISOString();
  bufferToFile(JSON.stringify(ledger) + "\n", RECOVERY_FILE);
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
    turn: turnsPlayed(),
    minute,
    outcome,
    planned_target: detail.planned_target || null,
    actual_comb: actual,
    items: detail.items || {},
    meat: detail.meat || 0,
    layout,
    layout_symbols: counts,
    pre_action_prediction: detail.pre_action_prediction || null,
  };
  appendBufferToFile(`${JSON.stringify(event)}\n`, ML_EVENT_FILE);
  try {
    captureTileRecovery(minute, layout, outcome, detail, Math.floor(now.getTime() / 1000));
  } catch {
    // Recovery indexing is supplemental; never break the existing Combo path.
  }
}
