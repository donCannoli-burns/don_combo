/* eslint-disable @typescript-eslint/no-explicit-any, prefer-template, eqeqeq, no-useless-assignment */
import {
  appendBufferToFile,
  bufferToFile,
  fileToBuffer,
  gamedayToInt,
  getProperty,
  myId,
  print,
  sessionLogs,
  urlEncode,
  visitUrl,
} from "kolmafia";

import {
  type BeachTile,
  type Candidate,
  type CandidateEvidence,
  type ObservationLedger,
  type RarePoint,
  type RuntimeRequestV1,
  type RuntimeResponseV1,
  type WaterSheepRequest,
  type WaterSheepResponse,
  WATERSHEEP_EVIDENCE_CONTRACT,
  decodeRuntimeRequest,
  fact,
  relation,
} from "./runtime/contracts";
import {
  loadMlTraceEvents,
  loadObservationLedger,
  loadTileRecoveryLedger,
} from "./runtime/observations";
import { recoveryFeatures, tileKey, type TileRecoveryLedger } from "./runtime/recovery";

const GRID = 1024;
const REAL = 1_000_000;
const LABELS = ["rare", "whale", "sandcastle", "twinkle", "regular", "scratched"] as const;
const MODEL_KEYS: Record<string, (typeof LABELS)[number]> = {
  A: "rare",
  B: "whale",
  C: "sandcastle",
  D: "twinkle",
  E: "regular",
  F: "scratched",
};
const WEIGHTS: Record<(typeof LABELS)[number], number> = {
  rare: 1,
  whale: 0.86,
  sandcastle: 0.66,
  twinkle: 0.38,
  regular: 0.1,
  scratched: 0,
};
const ENDPOINT = "http://127.0.0.1:8766/v1/kolmafia";
const DESIGN_REFERENCE = {
  repository: "es-3581100/math-by-design",
  commit: "4f3cfebc0bc8f2f243080d9c758290323eeaf595",
  use: "hierarchy, evidence/provenance separation, semantic handoff; reference not template",
};
const TYPE_REFERENCE = {
  repository: "together-science/symtype",
  use: "explicit properties, relations, and indeterminate truth as TypeScript design inspiration only",
};
const REPRESENTATION_REFERENCE = {
  repository: "es-3581100/Kotlin-Studio",
  path: "Sacred-Computations-Map",
  commit: "244b4cf4445abc4026975cdd6d2bbef6ded1591f",
  use: "one semantic dataset projected as linked graph, spatial matrix, inspector, signal profile, and exact readable cross-index",
};
const HILBERT_UI_REFERENCE = {
  source: "user-provided hilbert_hashtable.html",
  sha256: "6d2cb93d716a72789569005e3d41cd4eb3b227602eaace7e96720f45acd9ceac",
  use: "direct cell -> Hilbert d -> bucket -> table inspection and bucket isolation",
};

function unescapeAshField(value: string): string {
  let output = "";
  let escaped = false;
  for (const ch of value) {
    if (!escaped) {
      if (ch === "\\") escaped = true;
      else output += ch;
      continue;
    }
    if (ch === "n") output += "\n";
    else if (ch === "t") output += "\t";
    else output += ch;
    escaped = false;
  }
  if (escaped) output += "\\";
  return output;
}

function escapeAshField(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
}

function readFlatAshMap(path: string): Record<string, string> {
  const raw = String(fileToBuffer(path) || "");
  const result: Record<string, string> = {};
  for (const line of raw.split(/\r?\n/)) {
    if (!line) continue;
    const tab = line.indexOf("\t");
    if (tab < 0) continue;
    const key = unescapeAshField(line.substring(0, tab));
    const value = unescapeAshField(line.substring(tab + 1));
    result[key] = value;
  }
  return result;
}

function writeFlatAshMap(path: string, values: Record<string, string>): void {
  const lines = Object.keys(values)
    .sort()
    .map((key) => `${escapeAshField(key)}\t${escapeAshField(values[key])}`);
  bufferToFile(`${lines.join("\n")}\n`, path);
}

function n(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function round(value: number, places = 6): number {
  const scale = Math.pow(10, places);
  return Math.round(value * scale) / scale;
}

function dFor(minute: number, row: number, column: number): number {
  return (minute - 1) * 100 + (row - 1) * 10 + column;
}

function xyFor(d: number): [number, number] {
  let x = 0;
  let y = 0;
  let t = d;
  let s = 1;
  while (s < GRID) {
    const rx = (t >> 1) & 1;
    const ry = (t ^ rx) & 1;
    if (ry === 0) {
      if (rx === 1) {
        x = s - 1 - x;
        y = s - 1 - y;
      }
      const temp = x;
      x = y;
      y = temp;
    }
    x += s * rx;
    y += s * ry;
    t >>= 2;
    s <<= 1;
  }
  return [x, y];
}

function parseFalseRares(): Set<string> {
  const result = new Set<string>();
  for (const raw of String(getProperty("combo_false_rares") || "").split(";")) {
    if (/^\d+,\d+,\d+$/.test(raw)) result.add(raw);
  }
  return result;
}

function loadRarePoints(): RarePoint[] {
  const parsed = JSON.parse(String(fileToBuffer("raretiles.json") || "[]")) as BeachTile[];
  const falseRares = parseFalseRares();
  return parsed
    .filter(
      (tile) =>
        Number.isInteger(tile.minute) &&
        Number.isInteger(tile.row) &&
        Number.isInteger(tile.column) &&
        tile.minute >= 1 &&
        tile.minute <= 10000 &&
        tile.row >= 1 &&
        tile.row <= 10 &&
        tile.column >= 0 &&
        tile.column <= 9,
    )
    .map((tile) => {
      const d = dFor(tile.minute, tile.row, tile.column);
      const [x, y] = xyFor(d);
      return {
        ...tile,
        d,
        x,
        y,
        false_rare: falseRares.has(`${tile.minute},${tile.row},${tile.column}`),
      };
    });
}

function comboShuffle(points: RarePoint[], player: number): RarePoint[] {
  const work = points.slice();
  const output: RarePoint[] = [];
  let seed = player;
  while (work.length) {
    seed++;
    const index = Math.floor(Math.sin(seed) * work.length);
    output.push(...work.splice(index));
  }
  return output;
}

function comboBaseline(points: RarePoint[]) {
  if (!points.length) return null;
  const shuffled = comboShuffle(points, n(myId()));
  const day = 1 + (gamedayToInt() % 8);
  const rowsHidden = 4 - Math.abs(4 - day);
  const last = n(getProperty("combo_lastTileCombed"), 0);
  for (let step = 1; step <= shuffled.length; step++) {
    const index = (last + step) % shuffled.length;
    const tile = shuffled[index];
    if (tile.row > rowsHidden && !tile.false_rare) {
      return {
        minute: tile.minute,
        row: tile.row,
        column: tile.column,
        d: tile.d,
        x: tile.x,
        y: tile.y,
        shuffled_index: index,
        skipped_inaccessible: step - 1,
        rows_hidden: rowsHidden,
        player: n(myId()),
        gameday: gamedayToInt(),
      };
    }
  }
  return null;
}

function loadContext(): { context: Record<string, unknown>; file: string } {
  const map = readFlatAshMap("kol-goblin-docs/runtime.tsv");
  if (map.player_id && map.gameday) {
    return {
      context: {
        player: n(map.player_id),
        player_name: map.player || null,
        gameday: n(map.gameday),
        captured_at: map.generated_at || null,
        source: "kol-goblin-docs",
      },
      file: "kol-goblin-docs/runtime.tsv",
    };
  }
  return {
    context: {
      player: n(myId()),
      gameday: gamedayToInt(),
      captured_at: null,
      source: "kolmafia-native",
    },
    file: "KoLmafia native functions",
  };
}

function symbolRates(entry: Record<string, any>): Record<string, number> {
  const symbols = (entry.symbols || {}) as Record<string, number>;
  const visible = Math.max(1, n(symbols.visible));
  const result: Record<string, number> = {};
  for (const key of ["whale", "twinkle", "rough", "combed", "other"]) {
    result[key] = round(n(symbols[key]) / visible);
  }
  return result;
}

function outcomeRates(entry: Record<string, any>): Record<string, number> {
  const outcomes = (entry.outcomes || {}) as Record<string, number>;
  const events = Math.max(1, n(entry.session_events));
  const result: Record<string, number> = {};
  for (const key of [
    "whale",
    "rare_target",
    "false_rare_rough",
    "twinkle_fallback",
    "rough_fallback",
    "exhausted_fallback",
    "unknown",
  ]) {
    result[key] = round(n(outcomes[key]) / events);
  }
  return result;
}

function evidenceFor(
  minute: number,
  current: number,
  ledger: ObservationLedger,
  tile?: BeachTile,
  recoveryLedger?: TileRecoveryLedger,
): CandidateEvidence {
  const entry = (ledger.fronts[String(minute)] || {}) as Record<string, any>;
  const layouts = n(entry.layout_snapshots);
  const events = n(entry.session_events);
  const seen = n(entry.last_seen_epoch, 0);
  const d = dFor(minute, 1, 0);
  const [x, y] = xyFor(d);
  return {
    minute_fraction: round((minute - 1) / 9999),
    hilbert_bucket_256: Math.floor(d / 4096),
    distance_from_current: current ? Math.abs(minute - current) : null,
    layout_snapshots: layouts,
    session_events: events,
    observation_count: layouts + events,
    last_seen_age_hours: seen ? round(Math.max(0, Date.now() / 1000 - seen) / 3600, 3) : null,
    last_seen_turn: entry.last_seen_turn == null ? null : n(entry.last_seen_turn),
    cooldown: recoveryFeatures(
      tile && recoveryLedger
        ? recoveryLedger.tiles[tileKey(tile.minute, tile.row, tile.column)]
        : undefined,
      Date.now() / 1000,
    ),
    observed_symbol_rates: symbolRates(entry),
    observed_outcome_rates: outcomeRates(entry),
    sand_per_event: events ? round(n((entry.items || {})["grain of sand"]) / events, 4) : 0,
    representative: { d, x, y, row: 1, column: 0 },
  };
}

function observationAtlas(ledger: ObservationLedger) {
  return Object.entries(ledger.fronts)
    .map(([minuteText, raw]) => {
      const minute = n(minuteText);
      const entry = raw as Record<string, any>;
      const dStart = dFor(minute, 1, 0);
      const dEnd = dFor(minute, 10, 9);
      return {
        minute,
        d_start: dStart,
        d_end: dEnd,
        bucket_start_256: Math.floor(dStart / 4096),
        bucket_end_256: Math.floor(dEnd / 4096),
        layout_snapshots: n(entry.layout_snapshots),
        session_events: n(entry.session_events),
        observation_count: n(entry.layout_snapshots) + n(entry.session_events),
        last_seen_epoch: entry.last_seen_epoch == null ? null : n(entry.last_seen_epoch),
        last_seen_turn: entry.last_seen_turn == null ? null : n(entry.last_seen_turn),
        symbol_counts: entry.symbols || {},
        symbol_rates: symbolRates(entry),
        outcome_counts: entry.outcomes || {},
        outcome_rates: outcomeRates(entry),
        items: entry.items || {},
        sources: Array.isArray(entry.sources) ? entry.sources : [],
        last_layout: entry.last_layout || null,
      };
    })
    .sort((a, b) => a.minute - b.minute);
}

function sampleMinutes(
  ledger: ObservationLedger,
  eligibleMinutes: number[],
  count: number,
  current: number,
  exclude: Set<number>,
): Array<[number, "current" | "observed" | "explore"]> {
  const allowed = new Set(eligibleMinutes);
  const selected: number[] = [];
  const sources: Record<string, "current" | "observed" | "explore"> = {};
  const add = (minute: number, source: "current" | "observed" | "explore") => {
    if (allowed.has(minute) && !exclude.has(minute) && !sources[String(minute)]) {
      selected.push(minute);
      sources[String(minute)] = source;
    }
  };
  if (current) add(current, "current");
  const observed = Object.entries(ledger.fronts)
    .map(([minuteText, raw]) => {
      const entry = raw as Record<string, any>;
      const symbols = (entry.symbols || {}) as Record<string, number>;
      const outcomes = (entry.outcomes || {}) as Record<string, number>;
      const visible = Math.max(1, n(symbols.visible));
      const events = Math.max(1, n(entry.session_events));
      return {
        minute: n(minuteText),
        signal:
          (n(symbols.whale) * 4 + n(symbols.twinkle) * 2) / visible +
          (n(outcomes.whale) * 4 + n(outcomes.rare_target) * 3) / events,
        observations: n(entry.layout_snapshots) + n(entry.session_events),
      };
    })
    .sort((a, b) => b.signal - a.signal || b.observations - a.observations || a.minute - b.minute);
  const observedTarget = Math.max(1, Math.floor(count / 3)) + (current ? 1 : 0);
  for (const item of observed) {
    if (selected.length >= observedTarget) break;
    add(item.minute, "observed");
  }
  // Explore only tide-visible known-rare beachfronts. The map still shows all
  // 1M cells, but executable suggestions must resolve to real rare coordinates.
  let seed =
    (n(getProperty("combo_lastTileCombed")) * 2654435761 +
      current * 2246822519 +
      Object.keys(ledger.fronts).length * 3266489917 +
      count) >>>
    0;
  const target = Math.min(count, eligibleMinutes.length - exclude.size);
  for (let i = 0; i < eligibleMinutes.length * 3 && selected.length < target; i++) {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    add(eligibleMinutes[seed % eligibleMinutes.length], "explore");
  }
  // Deterministic sequential fallback avoids collisions stalling the pool.
  for (const minute of eligibleMinutes) {
    if (selected.length >= target) break;
    add(minute, "explore");
  }
  return selected.slice(0, count).map((minute) => [minute, sources[String(minute)]]);
}

function candidateFrontier(
  ledger: ObservationLedger,
  baseline: ReturnType<typeof comboBaseline>,
  points: RarePoint[],
  recoveryLedger: TileRecoveryLedger,
  count = 16,
): Candidate[] {
  const current = n(getProperty("_beachMinutes"));
  const day = 1 + (gamedayToInt() % 8);
  const rowsHidden = 4 - Math.abs(4 - day);
  const eligible = points.filter((t) => !t.false_rare && t.row > rowsHidden);
  const grouped = new Map<number, RarePoint[]>();
  for (const tile of eligible) {
    const list = grouped.get(tile.minute) || [];
    list.push(tile);
    grouped.set(tile.minute, list);
  }
  const chosen = (minute: number): RarePoint | undefined => {
    const list = grouped.get(minute) || [];
    return list.slice().sort((a, b) => {
      const fa = recoveryFeatures(
        recoveryLedger.tiles[tileKey(a.minute, a.row, a.column)],
        Date.now() / 1000,
      );
      const fb = recoveryFeatures(
        recoveryLedger.tiles[tileKey(b.minute, b.row, b.column)],
        Date.now() / 1000,
      );
      return (
        (fb.revisit_signal ?? -1) - (fa.revisit_signal ?? -1) ||
        a.row - b.row ||
        a.column - b.column
      );
    })[0];
  };
  const result: Candidate[] = [];
  const push = (minute: number, source: Candidate["source"], isBaseline: boolean) => {
    const tile =
      isBaseline && baseline
        ? eligible.find(
            (t) =>
              t.minute === baseline.minute &&
              t.row === baseline.row &&
              t.column === baseline.column,
          )
        : chosen(minute);
    if (!tile) return;
    const evidence = evidenceFor(minute, current, ledger, tile, recoveryLedger);
    result.push({
      minute,
      source,
      is_combo_baseline: isBaseline,
      evidence,
      representative: {
        d: tile.d,
        x: tile.x,
        y: tile.y,
        row: tile.row,
        column: tile.column,
      },
      utility: null,
      utility_components: null,
      watersheep: null,
    });
  };
  if (baseline) push(baseline.minute, "combo-baseline", true);
  const exclude = new Set<number>(result.map((x) => x.minute));
  const eligibleMinutes = Array.from(grouped.keys()).sort((a, b) => a - b);
  for (const [minute, source] of sampleMinutes(ledger, eligibleMinutes, count, current, exclude))
    push(minute, source, false);
  return result;
}

function waterSheepPayload(candidate: Candidate): WaterSheepRequest {
  const evidence = candidate.evidence;
  return {
    state: {
      mode: "shadow-only; no action authorized",
      evidence_contract: WATERSHEEP_EVIDENCE_CONTRACT,
      beach_minute: candidate.minute,
      minute_fraction: evidence.minute_fraction,
      hilbert_bucket_256: evidence.hilbert_bucket_256,
      distance_from_current: evidence.distance_from_current,
      layout_snapshots: evidence.layout_snapshots,
      session_events: evidence.session_events,
      last_seen_age_hours: evidence.last_seen_age_hours,
      tile_recovery: evidence.cooldown,
      observed_symbol_rates: evidence.observed_symbol_rates,
      sand_per_event: evidence.sand_per_event,
      current_layout_if_same_front:
        candidate.minute === n(getProperty("_beachMinutes"))
          ? getProperty("_beachLayout")
          : "not observed",
      withheld:
        "Combo target/order, candidate source labels, baseline membership, and rare count are withheld; per-coordinate evidence is advisory, uncalibrated, and not an action",
    },
    questions: {
      tile_class: {
        type: "choice",
        instructions:
          "Experimental shadow scoring only. Assign relative score mass to six neutral outcome classes from the supplied weak evidence. Do not choose an action. The class keys are intentionally neutral.",
        criteria: {
          A: "rare tile opportunity",
          B: "whale opportunity",
          C: "sandcastle opportunity",
          D: "twinkle or uncommon opportunity",
          E: "ordinary regular beach opportunity",
          F: "already exhausted, combed, or low-value opportunity",
        },
      },
    },
  };
}

function askWaterSheep(candidate: Candidate): { scores: Record<string, number>; ms: number } {
  const payload = waterSheepPayload(candidate);
  const started = Date.now();
  const url = `${ENDPOINT}?request=${urlEncode(JSON.stringify(payload))}`;
  const raw = String(visitUrl(url, false) || "");
  const parsed = JSON.parse(raw) as WaterSheepResponse;
  if (parsed.error) throw new Error(parsed.error);
  const probabilities = parsed.answers?.tile_class?.probabilities || {};
  const scores: Record<string, number> = {};
  for (const [key, label] of Object.entries(MODEL_KEYS)) scores[label] = n(probabilities[key]);
  let total = Object.values(scores).reduce((sum, value) => sum + value, 0);
  if (total <= 0) {
    for (const label of LABELS) scores[label] = n(probabilities[label]);
    total = Object.values(scores).reduce((sum, value) => sum + value, 0);
  }
  if (total <= 0) throw new Error("WaterSheep returned no tile_class score mass");
  for (const label of LABELS) scores[label] = scores[label] / total;
  return { scores, ms: Date.now() - started };
}

export function traceTargetPrediction(
  minute: number,
  row?: number,
  column?: number,
): Record<string, unknown> {
  const ledger = loadObservationLedger();
  const current = n(getProperty("_beachMinutes"));
  const recoveryLedger = loadTileRecoveryLedger();
  const tile = row == null || column == null ? undefined : { minute, row, column };
  const evidence = evidenceFor(minute, current, ledger, tile, recoveryLedger);
  const candidate: Candidate = {
    minute,
    source: "current",
    is_combo_baseline: false,
    evidence,
    representative: evidence.representative,
    utility: null,
    utility_components: null,
    watersheep: null,
  };
  const { scores, ms } = askWaterSheep(candidate);
  const scored = scoreCandidate(candidate, scores);
  return {
    schema: "don-combo-target-prediction/v0.1",
    generated_at: new Date().toISOString(),
    evidence_contract: WATERSHEEP_EVIDENCE_CONTRACT,
    minute,
    model_input: {
      minute_fraction: evidence.minute_fraction,
      hilbert_bucket_256: evidence.hilbert_bucket_256,
      distance_from_current: evidence.distance_from_current,
      layout_snapshots: evidence.layout_snapshots,
      session_events: evidence.session_events,
      last_seen_age_hours: evidence.last_seen_age_hours,
      tile_recovery: evidence.cooldown,
      observed_symbol_rates: evidence.observed_symbol_rates,
      sand_per_event: evidence.sand_per_event,
      current_layout_if_same_front:
        minute === current ? getProperty("_beachLayout") : "not observed",
    },
    score_mass: scores,
    model_utility: scored.components.model,
    policy_utility: scored.utility,
    policy_components: scored.components,
    ms,
    calibration: "UNVALIDATED_FOR_KOL_BEACH",
    authority: "none",
  };
}

function scoreCandidate(
  candidate: Candidate,
  scores: Record<string, number>,
): { utility: number; components: { model: number; exploration: number; observed: number } } {
  const evidence = candidate.evidence;
  const rates = evidence.observed_symbol_rates;
  const outcomes = evidence.observed_outcome_rates;
  const model = LABELS.reduce((sum, label) => sum + n(scores[label]) * WEIGHTS[label], 0);
  const exploration = 0.08 / Math.sqrt(1 + evidence.observation_count);
  const observed =
    n(rates.whale) * 0.16 +
    n(rates.twinkle) * 0.08 -
    n(rates.combed) * 0.05 +
    n(outcomes.whale) * 0.16 +
    n(outcomes.rare_target) * 0.12 +
    n(outcomes.twinkle_fallback) * 0.08 -
    n(outcomes.rough_fallback) * 0.02 -
    n(outcomes.exhausted_fallback) * 0.05 +
    (evidence.cooldown.revisit_signal ?? 0) * 0.08 -
    (evidence.cooldown.still_combed_after_harvest &&
    (evidence.cooldown.days_since_observed ?? 999) < 1
      ? 0.04
      : 0);
  return {
    utility: round(model + exploration + observed),
    components: {
      model: round(model),
      exploration: round(exploration),
      observed: round(observed),
    },
  };
}

function comparison(
  candidates: Candidate[],
  baseline: ReturnType<typeof comboBaseline>,
  fronts: number,
) {
  const scored = candidates.filter((candidate) => candidate.utility != null);
  const top = scored[0];
  const second = scored[1];
  const margin = top && second ? round((top.utility as number) - (second.utility as number)) : null;
  const observedCandidates = scored.filter(
    (candidate) => candidate.evidence.observation_count > 0,
  ).length;
  const fraction = round(observedCandidates / Math.max(1, scored.length), 4);
  const maturity =
    observedCandidates === 0
      ? "COLD_START"
      : fraction < 0.5 || fronts < 10
        ? "WARMING"
        : "EVIDENCE_RICH";
  const separation = margin == null || margin < 0.01 ? "LOW" : margin < 0.03 ? "MEDIUM" : "HIGH";
  const baselineIndex = scored.findIndex((candidate) => candidate.is_combo_baseline);
  const baselineCandidate = baselineIndex >= 0 ? scored[baselineIndex] : null;
  return {
    combo_baseline: baseline,
    baseline_rank: baselineIndex >= 0 ? baselineIndex + 1 : null,
    pool_size: scored.length,
    shadow_top_minute: top?.minute ?? null,
    shadow_top_source: top?.source ?? null,
    agreement: Boolean(top?.is_combo_baseline),
    top_vs_second_margin: margin,
    top_vs_baseline_delta:
      top && baselineCandidate
        ? round((top.utility as number) - (baselineCandidate.utility as number))
        : null,
    observed_candidates: observedCandidates,
    observed_candidate_fraction: fraction,
    evidence_maturity: maturity,
    ranking_separation: separation,
    readiness_note: "Ranking separation is descriptive, not calibrated confidence.",
  };
}

function layoutCells(minute: number, raw: string) {
  if (!minute) return [];
  const result: Array<Record<string, unknown>> = [];
  for (const part of String(raw || "").split(",")) {
    const split = part.indexOf(":");
    if (split < 0) continue;
    const row = n(part.substring(0, split));
    if (row < 1 || row > 10) continue;
    const symbols = part.substring(split + 1).slice(0, 10);
    for (let column = 0; column < symbols.length; column++) {
      const d = dFor(minute, row, column);
      const [x, y] = xyFor(d);
      result.push({ d, x, y, row, column, symbol: symbols[column] });
    }
  }
  return result;
}

function sha256(text: string): string {
  const rightRotate = (value: number, amount: number) =>
    (value >>> amount) | (value << (32 - amount));
  let ascii = unescape(encodeURIComponent(text));
  const byteLength = ascii.length;
  const maxWord = Math.pow(2, 32);
  const words: number[] = [];
  const hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;
  const isComposite: Record<number, boolean> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (let i = 0; i < 313; i += candidate) isComposite[i] = true;
      hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += "\x80";
  while ((ascii.length % 64) - 56) ascii += "\x00";
  for (let i = 0; i < ascii.length; i++) {
    const code = ascii.charCodeAt(i);
    words[i >> 2] |= code << (((3 - i) % 4) * 8);
  }
  words[words.length] = ((byteLength * 8) / maxWord) | 0;
  words[words.length] = byteLength * 8;
  for (let j = 0; j < words.length;) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0, 8);
    for (let i = 0; i < 64; i++) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];
      const a = hash[0];
      const e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash.unshift((temp1 + temp2) | 0);
      hash[4] = (hash[4] + temp1) | 0;
      hash.pop();
    }
    for (let i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  return hash
    .map((value) => {
      let hex = "";
      for (let j = 3; j + 1; j--) hex += ((value >> (j * 8)) & 255).toString(16).padStart(2, "0");
      return hex;
    })
    .join("");
}

function loadJsonLines(path: string, limit: number): Record<string, any>[] {
  let raw = "";
  try {
    raw = String(fileToBuffer(path) || "");
  } catch {
    raw = "";
  }
  const rows: Record<string, any>[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const parsed = JSON.parse(trimmed) as Record<string, any>;
      if (parsed && typeof parsed === "object") rows.push(parsed);
    } catch {
      // Historical diagnostics must never block live shadow scoring.
    }
  }
  return rows.slice(Math.max(0, rows.length - limit));
}

function modelUtility(scoreMass: Record<string, number> | null | undefined): number | null {
  if (!scoreMass) return null;
  return round(LABELS.reduce((sum, label) => sum + n(scoreMass[label]) * WEIGHTS[label], 0));
}

function buildMlLab() {
  const traceLog = loadMlTraceEvents(500);
  const dailyLearningRuns = loadJsonLines("don_combo_daily_shadow_runs.jsonl", 90);
  const tracedEvents = traceLog.events.map((event, index) => {
    const prediction = (event.pre_action_prediction || null) as Record<string, any> | null;
    const items = event.items || {};
    const itemNames = Object.keys(items).filter((name) => n(items[name]) !== 0);
    return {
      index: traceLog.total - traceLog.events.length + index + 1,
      event_id: event.event_id,
      observed_at: event.observed_at,
      turn: event.turn,
      minute: event.minute,
      run_id: event.run_context?.run_id || null,
      gameday: event.run_context?.gameday ?? null,
      route_mode: event.run_context?.route_mode || "legacy-unbound",
      outcome: event.outcome,
      planned_target: event.planned_target,
      actual_comb: event.actual_comb,
      items,
      meat: event.meat,
      item_names: itemNames,
      prediction_status: prediction ? (prediction.error ? "error" : "ready") : "untraced",
      prediction: prediction
        ? {
            model_utility: prediction.model_utility ?? null,
            policy_utility: prediction.policy_utility ?? null,
            score_mass: prediction.score_mass ?? null,
            ms: prediction.ms ?? null,
            calibration: prediction.calibration ?? null,
            generated_at: prediction.generated_at ?? null,
          }
        : null,
    };
  });
  const predicted = tracedEvents.filter((event) => event.prediction_status === "ready");
  const meanLatency =
    predicted.length > 0
      ? round(
          predicted.reduce((sum, event) => sum + n(event.prediction?.ms), 0) / predicted.length,
          2,
        )
      : null;

  const receiptRows = loadJsonLines("don_combo_matrix_receipts.jsonl", 250);
  const snapshotHistory = receiptRows.map((receipt, index) => {
    const candidates = Array.isArray(receipt.candidates) ? receipt.candidates : [];
    const modelRanked = candidates
      .map((candidate: Record<string, any>) => ({
        minute: n(candidate.minute),
        baseline: Boolean(candidate.is_combo_baseline),
        utility: modelUtility(candidate.score_mass),
      }))
      .filter((candidate: { utility: number | null }) => candidate.utility != null)
      .sort(
        (
          a: { utility: number | null; minute: number },
          b: { utility: number | null; minute: number },
        ) => n(b.utility) - n(a.utility) || a.minute - b.minute,
      );
    const modelBaselineIndex = modelRanked.findIndex(
      (candidate: { baseline: boolean }) => candidate.baseline,
    );
    return {
      index: index + 1,
      generated_at: receipt.generated_at || null,
      state_sha256: receipt.state_sha256 || null,
      baseline_policy_rank: receipt.comparison?.baseline_rank ?? null,
      baseline_model_rank: modelBaselineIndex >= 0 ? modelBaselineIndex + 1 : null,
      pool_size: receipt.comparison?.pool_size ?? candidates.length,
      shadow_top_minute: receipt.comparison?.shadow_top_minute ?? null,
      top_vs_baseline_delta: receipt.comparison?.top_vs_baseline_delta ?? null,
    };
  });

  const outcomeCounts: Record<string, number> = {};
  const itemCounts: Record<string, number> = {};
  for (const event of tracedEvents) {
    outcomeCounts[event.outcome] = (outcomeCounts[event.outcome] || 0) + 1;
    for (const [name, amount] of Object.entries(event.items)) {
      itemCounts[name] = (itemCounts[name] || 0) + n(amount);
    }
  }

  return {
    schema: "don-combo-ml-lab/v0.1",
    trace_property: "don_combo_ml_trace",
    routed_auto_trace_enabled: true,
    daily_run_file: "don_combo_daily_shadow_runs.jsonl",
    daily_run_count_in_artifact: dailyLearningRuns.length,
    daily_run_history: dailyLearningRuns.slice(-30),
    last_daily_run: dailyLearningRuns.length ? dailyLearningRuns[dailyLearningRuns.length - 1] : null,
    trace_enabled: ["1", "true", "target", "on"].includes(
      String(getProperty("don_combo_ml_trace") || "").toLowerCase(),
    ),
    event_log_file: traceLog.file,
    events_total: traceLog.total,
    events_in_artifact: tracedEvents.length,
    predicted_events: predicted.length,
    untraced_events: tracedEvents.length - predicted.length,
    mean_prediction_latency_ms: meanLatency,
    outcome_counts: outcomeCounts,
    item_counts: itemCounts,
    events: tracedEvents,
    receipt_log_file: "don_combo_matrix_receipts.jsonl",
    snapshots_in_artifact: snapshotHistory.length,
    snapshot_history: snapshotHistory,
    note: "Per-comb pre-action WaterSheep traces automatically pair with post-action results for WaterSheep-routed runs; ordinary Combo keeps don_combo_ml_trace opt-in. Daily learning receipts distinguish incidental fallback twinkles from verified rare-tile respawns. No online model training or execution authority.",
  };
}

function buildRunControl() {
  const status = String(getProperty("don_combo_last_run_status") || "unknown");
  const endReason = String(getProperty("don_combo_last_run_end_reason") || "unknown");
  const running = String(getProperty("don_combo_running") || "").toLowerCase() === "true";
  const interruptRequested =
    String(getProperty("don_combo_interrupt") || "").toLowerCase() === "true";
  const interruptConsumed =
    String(getProperty("don_combo_last_run_interrupt_consumed") || "").toLowerCase() === "true";
  const requestedCombs = n(getProperty("don_combo_last_run_requested"));
  const completedCombs = n(getProperty("don_combo_last_run_combs"));
  const mlEventsBefore = n(getProperty("don_combo_last_run_ml_events_before"));
  const mlEventsAfter = n(getProperty("don_combo_last_run_ml_events_after"));
  const mlEventDelta = Math.max(0, mlEventsAfter - mlEventsBefore);

  return {
    schema: "don-combo-run-control/v0.1",
    requested_combs: requestedCombs,
    completed_combs: completedCombs,
    route_mode: getProperty("don_combo_last_run_route_mode") || "combo-default",
    paid_combs_observed: n(getProperty("don_combo_last_run_paid_combs")),
    status,
    end_reason: endReason,
    running,
    interrupt_requested: interruptRequested,
    interrupt_consumed: interruptConsumed,
    clean_early_end: status === "interrupted" && endReason === "user_cooperative_interrupt",
    started_at: getProperty("don_combo_last_run_started_at") || null,
    ended_at: getProperty("don_combo_last_run_ended_at") || null,
    ml_events_before: mlEventsBefore,
    ml_events_after: mlEventsAfter,
    ml_event_delta: mlEventDelta,
    ml_trace_span_complete: mlEventDelta === completedCombs,
  };
}

function emitReceipt(result: Record<string, any>) {
  const candidates = (result.candidates as Candidate[]).map((candidate) => ({
    minute: candidate.minute,
    source: candidate.source,
    is_combo_baseline: candidate.is_combo_baseline,
    utility: candidate.utility,
    score_mass: candidate.watersheep?.score_mass || null,
    layout_snapshots: candidate.evidence.layout_snapshots,
    session_events: candidate.evidence.session_events,
    observation_count: candidate.evidence.observation_count,
  }));
  const stateBasis = {
    combo_last_tile_index: result.combo.last_tile_index,
    current_minute: result.combo.current_minute,
    context: result.combo.context,
    observation_fronts: result.observations.fronts_recorded,
    ml_trace_events: result.ml_lab?.events_total ?? 0,
    run_control: result.run_control,
    candidates,
  };
  const stateSha = sha256(JSON.stringify(stateBasis));
  const lastFile = "don_combo_matrix_last_receipt.json";
  const logFile = "don_combo_matrix_receipts.jsonl";
  let previous = "";
  try {
    previous = String(fileToBuffer(lastFile) || "");
  } catch {
    previous = "";
  }
  const appended = !previous.includes(stateSha);
  const receipt = {
    schema: "don-combo-shadow-receipt/v0.7",
    generated_at: result.generated_at,
    state_sha256: stateSha,
    authority: "none",
    comparison: result.comparison,
    candidates,
    observation_fronts: result.observations.fronts_recorded,
    ml_trace_events: result.ml_lab?.events_total ?? 0,
    run_control: result.run_control,
    watersheep_calibration: result.watersheep.calibration,
  };
  if (appended) {
    appendBufferToFile(`${JSON.stringify(receipt)}\n`, logFile);
    bufferToFile(`${JSON.stringify(receipt, null, 2)}\n`, lastFile);
  }
  return {
    schema: receipt.schema,
    state_sha256: stateSha,
    appended_this_run: appended,
    last_receipt_file: lastFile,
    jsonl_file: logFile,
    run_control: result.run_control,
  };
}

function buildRuntime(frontierSize = 16) {
  const points = loadRarePoints();
  const baseline = comboBaseline(points);
  const ledger = loadObservationLedger();
  const recoveryLedger = loadTileRecoveryLedger();
  const candidates = candidateFrontier(ledger, baseline, points, recoveryLedger, frontierSize);
  let status = "ready";
  let error: string | null = null;
  for (const candidate of candidates) {
    if (error) break;
    try {
      const { scores, ms } = askWaterSheep(candidate);
      candidate.watersheep = {
        score_mass: scores,
        ms,
        calibration: "UNVALIDATED_FOR_KOL_BEACH",
      };
      const scored = scoreCandidate(candidate, scores);
      candidate.utility = scored.utility;
      candidate.utility_components = scored.components;
    } catch (caught) {
      status = "offline";
      error = caught instanceof Error ? caught.message : String(caught);
    }
  }
  candidates.sort(
    (a, b) =>
      (b.utility == null ? -1 : b.utility) - (a.utility == null ? -1 : a.utility) ||
      a.minute - b.minute,
  );
  const current = n(getProperty("_beachMinutes"));
  const context = loadContext();
  const cmp = comparison(candidates, baseline, Object.keys(ledger.fronts).length);
  const proof = {
    facts: [
      fact("FACT", "rare-corpus", "known", points.length, "raretiles.json"),
      fact(
        "FACT",
        "observation-fronts",
        "known",
        Object.keys(ledger.fronts).length,
        "native ledger",
      ),
      fact("MODEL", "kol-beach-calibration", "unknown", null, "WaterSheep"),
      fact("FACT", "baseline-membership-model-input", "withheld", null, "input policy"),
    ],
    relations: [
      relation(
        "member-of",
        "combo-baseline",
        "candidate-pool",
        baseline ? true : null,
        "runtime construction",
      ),
      relation(
        "visible-to-model",
        "baseline-membership",
        "WaterSheep",
        false,
        "blinded input policy",
      ),
      relation("authorizes", "WaterSheep", "KoL action", false, "authority boundary"),
    ],
    design_reference: TYPE_REFERENCE,
  };
  const result: Record<string, any> = {
    schema: "don-combo-matrix-runtime/v0.8-ts",
    generated_at: new Date().toISOString(),
    player_id: n(myId()),
    gameday: gamedayToInt(),
    mode: "shadow-only",
    authority: "none",
    claim:
      "Score Combo's exact next successful target inside the same blinded WaterSheep pool as dynamic alternatives, without changing KoL state.",
    note: "TypeScript/Libram runtime. WaterSheep score mass is experimental and uncalibrated for KoL beach outcomes. Known rare annotations, source labels, baseline membership, and Combo route identity are withheld from model input.",
    matrix: {
      order: 10,
      width: GRID,
      height: GRID,
      total_cells: GRID * GRID,
      real_tile_cells: REAL,
      unused_cells: GRID * GRID - REAL,
      address_rule: "d=(minute-1)*100+(row-1)*10+column; (x,y)=HilbertPoint(d,10)",
    },
    combo: {
      rare_tile_records: points.length,
      unique_rare_fronts: new Set(
        points.filter((point) => !point.false_rare).map((point) => point.minute),
      ).size,
      false_rare_records: parseFalseRares().size,
      raretiles_file: "raretiles.json",
      prefs_file: "KoLmafia native properties",
      last_tile_index: n(getProperty("combo_lastTileCombed")),
      current_minute: current || null,
      current_layout: getProperty("_beachLayout"),
      free_beach_combs_remaining: Math.max(0, 11 - n(getProperty("_freeBeachWalksUsed"))),
      context: context.context,
      context_file: context.file,
      baseline_in_pool: baseline != null,
    },
    observations: {
      ledger_file: "don_combo_matrix_ledger.json",
      tile_recovery_file: "don_combo_tile_recovery.json",
      tiles_recorded: Object.keys(recoveryLedger.tiles).length,
      recovery_intervals: Object.values(recoveryLedger.tiles).reduce(
        (count, entry) => count + (entry.recovery_intervals?.length || 0),
        0,
      ),
      fronts_recorded: Object.keys(ledger.fronts).length,
      fronts: observationAtlas(ledger),
      ledger_updated_this_run: false,
      session_tail: { mode: "native-event", events_added: 0, offset: 0, path: null },
      rule: "Combo records beach observations directly into the local evidence ledger; KoLmafia session logs remain recovery evidence, not the hot-path trigger.",
    },
    watersheep: {
      endpoint: ENDPOINT,
      evidence_contract: WATERSHEEP_EVIDENCE_CONTRACT,
      status,
      error,
      options: LABELS.slice(),
      weights: WEIGHTS,
      input_policy:
        "Known tile cooldown evidence supplied; Combo target identity/order, source labels, baseline membership, and Combo-derived outcome labels withheld.",
      calibration: "UNVALIDATED_FOR_KOL_BEACH",
    },
    comparison: cmp,
    run_control: buildRunControl(),
    ml_lab: buildMlLab(),
    proof_graph: proof,
    ui: {
      design_reference: DESIGN_REFERENCE,
      representation_reference: REPRESENTATION_REFERENCE,
      hilbert_ui_reference: HILBERT_UI_REFERENCE,
      type_reference: TYPE_REFERENCE,
      semantic_order: ["claim", "context", "proof", "decision", "metadata", "exit"],
      evidence_kinds: ["FACT", "MODEL", "POLICY"],
    },
    known_rare_points: points,
    current_front_cells: layoutCells(current, getProperty("_beachLayout")),
    candidates,
  };
  result.receipt = emitReceipt(result);
  return result;
}

// Explicit CLI execution first prepares a fresh, immutable ranked snapshot.
// The execution owner validates and freezes it before the first KoL action.
// Never quietly fall back to Combo's shuffled route if WaterSheep is offline.
export function prepareWaterSheepRoute(requestedCombs: number): void {
  if (!Number.isInteger(requestedCombs) || requestedCombs < 1 || requestedCombs > 100)
    throw new Error("WaterSheep comb count must be between 1 and 100.");
  const result = buildRuntime(Math.max(16, requestedCombs));
  if (
    result.watersheep.status !== "ready" ||
    result.candidates.length < requestedCombs ||
    result.candidates
      .slice(0, requestedCombs)
      .some((candidate: Candidate) => candidate.utility == null || candidate.watersheep == null)
  )
    throw new Error(
      "WaterSheep unavailable or insufficient fully scored rare fronts; no combs started.",
    );
  writeRuntime(result);
}

function writeRuntime(result: Record<string, any>): void {
  const encoded = JSON.stringify(result);
  bufferToFile(JSON.stringify(result, null, 2) + "\n", "don_combo_matrix_runtime.json");
  bufferToFile(
    "window.DON_COMBO_MATRIX_RUNTIME=" + encoded + ";\n",
    "relay/don_combo_matrix_runtime.js",
  );
}

function readRequest(path: string): RuntimeRequestV1 {
  const raw = readFlatAshMap(path);
  if (!raw.schema) throw new Error("unable to read runtime request map: " + path);
  return decodeRuntimeRequest(raw);
}

function writeResponse(request: RuntimeRequestV1, response: RuntimeResponseV1): void {
  const wire: Record<string, string> = {
    schema: response.schema,
    id: response.id,
    status: response.status,
    capability: response.capability,
    detail: response.detail,
    generated_at: response.generated_at,
  };
  if (response.runtime_schema != null) wire.runtime_schema = response.runtime_schema;
  if (response.shadow_top_minute != null) {
    wire.shadow_top_minute = String(response.shadow_top_minute);
  }
  if (response.baseline_rank != null) wire.baseline_rank = String(response.baseline_rank);
  writeFlatAshMap(`agent-runtime/outbox/${request.id}.txt`, wire);
}

function processRequest(path: string): void {
  let request: RuntimeRequestV1;
  try {
    request = readRequest(path);
  } catch (error) {
    print("don_combo runtime: " + String(error), "red");
    return;
  }

  if (request.capability === "excavator-smoke") {
    const excavatorConfigured = getProperty("spadingScript").toLowerCase().includes("excavator");
    const logs = sessionLogs(1);
    const comboMarkerVisible = logs.some((log) => String(log).includes("DON_COMBO_OBSERVATION"));
    const ok = request.event != null && request.meta != null && request.page != null;
    const response: RuntimeResponseV1 = {
      schema: "kol-runtime-response/v1",
      id: request.id,
      status: ok ? "ok" : "invalid",
      capability: request.capability,
      detail: `Excavator-compatible event/meta/page envelope ${ok ? "round-tripped" : "failed"}; configured=${excavatorConfigured}; sessionLogs=${logs.length}; comboMarkerVisible=${comboMarkerVisible}; no spading preference changed and no network request made.`,
      generated_at: new Date().toISOString(),
    };
    writeResponse(request, response);
    print("don_combo runtime smoke: " + (ok ? "PASS" : "FAIL") + " · excavator envelope");
    return;
  }

  const runtime = buildRuntime();
  writeRuntime(runtime);
  const response: RuntimeResponseV1 = {
    schema: "kol-runtime-response/v1",
    id: request.id,
    status: runtime.watersheep.status === "ready" ? "ok" : "offline",
    capability: request.capability,
    detail: request.reason,
    generated_at: runtime.generated_at,
    runtime_schema: runtime.schema,
    shadow_top_minute: runtime.comparison.shadow_top_minute,
    baseline_rank: runtime.comparison.baseline_rank,
  };
  writeResponse(request, response);
  print(
    "don_combo TS runtime: " +
      runtime.watersheep.status +
      " | pool " +
      runtime.comparison.pool_size +
      " | baseline rank " +
      String(runtime.comparison.baseline_rank ?? "n/a") +
      " | shadow top " +
      String(runtime.comparison.shadow_top_minute ?? "n/a"),
  );
}

export function main(args?: string): void {
  const raw = String(args || "").trim();
  if (raw.startsWith("process ")) {
    processRequest(raw.substring(8).trim());
    return;
  }
  if (raw === "--smoke-excavator") {
    const request: RuntimeRequestV1 = {
      schema: "kol-runtime-request/v1",
      id: "smoke-" + Date.now(),
      capability: "excavator-smoke",
      action: "smoke",
      reason: "manual-smoke",
      authority: "none",
      event: "choice",
      meta: "excavator-compatible",
      page: "<html data-smoke='don_combo'></html>",
    };
    const wire: Record<string, string> = {
      schema: request.schema,
      id: request.id,
      capability: request.capability,
      action: request.action,
      reason: request.reason,
      authority: request.authority,
      event: request.event || "",
      meta: request.meta || "",
      page: request.page || "",
    };
    writeFlatAshMap(`agent-runtime/inbox/${request.id}.txt`, wire);
    processRequest(`agent-runtime/inbox/${request.id}.txt`);
    return;
  }
  const runtime = buildRuntime();
  writeRuntime(runtime);
  print("don_combo TS runtime refreshed.");
}
