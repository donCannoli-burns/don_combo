import { bufferToFile, fileToBuffer, turnsPlayed } from "kolmafia";
import type { ObservationEntry, ObservationLedger } from "./contracts";

export type BeachOutcome =
  | "whale"
  | "rare_target"
  | "false_rare_rough"
  | "twinkle_fallback"
  | "rough_fallback"
  | "exhausted_fallback"
  | "unknown";

const LEDGER_FILE = "don_combo_matrix_ledger.json";

function blankLedger(): ObservationLedger {
  return {
    schema: "don-combo-observation-ledger/v0.5",
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
    parsed.schema = "don-combo-observation-ledger/v0.5";
    return parsed;
  } catch {
    return blankLedger();
  }
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
): void {
  if (!Number.isInteger(minute) || minute < 1 || minute > 10000 || !layout) return;

  const ledger = loadObservationLedger();
  const entry = ensureEntry(ledger, minute);
  entry.session_events = (entry.session_events || 0) + 1;
  entry.layout_snapshots = (entry.layout_snapshots || 0) + 1;

  const counts = countLayout(layout);
  for (const [name, amount] of Object.entries(counts)) add(entry.symbols!, name, amount);
  add(entry.outcomes!, outcome);

  if (!entry.sources!.includes("combo-native")) entry.sources!.push("combo-native");
  entry.last_seen_epoch = Math.floor(Date.now() / 1000);
  entry.last_seen_turn = turnsPlayed();
  entry.last_layout = layout;
  ledger.updated_at = new Date().toISOString();

  bufferToFile(`${JSON.stringify(ledger, null, 2)}\n`, LEDGER_FILE);
}
