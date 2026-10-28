import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  SCRATCH_LEDGER_SCHEMA,
  addScratchVisit,
  backfillScratchHistory,
  emptyScratchLedger,
  evidenceForScratchFront,
  scratchCount,
  summarizeScratchLedger,
} from "../src/runtime/scratch-interest.ts";
import { summarizeShadowRun } from "../src/runtime/shadow-learning.ts";

const five = "2:ccccc" + "rrrrr";
const six = "2:ccccccrrrr";
const eleven = "2:cccccccccc,3:crrrrrrrrr";
const twelve = "2:cccccccccc,3:ccrrrrrrrr";
assert.deepEqual(scratchCount(five), { scratches: 5, visible: 10 });
assert.deepEqual(scratchCount(six), { scratches: 6, visible: 10 });
assert.deepEqual(scratchCount(eleven), { scratches: 11, visible: 20 });
assert.deepEqual(scratchCount("2:cccccccccc,3:rrrrrrrrrr"), { scratches: 10, visible: 20 });
assert.equal(scratchCount("2:cccccc"), null); // partial layout cannot fabricate a count
assert.equal(scratchCount("2:cccccccccc,2:rrrrrrrrrr"), null); // duplicate row
assert.equal(scratchCount(""), null);
assert.deepEqual(scratchCount("2:rrrrrrrrrr,3:rrrrrrrrrr"), { scratches: 0, visible: 20 });

const l = emptyScratchLedger(42);
assert.equal(l.schema, SCRATCH_LEDGER_SCHEMA);
assert.equal(addScratchVisit(l, 1216, five, "2026-10-28T01:00:00Z", "live"), true);
assert.equal(evidenceForScratchFront(l, 1216).interest_score, 0);
assert.equal(addScratchVisit(l, 1216, six, "2026-10-28T02:00:00Z", "live"), true);
let e = evidenceForScratchFront(l, 1216);
assert.equal(e.high_scratch_days, 1);
assert.equal(e.very_interesting_days, 0);
assert.equal(e.interest_score, 0.35);
assert.equal(addScratchVisit(l, 1216, eleven, "2026-10-28T03:00:00Z", "live"), true);
e = evidenceForScratchFront(l, 1216);
assert.equal(e.observed_days, 1);
assert.equal(e.max_scratch_count, 11);
assert.equal(e.very_interesting_days, 1);
assert.equal(e.interest_score, 0.7);
assert.equal(addScratchVisit(l, 1216, twelve, "2026-10-28T04:00:00Z", "live"), true);
assert.equal(evidenceForScratchFront(l, 1216).interest_score, 0.7); // same UTC day not extra
assert.equal(addScratchVisit(l, 1216, six, "2026-10-29T02:00:00Z", "live"), true);
e = evidenceForScratchFront(l, 1216);
assert.equal(e.high_scratch_days, 2);
assert.equal(e.very_interesting_days, 1);
assert.equal(e.interest_score, 0.78);
assert.equal(addScratchVisit(l, 1216, eleven, "2026-10-30T02:00:00Z", "live"), true);
e = evidenceForScratchFront(l, 1216);
assert.equal(e.high_scratch_days, 3);
assert.equal(e.very_interesting_days, 2);
assert.equal(e.interest_score, 0.91);
for (let i = 0; i < 25; i++) addScratchVisit(l, 1216, eleven, "2026-10-30T03:00:00Z", "live"); // same day only
assert.equal(evidenceForScratchFront(l, 1216).interest_score, 0.91);
assert.equal(addScratchVisit(l, 1216, eleven, "2026-11-01T03:00:00Z", "live"), true);
assert.equal(addScratchVisit(l, 1216, eleven, "2026-11-02T03:00:00Z", "live"), true);
assert.equal(evidenceForScratchFront(l, 1216).interest_score, 1);
assert.equal(addScratchVisit(l, 1216, "invalid", "2026-11-03T00:00:00Z", "live"), false);
assert.equal(addScratchVisit(l, 10001, eleven, "2026-11-03T00:00:00Z", "live"), false);

const legacy = {
  event_id: "old-1",
  minute: 5447,
  layout: eleven,
  observed_at: "2026-10-26T20:00:00Z",
  run_context: null,
};
const recent = {
  event_id: "new-1",
  minute: 5447,
  layout: eleven,
  observed_at: "2026-10-27T20:00:00Z",
  run_context: { player_id: 42 },
};
const foreign = {
  event_id: "foreign-1",
  minute: 5447,
  layout: eleven,
  observed_at: "2026-10-25T20:00:00Z",
  run_context: { player_id: 99 },
};
const future = {
  event_id: "future-1",
  minute: 5447,
  layout: eleven,
  observed_at: "2027-01-01T00:00:00Z",
  run_context: { player_id: 42 },
};
const oldLedger = emptyScratchLedger(42);
addScratchVisit(oldLedger, 5447, six, "2026-10-26T21:00:00Z", "live");
const imported = backfillScratchHistory(
  oldLedger,
  [legacy, legacy, recent, foreign, future],
  Date.parse("2026-10-28T12:00:00Z"),
);
assert.equal(imported.imported, 2);
assert.equal(evidenceForScratchFront(imported.ledger, 5447).high_scratch_days, 2);
assert.equal(evidenceForScratchFront(imported.ledger, 5447).very_interesting_days, 2);
assert.equal(evidenceForScratchFront(imported.ledger, 5447).interest_score, 0.83);
assert.equal(imported.ledger.fronts["5447"].days["2026-10-26"].provenance, "both");
assert.equal(evidenceForScratchFront(oldLedger, 5447).max_scratch_count, 6); // immutable merge
assert.equal(summarizeScratchLedger(imported.ledger, imported.imported).fronts_repeated_high, 1);

const context = {
  run_id: "30-42-abc",
  gameday: 30,
  player_id: 42,
  route_mode: "watersheep-paid",
  started_at: "2026-10-28T01:00:00Z",
};
const base = {
  run_context: context,
  outcome: "rough_fallback",
  items: {},
  pre_action_prediction: { score_mass: { rare: 0.1 } },
  planned_target: null,
  actual_comb: null,
};
const outcomeEvents = [
  { ...base, event_id: "a", minute: 1216, layout: five },
  { ...base, event_id: "b", minute: 1216, layout: six },
  { ...base, event_id: "c", minute: 5447, layout: eleven },
  {
    ...base,
    event_id: "other",
    minute: 505,
    layout: eleven,
    run_context: { ...context, run_id: "different" },
  },
];
const cohort = summarizeShadowRun(
  outcomeEvents,
  context,
  "2026-10-28T01:10:00Z",
  "completed",
  3,
  3,
  0,
  3,
);
assert.equal(cohort.recorded_events, 3);
assert.equal(cohort.prediction_ready, 3);
assert.equal(cohort.high_scratch_observations, 2);
assert.equal(cohort.very_interesting_scratch_observations, 1);
assert.equal(cohort.high_scratch_fronts, 2);
assert.equal(cohort.very_interesting_scratch_fronts, 1);

const observations = readFileSync(
  new URL("../src/runtime/observations.ts", import.meta.url),
  "utf8",
);
const runtime = readFileSync(new URL("../src/don_combo_runtime.ts", import.meta.url), "utf8");
const html = readFileSync(new URL("../mafia/relay/don_combo_matrix.html", import.meta.url), "utf8");
assert.match(
  observations,
  /recordScratchObservation\(minute, layout, detail\.pre_action_observed_at/,
);
assert.match(observations, /don_combo_scratch_observations\.json/);
assert.match(runtime, /const scratchBackfill = backfillScratchHistory\(/);
assert.match(runtime, /const scratches = backfillScratchHistory\(/);
assert.match(runtime, /scratch_interest: evidence\.scratch_interest/);
assert.match(runtime, /evidence\.scratch_interest\.interest_score \* 0\.06/);
assert.match(runtime, /evidenceForScratchFront\(scratches, n\(minuteText\)\)\.interest_score \* 2/);
assert.match(html, /id="mlScratchStats"/);
assert.match(html, /id="mlScratchTable"/);
console.log("scratch-density historical/live + distinct UTC day + WaterSheep interest: PASS");
