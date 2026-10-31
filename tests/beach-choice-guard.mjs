import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  beachChoiceReady,
  parseBeachMinuteProperty,
  verifyBeachCombTransition,
} from "../src/runtime/beach-action-guard.ts";

assert.equal(beachChoiceReady(true, true, 504, 504, 1388), true);
assert.equal(beachChoiceReady(true, true, "2342", 2342, 1388), false);
assert.equal(parseBeachMinuteProperty("2342"), 2342);
assert.equal(beachChoiceReady(true, true, parseBeachMinuteProperty("2342"), 2342, 1388), true);
for (const raw of ["", "0", "0001", "2342 ", "2.342e3", "1.5", "-1", "10001", "abc"]) {
  assert.equal(Number.isNaN(parseBeachMinuteProperty(raw)), true, raw);
}
assert.equal(parseBeachMinuteProperty("1"), 1);
assert.equal(parseBeachMinuteProperty("10000"), 10000);
assert.equal(beachChoiceReady(false, true, 504, 504, 1388), false); // observed failure
assert.equal(beachChoiceReady(true, true, 504, 504, 1234), false); // unrelated choice
assert.equal(beachChoiceReady(true, false, 504, 504, 1388), false);
assert.equal(beachChoiceReady(true, true, 503, 504, 1388), false);
assert.equal(beachChoiceReady(true, true, 0, 0, 1388), false);
assert.equal(beachChoiceReady(true, true, 10001, 10001, 1388), false);
// KoLmafia BeachManager only flips the targeted _beachLayout cell to 'c'
// when the raw server response actually contains "You comb". gCLI prints
// "Combing square" on request registration, BEFORE successful completion.
// Require exact one-action resource debit AND server-parsed target tile state.
const free = {
  beforeLayout: "4:rrrrrrrrrr,5:rrrrrrrrrr",
  afterLayout: "4:crrrrrrrrr,5:rrrrrrrrrr",
  beforeMinute: 504,
  afterMinute: 504,
  expectedMinute: 504,
  row: 4,
  column: 0,
  freeBefore: 5,
  freeAfter: 6,
  adventuresBefore: 100,
  adventuresAfter: 100,
  freeOnly: true,
};
assert.deepEqual(verifyBeachCombTransition(free), {
  verified: true,
  reason: "single-spend-tile-flipped",
  spend: "free",
  tileFlipped: true,
});
const paid = {
  ...free,
  freeBefore: 11,
  freeAfter: 11,
  adventuresBefore: 100,
  adventuresAfter: 99,
  freeOnly: false,
};
assert.deepEqual(verifyBeachCombTransition(paid), {
  verified: true,
  reason: "single-spend-tile-flipped",
  spend: "paid",
  tileFlipped: true,
});
// An already-combed square cannot flip again. One exact resource debit is
// required, rather than mistaking stale layout or request text for success.
const combed = { ...paid, beforeLayout: paid.afterLayout };
assert.deepEqual(verifyBeachCombTransition(combed), {
  verified: true,
  reason: "single-spend-already-combed",
  spend: "paid",
  tileFlipped: false,
});
const fail = (e, reason) => {
  const result = verifyBeachCombTransition(e);
  assert.equal(result.verified, false, reason);
  assert.equal(result.reason, reason);
};
fail({ ...free, freeAfter: 5 }, "no-exactly-one-verified-spend");
fail({ ...paid, adventuresAfter: 100 }, "no-exactly-one-verified-spend");
fail({ ...paid, adventuresAfter: 98 }, "no-exactly-one-verified-spend");
fail({ ...free, adventuresAfter: 99 }, "no-exactly-one-verified-spend");
fail({ ...paid, freeAfter: 12 }, "invalid-resource-counters");
fail({ ...paid, afterLayout: paid.beforeLayout }, "no-target-tile-confirmation");
fail({ ...combed, adventuresAfter: 100 }, "no-exactly-one-verified-spend");
fail({ ...free, afterLayout: "4:rrrrrrrrrr,5:crrrrrrrrr" }, "no-target-tile-confirmation");
fail({ ...free, afterMinute: 505 }, "coordinate-or-minute-mismatch");
fail({ ...free, expectedMinute: 505 }, "coordinate-or-minute-mismatch");
fail({ ...free, column: 10 }, "coordinate-or-minute-mismatch");
fail({ ...free, row: 0 }, "coordinate-or-minute-mismatch");
fail({ ...paid, freeOnly: true }, "no-exactly-one-verified-spend");
// A console transcript containing "You comb" or "Combing square" is not
// a substitute for actual state/resource changes.

const source = readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
const combStart = source.indexOf("function _comb(tile: BeachTile): void");
const combEnd = source.indexOf("function deterministicRandom", combStart);
assert.ok(combStart > 0 && combEnd > combStart);
const comb = source.slice(combStart, combEnd);
const traceStart = source.indexOf("function captureTargetPrediction(");
const traceEnd = source.indexOf("function sessionDelta(", traceStart);
const trace = source.slice(traceStart, traceEnd);
assert.ok(trace.includes("activeRouteSnapshot?.candidates.find("));
assert.ok(trace.includes('score_provenance: "frozen-route-pre-score-not-a-fresh-prediction"'));
assert.ok(
  trace.indexOf("if (autoTraceWaterSheepRun)") < trace.indexOf("return traceTargetPrediction("),
);
assert.ok(comb.includes("if (autoTraceWaterSheepRun && preActionPrediction?.error)"));
assert.ok(source.includes("activeRouteSnapshot = null;"));
assert.ok(source.includes("preparedRouteSnapshot = snapshot;"));
assert.ok(
  source.includes("const frozenScoredSnapshot = frozenRoute ? preparedRouteSnapshot : null;"),
);
assert.equal(
  (source.match(/fileToBuffer\("don_combo_matrix_runtime.json"\)/g) || []).length >= 2,
  true,
  "Snapshot remains available for read-only preview and initial route load",
);
assert.ok(trace.includes("if (!autoTraceWaterSheepRun && handlingChoice())"));

// Model I/O must happen before live beach choice opens, not while the
// choice/coords are being used. Only one native comb command is allowed.
assert.ok(comb.indexOf("captureTargetPrediction(minute, row, column)") >= 0);
assert.ok(
  comb.indexOf("captureTargetPrediction(minute, row, column)") <
    comb.indexOf("cliExecute(`beach wander ${minute};`)"),
);
assert.equal((comb.match(/cliExecuteOutput\(`beach comb/g) || []).length, 1);
assert.ok(comb.includes('cliExecute("beach visit")'));
assert.ok(comb.includes('property.getString("_beachLayout") !== layoutString'));

// Pending action recorded before native request; clear only after success.
// All action paths call the guarded helper, never a naked CLI action.
const pending = comb.indexOf('setProperty("don_combo_last_run_unverified_action", coords)');
const request = comb.indexOf("cliExecuteOutput(`beach comb");
const receipt = comb.indexOf("verifyBeachCombTransition({");
const cleared = comb.indexOf('setProperty("don_combo_last_run_unverified_action", "")');
assert.ok(pending > 0 && pending < request && request < receipt && receipt < cleared);
assert.ok(
  comb.indexOf("if (activeSpendCheckpoint)") > receipt &&
    comb.indexOf("if (activeSpendCheckpoint)") < cleared,
);
assert.match(source, /manual reconciliation required\. No new combs started/);
assert.match(source, /activeSpendCheckpoint = \{/);
assert.match(source, /activeSpendCheckpoint = null/);
assert.equal(
  (source.match(/setProperty\("don_combo_last_run_unverified_action", ""\)/g) || []).length,
  1,
  "Only confirmed action may clear its pending record",
);
assert.equal((comb.match(/performVerifiedComb\(/g) || []).length, 6);
assert.ok(comb.indexOf("performVerifiedComb(") < comb.indexOf("finishObservation("));
assert.ok(!comb.includes("nativeBeachCombReceipt"));
assert.ok(
  comb.includes('beforeLayout: property.getString("_beachLayout")') ||
    comb.includes('const beforeLayout = property.getString("_beachLayout")'),
);
assert.ok(comb.includes('afterLayout: property.getString("_beachLayout")'));
assert.ok(comb.includes('const freeBefore = get("_freeBeachWalksUsed", 0)'));
assert.ok(comb.includes("const adventuresBefore = myAdventures()"));
assert.ok(comb.includes("freeOnly: activeSpendCheckpoint?.freeOnly ?? false"));
assert.ok(
  comb.includes('const beachMinute = parseBeachMinuteProperty(getProperty("_beachMinutes"))'),
);
assert.equal(
  (comb.match(/parseBeachMinuteProperty\(getProperty\("_beachMinutes"\)\)/g) || []).length,
  4,
);
assert.equal((comb.match(/get\("_beachMinutes", 0\)/g) || []).length, 1); // diagnostic only

console.log(
  "Beach choice recovery, verified state/resource receipt, and no-retry boundaries: PASS",
);
