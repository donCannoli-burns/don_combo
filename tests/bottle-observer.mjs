import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { parseBottleOutput } from "../src/runtime/bottle-observer.ts";
import { buildPoolTimeScaleAudit, compactPoolTimeScales } from "../src/runtime/pool-timescales.ts";
import {
  poolForItem,
  buildPoolCooldownIndex,
  bottleForTarget,
  buildHistoricalRareCurve,
} from "../src/runtime/two-pool-cooldown.ts";

const phrase = "> You found a message in a bottle!";
assert.equal(parseBottleOutput(phrase).length, 1);
assert.equal(parseBottleOutput("  " + phrase + "\n").length, 1);
assert.equal(parseBottleOutput("You found a message in a bottle!").length, 1);
for (const no of [
  "",
  "You did not find a message in a bottle!",
  "You acquire a cryptic message in a bottle",
  "You found a mysterious message in a bottle!",
  "beach comb bottle",
  "I found a message in a bottle!",
])
  assert.deepEqual(parseBottleOutput(no), [], no);
assert.equal(poolForItem("message in a bottle", 1), null, "bottle is not an inventory item");
const signal = parseBottleOutput(phrase)[0];
assert.equal(signal.pool, "unassigned");
assert.equal(signal.tier, "unassigned");
assert.deepEqual(signal.weak_pool_context, { pool_1: 0.1, pool_2: 0.1 });
const t0 = Date.parse("2026-10-28T08:00:00Z");
const event = (id, time, minute, player = 42, output = phrase) => ({
  event_id: id,
  observed_at: new Date(time).toISOString(),
  minute,
  layout: "10:rrrrrrrrrr",
  outcome: "rare_target",
  planned_target: { minute, row: 10, column: 3 },
  actual_comb: { minute, row: 10, column: 3 },
  items: {},
  special_events: parseBottleOutput(output),
  run_context: { run_id: id, player_id: player, route_mode: "watersheep-paid" },
});
const events = [
  event("a", t0, 1163),
  event("a", t0, 1163), // event ID duplication cannot double count
  event("b", t0 + 86400000, 5547),
  event("foreign", t0 + 86400000, 1111, 43),
  event("future", t0 + 100 * 86400000, 2200),
  event("no-bottle", t0 + 2000, 1300, 42, "Combing square 4,10"),
];
events[0].action_output_capture = "captured";
events[1].action_output_capture = "captured";
events[2].action_output_capture = "captured";
events[5].action_output_capture = "empty";
const index = buildPoolCooldownIndex(events, t0 + 2 * 86400000, 42);
assert.equal(index.summary.message_bottle_events, 2);
assert.equal(index.summary.message_bottle_unbound, 0);
assert.equal(index.summary.bottle_detection_output_captured, 2);
assert.equal(index.summary.bottle_detection_output_empty, 1);
assert.equal(index.summary.bottle_detection_legacy_unavailable, 0);
assert.equal(index.summary.item_delta_rewards, 0);
assert.equal(index.summary.action_recorded, 0);
assert.equal(index.summary.by_tier.common_rare, 0);
assert.equal(index.summary.by_tier.rare_rare, 0);
assert.equal(index.bottle_events[0].coordinate, "1163,10,3");
assert.equal(index.bottle_events[1].coordinate, "5547,10,3");
assert.equal(
  Object.keys(index.by_coordinate).length,
  0,
  "unknown bottles do not fabricate cooldown harvests",
);
assert.equal(bottleForTarget(index, 1163, 10, 3).observed_events, 1);
assert.deepEqual(bottleForTarget(index, 1163, 10, 3).weak_context_weight, {
  pool_1: 0.1,
  pool_2: 0.1,
});
assert.equal(
  bottleForTarget(index, 1163, 10, 4).observed_events,
  0,
  "same front different coordinate is not a hit",
);
const audit = buildPoolTimeScaleAudit(index),
  compact = compactPoolTimeScales(audit);
assert.equal(compact.unassigned_message_bottle_events, 2);
assert.equal(compact.unassigned_bottle_category_gaps, 1);
assert.equal(compact.distinct_reward_events, 0);
assert.equal(compact.tier_hypotheses.length, 6);
assert.equal(
  compact.tier_hypotheses.every((x) => x.event_count === 0),
  true,
);
const rare = buildHistoricalRareCurve(
  [{ minute: 1163, row: 10, column: 3, false_rare: false }],
  events,
  index,
  t0 + 2 * 86400000,
  42,
);
assert.equal(rare.verified_respawn_intervals, null);
assert.equal(
  rare.bins.reduce((n, b) => n + b.pool_1_rewards + b.pool_2_rewards, 0),
  0,
);

const main = readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
const obs = readFileSync(new URL("../src/runtime/observations.ts", import.meta.url), "utf8");
const runtime = readFileSync(new URL("../src/don_combo_runtime.ts", import.meta.url), "utf8");
const html = readFileSync(new URL("../mafia/relay/don_combo_matrix.html", import.meta.url), "utf8");
assert.match(
  main,
  /const actionOutput = performVerifiedComb\(row, column\)/,
);
assert.match(
  main,
  /const output = performVerifiedComb\(whaleRow\[0\], whaleColumn\)/,
);
assert.match(
  main,
  /const output = performVerifiedComb\(firstTwinkleRow\[0\], twinkleColumn\)/,
);
assert.match(
  main,
  /const output = performVerifiedComb\(firstRoughRow\[0\], roughcolumn\)/,
);
assert.match(main, /finishObservation\("exhausted_fallback", row, column, before, output\)/);
assert.match(main, /action_output: actionOutput/);
assert.match(main, /autoTraceWaterSheepRun = shadow11 \|\| wsFree \|\| wsPaid/);
assert.match(obs, /\.\.\.parseBottleOutput\(detail\.action_output \|\| ""\)/);
assert.match(obs, /action_output_capture:/);
assert.match(obs, /appendBufferToFile\(/);
assert.match(runtime, /bottle_unknown_pool: evidence\.bottle_unknown_pool/);
assert.match(runtime, /bottle_observations_tail: poolIndex\.bottle_events/);
assert.match(runtime, /Math\.min\(1, evidence\.bottle_unknown_pool\.observed_events\) \* 0\.004/);
assert.match(html, /Unassigned message bottles/);
console.log(
  "bottle exact output detection, one unknown category, no false pool cooldown and all 5 action branches: PASS",
);
