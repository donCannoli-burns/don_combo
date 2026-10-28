import assert from "node:assert/strict";

import {
  stateAt,
  observeTile,
  recoveryFeatures,
  emptyTileRecovery,
} from "../src/runtime/recovery.ts";
import {
  compileShadowTop11, compileWaterSheepRoute, MAX_WATERSHEEP_ROUTE_COMBS,
} from "../src/runtime/shadow-route.ts";

const layout = "4:rrrrrrrrrr,5:ccctrrrrrr,6:rrrrrrrrrr";
assert.equal(stateAt(layout, 5, 0, false), "combed");
assert.equal(stateAt(layout, 5, 3, false), "twinkle");
assert.equal(stateAt(layout, 5, 4, false), "unknown");
assert.equal(stateAt(layout, 5, 4, true), "rough");
assert.equal(stateAt(layout, 7, 0, false), "unknown");

const day = 86400;
let entry = observeTile(undefined, day, "unknown", "driftwood bracelet");
assert.equal(entry.harvests, 1);
entry = observeTile(entry, day * 9, "combed", null);
assert.equal(entry.harvests, 1);
assert.equal(recoveryFeatures(entry, 12 * day).still_combed_after_harvest, true);
entry = observeTile(entry, day * 13, "twinkle", null);
const features = recoveryFeatures(entry, 13 * day);
assert.equal(features.harvests, 1);
assert.equal(features.completed_intervals, 1);
assert.equal(features.cooldown_lower_days, 8);
assert.equal(features.cooldown_upper_days, 12);
assert.equal(features.respawn_observed_after_harvest, true);
assert.equal(features.revisit_signal_kind, "12_DAY_EXPLORATION_HEURISTIC_NOT_PROBABILITY");
assert.equal(recoveryFeatures(emptyTileRecovery(), day * 100).revisit_signal, null);
assert.equal(observeTile(entry, day * 8, "combed", null).observations, 3);

const makeSnapshot = () => ({
  schema: "don-combo-matrix-runtime/v0.8-ts",
  generated_at: "2026-10-27T20:00:00.000Z",
  player_id: 77,
  gameday: 8,
  watersheep: { status: "ready" },
  candidates: Array.from({ length: 17 }, (_, i) => ({
    minute: 100 + i,
    utility: 1 - i / 100,
    representative: { minute: 100 + i, row: 5, column: 1 },
    watersheep: { score_mass: { rare: 0.7, regular: 0.3 } },
  })),
});
const corpus = Array.from({ length: 17 }, (_, i) => ({ minute: 100 + i, row: 5, column: 1 }));
const seconds = Date.parse("2026-10-27T20:05:00.000Z") / 1000;
const compile = (snapshot, used = 0, dayNumber = 8, data = corpus) =>
  compileShadowTop11(snapshot, data, new Set(), 77, dayNumber, used, seconds);
const snapshot = makeSnapshot();
const route = compile(snapshot);
assert.equal(route.length, 11);
assert.deepEqual(route, compile(snapshot));
assert.deepEqual(route[0], { minute: 100, row: 5, column: 1 });
assert.equal(compile(snapshot, 10).length, 1);
assert.throws(() => compile(snapshot, 11), /No unused free/);
assert.throws(() => compile(snapshot, 0, 9), /identity, day/);
assert.throws(() => compile({ ...snapshot, player_id: 42 }), /identity, day/);
assert.throws(() => compile({ ...snapshot, watersheep: { status: "offline" } }), /status invalid/);
assert.throws(() => compile({ ...snapshot, generated_at: "2026-10-27T19:00:00.000Z" }), /expired/);
assert.throws(
  () => compile({ ...snapshot, candidates: snapshot.candidates.slice(0, 4) }),
  /Insufficient/,
);
const duplicate = makeSnapshot();
duplicate.candidates[1].representative.minute = 100;
assert.throws(() => compile(duplicate), /unique accessible/);
const outOfOrder = makeSnapshot();
outOfOrder.candidates[1].utility = 10;
assert.throws(() => compile(outOfOrder), /descending rank/);
assert.throws(
  () =>
    compile(
      snapshot,
      0,
      8,
      corpus.filter((t) => t.minute !== 100),
    ),
  /accessible known rare/,
);
// CLI explicit-count routing is allowed after free combs are exhausted,
// but only when the caller opted into paid mode. This compiler has no KoL I/O.
assert.equal(MAX_WATERSHEEP_ROUTE_COMBS, 100);
assert.throws(
  () => compileWaterSheepRoute(snapshot, corpus, new Set(), 77, 8, 11, seconds, 1, true),
  /available free/,
);
const twenty = makeSnapshot();
twenty.candidates = Array.from({ length: 25 }, (_, i) => ({
  minute: 500 + i, utility: 1 - i / 100,
  representative: { minute: 500 + i, row: 5, column: 1 },
  watersheep: { score_mass: { rare: 0.7 } },
}));
const twentyCorpus = twenty.candidates.map(c => c.representative);
assert.equal(
  compileWaterSheepRoute(twenty, twentyCorpus, new Set(), 77, 8, 11, seconds, 20, false).length,
  20,
);
assert.equal(
  compileWaterSheepRoute(twenty, twentyCorpus, new Set(), 77, 8, 7, seconds, 20, false).length,
  20,
);
assert.throws(
  () => compileWaterSheepRoute(twenty, twentyCorpus, new Set(), 77, 8, 7, seconds, 20, true),
  /available free/,
);
for (const bad of [0, -1, 101, 2.5, NaN, Infinity]) {
  assert.throws(
    () => compileWaterSheepRoute(twenty, twentyCorpus, new Set(), 77, 8, 0, seconds, bad, false),
    /integer from 1 to 100/,
  );
}
console.log("recovery, frozen free-only and explicit-count paid routes: PASS");
