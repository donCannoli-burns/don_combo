import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Static source test only: no KoL requests, model calls, or game actions.
const source = readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
const start = source.indexOf("function _comb(tile: BeachTile): void");
const end = source.indexOf("function deterministicRandom", start);
assert.ok(start >= 0 && end > start, "expected _comb source window");
const comb = source.slice(start, end);

const phases = ["after_wander", "guard_entry", "guard_not_ready", "after_reopen"];
for (const phase of phases) {
  const marker = `logBeachChoiceState("${phase}")`;
  assert.ok(comb.includes(marker), `missing ${phase} snapshot`);
}
assert.ok(comb.includes("DON_COMBO_CHOICE_STATE phase=${phase}"));
assert.ok(comb.includes("handling=${handlingChoice()}"));
assert.ok(comb.includes("choice=${lastChoice()}"));
assert.ok(comb.includes('combing=${get("_beachCombing", false)}'));
assert.ok(comb.includes('minute=${get("_beachMinutes", 0)}'));
assert.ok(comb.includes('throw new Error("Beach choice state changed; no comb sent.")'));
const layoutError = 'throw new Error("Beach choice/layout mismatch after visit; no comb sent.")';
assert.ok(comb.includes(layoutError));
assert.equal((comb.match(/cliExecute\(`beach wander/g) || []).length, 1);
assert.equal((comb.match(/cliExecuteOutput\(`beach comb/g) || []).length, 1);
assert.equal((comb.match(/cliExecute\("beach visit"\)/g) || []).length, 1);
const firstSnapshot = comb.indexOf('logBeachChoiceState("after_wander")');
const wanderCommand = comb.indexOf("cliExecute(`beach wander");
const firstGuard = comb.indexOf("ensureBeachChoice();");
assert.ok(firstSnapshot > wanderCommand);
assert.ok(firstSnapshot < firstGuard);
console.log("Beach choice passive diagnostics and fail-closed action boundary: PASS");
