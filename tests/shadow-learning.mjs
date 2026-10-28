import assert from "node:assert/strict";

import { summarizeShadowRun } from "../src/runtime/shadow-learning.ts";

// First live free-day example: 11 rare locations were already exhausted,
// six fronts had an incidental fallback twinkle, five fell back to rough sand.
const context = {
  run_id: "30-42-12345",
  gameday: 30,
  player_id: 42,
  route_mode: "watersheep-free",
  started_at: "2026-10-28T05:02:45.560Z",
};
const outcomes = [
  "rough_fallback", "rough_fallback", "twinkle_fallback",
  "rough_fallback", "twinkle_fallback", "twinkle_fallback",
  "rough_fallback", "rough_fallback", "twinkle_fallback",
  "twinkle_fallback", "twinkle_fallback",
];
const events = outcomes.map((outcome, i) => ({
  event_id: String(i),
  run_context: context,
  minute: 100 + i,
  layout: "2:crrrrrrrrt,3:rrrrrrrrrr",
  planned_target: { minute: 100 + i, row: 2, column: 0 },
  actual_comb: { minute: 100 + i, row: 2, column: outcome === "twinkle_fallback" ? 9 : 1 },
  outcome,
  items: i < 5 ? { "dull fish scale": 1 } : { "grain of sand": 2 },
  pre_action_prediction: { score_mass: { rare: 0.3 }, authority: "none" },
}));
const olderRun = { ...context, run_id: "30-42-prior" };
const eventsWithOld = [...events, {
  ...events[0], event_id: "other", run_context: olderRun, items: { "rainbow pearl": 1 },
}];
const report = summarizeShadowRun(
  eventsWithOld, context, "2026-10-28T05:03:59.250Z",
  "completed", 11, 11, 11, 0,
);
assert.equal(report.schema, "don-combo-shadow-learning-run/v0.1");
assert.equal(report.context.gameday, 30);
assert.equal(report.recorded_events, 11);
assert.equal(report.events_match_completed, true);
assert.equal(report.prediction_ready, 11);
assert.equal(report.prediction_untraced, 0);
assert.equal(report.incidental_fallback_twinkles, 6);
assert.equal(report.incidental_fallback_rough, 5);
assert.equal(report.planned_rare_previously_combed, 11);
assert.equal(report.planned_and_actual_match, 0);
assert.equal(report.rare_target_attempts, 0);
assert.equal(report.verified_rare_harvests, null);
assert.equal(report.free_combs_observed, 11);
assert.equal(report.paid_combs_observed, 0);
assert.equal(report.item_counts["dull fish scale"], 5);
assert.equal(report.item_counts["rainbow pearl"], undefined);
assert.equal(report.distinct_fronts_observed, 11);
// Failed WaterSheep scoring is still paired with its post-action outcome,
// not silently interpreted as a successful or calibrated prediction.
const failures = structuredClone(events);
failures[0].pre_action_prediction = { error: "endpoint offline", authority: "none" };
failures[1].pre_action_prediction = null;
const incomplete = summarizeShadowRun(
  failures, context, "2026-10-28T05:03:59.250Z",
  "interrupted", 11, 9, 9, 0,
);
assert.equal(incomplete.prediction_ready, 9);
assert.equal(incomplete.prediction_error, 1);
assert.equal(incomplete.prediction_untraced, 1);
assert.equal(incomplete.events_match_completed, false);
assert.equal(incomplete.result, "interrupted");
console.log("daily shadow cohort: PASS (11 free actions, 6 incidental twinkles, zero verified rare respawns)");
