import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  castleAt,
  firstVisibleSandCastle,
  sandCastleAction,
  visibleSandCastles,
} from "../src/runtime/sandcastle-observer.ts";
import {
  buildPoolCooldownIndex,
  recordPoolLabels,
} from "../src/runtime/two-pool-cooldown.ts";

const minute = 9177;
const layout = "7:rrrrrrrrrr,8:rrrrCrrcrr,9:Crcrrrrrrr,10:rrrrrrrrrr";
const castles = visibleSandCastles(layout, minute);
assert.deepEqual(castles, [
  { minute, row: 8, column: 4 },
  { minute, row: 9, column: 0 },
]);
assert.equal(castleAt(layout, minute, 8, 4), true);
assert.equal(castleAt(layout, minute, 8, 7), false); // lowercase c is combed sand
assert.equal(castleAt(layout, minute, 6, 4), false); // submerged/hidden
assert.deepEqual(firstVisibleSandCastle(layout, minute), { minute, row: 8, column: 4 });
assert.deepEqual(visibleSandCastles("10:rrrrrrrrrr", minute), []);
assert.deepEqual(visibleSandCastles("6:rrrrCrrrrr", minute), [
  { minute, row: 6, column: 4 },
]);
assert.deepEqual(visibleSandCastles("6:rrrrCrrrrr,6:rrCrrrrrrr", minute), [
  { minute, row: 6, column: 4 },
]); // malformed duplicate row cannot add imaginary castles
assert.deepEqual(visibleSandCastles("garbage,10:rrrrCrr", minute), []);
assert.deepEqual(visibleSandCastles(layout, -1), []);

const demo = "You carefully demolish the sand castle and comb the area into a nice flat sand parking lot.";
const verified = sandCastleAction(layout, minute, 8, 4, "sand_castle_fallback", demo);
assert.equal(verified?.kind, "sand_castle_action");
assert.equal(verified?.coordinate, "9177,8,4");
assert.equal(verified?.verification, "native-demolition-text");
assert.equal(verified?.source, "pre-action-layout-and-native-comb");
assert.equal(verified?.classification, "CASTLE_ACTION_NOT_RARE_REWARD_OR_COOLDOWN");
assert.equal(
  sandCastleAction(layout, minute, 8, 4, "sand_castle_target", "").verification,
  "pre-action-castle-command-returned",
);
assert.equal(sandCastleAction(layout, minute, 8, 7, "sand_castle_fallback", demo), null);
assert.equal(sandCastleAction(layout, minute, 8, 4, "rough_fallback", demo), null);
assert.equal(sandCastleAction(layout, minute, 8, 4, "sand_castle_fallback", "").evidence_text, null);

const t0 = Date.parse("2026-10-20T00:00:00.000Z");
const evt = (name, offsetDays, player = 42, outcome = "rough_fallback", action = null) => ({
  schema: "don-combo-ml-event/v0.1",
  event_id: name,
  observed_at: new Date(t0 + offsetDays * 86400000).toISOString(),
  minute,
  layout,
  outcome,
  planned_target: { minute, row: 10, column: 1 },
  actual_comb: action
    ? { minute, row: 8, column: 4 }
    : { minute, row: 10, column: 0 },
  items: action ? { kelp: 1, "grain of sand": 3 } : {},
  meat: 0,
  special_events: action ? [action] : [],
  run_context: { player_id: player, run_id: name, route_mode: "combo-default" },
});
const events = [
  evt("seen-first", 0),
  evt("seen-first", 0), // duplicate event ID must not duplicate sightings
  evt("seen-again", 2),
  evt("demolition", 3, 42, "sand_castle_fallback", verified),
  evt("foreign", 4, 99, "sand_castle_fallback", verified),
  evt("future", 40, 42, "sand_castle_fallback", verified),
];
const index = buildPoolCooldownIndex(events, t0 + 10 * 86400000, 42);
assert.equal(index.summary.matched_events, 3);
assert.equal(index.summary.sand_castle_sightings, 6); // 2 per valid layout x 3
assert.equal(index.summary.sand_castle_unique_coordinates, 2);
assert.equal(index.summary.sand_castle_unique_minutes, 1);
assert.equal(index.summary.sand_castle_actions, 1);
assert.equal(index.summary.sand_castle_actions_native_verified, 1);
assert.equal(index.summary.sand_castle_actions_unverified, 0);
assert.deepEqual(index.castle_events.map((e) => e.coordinate), ["9177,8,4"]);
assert.equal(index.summary.item_delta_rewards, 0); // ordinary kelp and sand are not rare
assert.equal(index.summary.censored_intervals, 0);
assert.equal(index.summary.distinct_reward_coordinates, 0);
assert.equal(index.by_coordinate["9177,8,4"], undefined);
assert.equal(index.summary.by_tier.common_rare, 0); // castle sightings not reward tier
assert.equal(index.summary.pool_1.sand_castle, 6);
assert.equal(index.summary.unclassified_item_deltas.kelp, 1);
assert.equal(index.summary.unclassified_item_deltas["grain of sand"], 3);
const labels = recordPoolLabels(events[3], 42);
assert.equal(labels.length, 2);
assert.ok(labels.every((x) => x.certainty === "layout-sighting"));
assert.ok(labels.every((x) => x.kind === "sand_castle"));

const main = readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
const obs = readFileSync(new URL("../src/runtime/observations.ts", import.meta.url), "utf8");
const runtime = readFileSync(new URL("../src/don_combo_runtime.ts", import.meta.url), "utf8");
const relay = readFileSync(new URL("../mafia/relay/don_combo_matrix.html", import.meta.url), "utf8");
assert.match(main, /rareRow\[column\] === "C"/);
assert.match(main, /finishObservation\("sand_castle_fallback", castle\.row, castle\.column, before, output\)/);
assert.ok(main.indexOf('const castle = firstVisibleSandCastle(layoutString, minute)') <
  main.indexOf('const firstTwinkleRow ='));
assert.match(obs, /sandCastleAction\(/);
assert.match(obs, /else if \(symbol === "C"\) counts\.sand_castle\+\+/);
assert.match(runtime, /castle_actions_tail: poolIndex\.castle_events\.slice\(-60\)/);
assert.match(relay, /sand_castle_unique_coordinates/);
assert.match(relay, /sand_castle_actions_native_verified/);
console.log("sandcastle sightings, visible fallback selection, evidence, non-reward and safe replay PASS");
