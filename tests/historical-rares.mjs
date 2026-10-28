import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  buildHistoricalRareIndex,
  historicalRareForTile,
} from "../src/runtime/historical-rares.ts";

// Historical catalogue is location evidence, not a dated harvest.
const points = [
  { minute: 1216, row: 10, column: 7, false_rare: false },
  { minute: 5447, row: 10, column: 3, false_rare: false },
  { minute: 9999, row: 7, column: 4, false_rare: false },
  { minute: 2521, row: 8, column: 2, false_rare: true },
];
const base = "2026-10-28T00:00:00.000Z";
const old = (id, minute, row, column, date, outcome, actual, layout, run_context = null) => ({
  schema: "don-combo-ml-event/v0.1",
  event_id: id,
  observed_at: date,
  minute,
  turn: 1,
  outcome,
  planned_target: { minute, row, column },
  actual_comb: actual,
  items: {},
  meat: 0,
  layout,
  layout_symbols: {},
  pre_action_prediction: null,
  run_context,
});
const events = [
  old(
    "legacy-1",
    1216,
    10,
    7,
    base,
    "rare_target",
    { minute: 1216, row: 10, column: 7 },
    "10:rrrrrrrtrr",
  ),
  old(
    "legacy-1",
    1216,
    10,
    7,
    base,
    "rare_target",
    { minute: 1216, row: 10, column: 7 },
    "10:rrrrrrrtrr",
  ), // duplicate
  old(
    "legacy-2",
    1216,
    10,
    7,
    "2026-10-29T00:00:00.000Z",
    "rough_fallback",
    { minute: 1216, row: 10, column: 2 },
    "10:rrrrrrrcrr",
  ),
  old(
    "routed-1",
    5447,
    10,
    3,
    "2026-10-30T00:00:00.000Z",
    "rare_target",
    { minute: 5447, row: 10, column: 3 },
    "10:rrrtrrrrrr",
    { run_id: "paid-run", route_mode: "watersheep-paid" },
  ),
  old(
    "routed-2",
    5447,
    10,
    3,
    "2026-11-05T00:00:00.000Z",
    "rare_target",
    { minute: 5447, row: 10, column: 3 },
    "10:rrrtrrrrrr",
    { run_id: "paid-run2", route_mode: "watersheep-paid" },
  ),
  old(
    "false",
    2521,
    8,
    2,
    base,
    "rare_target",
    { minute: 2521, row: 8, column: 2 },
    "8:rrtrrrrrrr",
  ),
  old(
    "not-rare",
    9999,
    7,
    4,
    base,
    "twinkle_fallback",
    { minute: 9999, row: 7, column: 4 },
    "7:rrrrtrrrrr",
  ),
  old(
    "mismatch",
    1216,
    10,
    7,
    base,
    "rare_target",
    { minute: 1216, row: 10, column: 4 },
    "10:rrrrrrrtrr",
  ),
];
const cutoff = Date.parse("2026-11-10T00:00:00.000Z");
const index = buildHistoricalRareIndex(points, events, cutoff);
assert.equal(index.baseline.catalogue_coordinates, 3);
assert.equal(index.baseline.catalogue_false_rare_excluded, 1);
assert.equal(index.baseline.events_scanned, events.length);
assert.equal(index.baseline.distinct_events_considered, events.length - 1);
assert.equal(index.baseline.historical_observations_matched, 6);
assert.equal(index.baseline.legacy_unbound_observations, 4);
assert.equal(index.baseline.run_bound_observations, 2);
assert.equal(index.baseline.rare_target_attempts, 3);
assert.equal(index.baseline.coordinates_with_rare_attempts, 2);
assert.equal(index.baseline.verified_rare_harvests, null);
const p1216 = historicalRareForTile(index, 1216, 10, 7);
assert.equal(p1216.rare_target_attempts, 1);
assert.equal(p1216.confirmed_combed_preactions, 1);
assert.equal(p1216.elapsed_days_between_target_attempts.length, 0);
const p5447 = historicalRareForTile(index, 5447, 10, 3);
assert.deepEqual(p5447.elapsed_days_between_target_attempts, [6]);
assert.equal(p5447.run_bound_observations, 2);
assert.equal(p5447.observed_respawn_intervals, null); // 6 days is NOT an exact respawn
assert.equal(historicalRareForTile(index, 9999, 7, 4).prior_target_observations, 1);
assert.equal(historicalRareForTile(index, 2521, 8, 2), null);

// Only observations existing BEFORE inference can inform that inference.
const first = buildHistoricalRareIndex(
  points,
  events.slice(0, 3),
  Date.parse("2026-10-29T01:00:00Z"),
);
assert.equal(historicalRareForTile(first, 5447, 10, 3).rare_target_attempts, 0);
assert.equal(first.baseline.rare_target_attempts, 1);

// Static path test: paid, free, and shadow11 all auto-trace before execution;
// every action gets a run-bound observation and no model training authority.
const main = readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
const runtime = readFileSync(new URL("../src/don_combo_runtime.ts", import.meta.url), "utf8");
assert.match(main, /const wsPaidMatch = .*watersheep-/);
assert.match(main, /autoTraceWaterSheepRun = shadow11 \|\| wsFree \|\| wsPaid;/);
assert.match(main, /pre_action_prediction: preActionPrediction/);
assert.match(main, /run_context: activeShadowRun/);
assert.match(main, /route_mode: routeMode/);
assert.match(main, /const learned = summarizeShadowRun/);
assert.match(main, /appendBufferToFile\(.*don_combo_daily_shadow_runs\.jsonl/);
assert.match(runtime, /loadMlTraceEvents\(Number\.MAX_SAFE_INTEGER\)/);
assert.match(runtime, /historical_rare: evidence\.historical_rare/);
assert.match(runtime, /historical_rare_baseline: historicalIndex\.baseline/);
assert.match(runtime, /candidateFrontier\([\s\S]*?historicalIndex,[\s\S]*?frontierSize,/);
assert.match(runtime, /traceTargetPrediction\([\s\S]*?buildHistoricalRareIndex/);
console.log("historical rare baseline and WaterSheep paid/free learning routes: PASS");
