import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { beachChoiceReady, nativeBeachCombReceipt } from "../src/runtime/beach-action-guard.ts";

assert.equal(beachChoiceReady(true, true, 504, 504), true);
assert.equal(beachChoiceReady(false, true, 504, 504), false); // observed failure
assert.equal(beachChoiceReady(true, false, 504, 504), false);
assert.equal(beachChoiceReady(true, true, 503, 504), false);
assert.equal(beachChoiceReady(true, true, 0, 0), false);
assert.equal(beachChoiceReady(true, true, 10001, 10001), false);
assert.equal(nativeBeachCombReceipt("You comb the area and find sand."), true);
assert.equal(nativeBeachCombReceipt("You comb all of the meat off the whale."), true);
assert.equal(nativeBeachCombReceipt("You have not VISITed the Beach Comb yet."), false);
assert.equal(nativeBeachCombReceipt("IOException retrieving server reply"), false);
assert.equal(nativeBeachCombReceipt(""), false);

const source = readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
const combStart = source.indexOf("function _comb(tile: BeachTile): void");
const combEnd = source.indexOf("function deterministicRandom", combStart);
assert.ok(combStart > 0 && combEnd > combStart);
const comb = source.slice(combStart, combEnd);

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
const receipt = comb.indexOf("nativeBeachCombReceipt(output)");
const cleared = comb.indexOf('setProperty("don_combo_last_run_unverified_action", "")');
assert.ok(pending > 0 && pending < request && request < receipt && receipt < cleared);
assert.equal((comb.match(/performVerifiedComb\(/g) || []).length, 6);
assert.ok(comb.indexOf("performVerifiedComb(") < comb.indexOf("finishObservation("));

console.log("Beach choice recovery, one-shot native comb receipt, and no-retry boundaries: PASS");
