import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  roundedPrescoreSeconds,
  prescoreWaitPhrase,
  prescoreProgressNotice,
  PRESCORE_ASSUMED_SECONDS_PER_TARGET,
  PRESCORE_ROUNDING_SECONDS,
} from "../src/runtime/prescore-progress.ts";

assert.equal(PRESCORE_ASSUMED_SECONDS_PER_TARGET, 2);
assert.equal(PRESCORE_ROUNDING_SECONDS, 30);
assert.equal(roundedPrescoreSeconds(50), 90, "50 targets × 2s = 100s, nearest 30s = 90s");
assert.equal(prescoreWaitPhrase(50), "~1 min 30 sec");
assert.equal(prescoreWaitPhrase(25), "~1 min 0 sec");
assert.equal(prescoreWaitPhrase(11), "~0 min 30 sec");
assert.equal(prescoreWaitPhrase(100), "~3 min 30 sec");
assert.equal(prescoreWaitPhrase(1), "under 30 sec");
assert.equal(prescoreWaitPhrase(7), "under 30 sec");
assert.equal(prescoreWaitPhrase(0), "complete");
for (const n of [-10, NaN, Infinity, -Infinity]) {
  assert.equal(roundedPrescoreSeconds(n), 0);
  assert.equal(prescoreWaitPhrase(n), "complete");
}
assert.equal(roundedPrescoreSeconds(15), 30);
assert.equal(roundedPrescoreSeconds(8), 30);
assert.equal(roundedPrescoreSeconds(7), 0);

// A changing 30-second remaining bucket or every 10th scored target yields
// a gCLI progress message; full completion is reported AFTER snapshot save.
const initial = roundedPrescoreSeconds(50);
assert.equal(prescoreProgressNotice(1, 50, initial).message, null);
const heartbeat = prescoreProgressNotice(10, 50, initial);
assert.match(heartbeat.message, /10\/50 targets/);
assert.match(heartbeat.message, /~1 min 30 sec remaining/);
assert.match(prescoreProgressNotice(10, 51, initial).message, /10\\/51 targets/);
const countdown = prescoreProgressNotice(13, 50, initial);
assert.match(countdown.message, /13\/50 targets/);
assert.match(countdown.message, /~1 min 0 sec remaining/);
assert.equal(countdown.rounded_remaining_seconds, 60);
assert.equal(prescoreProgressNotice(14, 50, 60).message, null);
const nearly = prescoreProgressNotice(43, 50, 30);
assert.match(nearly.message, /under 30 sec remaining/);
assert.equal(prescoreProgressNotice(50, 50, 0).message, null);
assert.equal(prescoreProgressNotice(51, 50, 0).message, null);
assert.equal(prescoreProgressNotice(0, 50, initial).message, null);

// The runtime callback counts ACTUAL model-scored candidates. The callback
// is only supplied by CLI explicit WaterSheep pre-scoring; regular refresh
// and default Combo remain without side effects or extra HTTP requests.
const main = readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
const runtime = readFileSync(new URL("../src/don_combo_runtime.ts", import.meta.url), "utf8");
assert.match(main, /WaterSheep: pre-scoring \$\{wsCount\} rare-front targets/);
assert.match(main, /please wait \$\{prescoreWaitPhrase\(wsCount\)\} \(estimated\)/);
assert.match(main, /prepareWaterSheepRoute\(wsCount, \(completed, total\) =>/);
assert.match(main, /prescoreProgressNotice\(completed, total, lastPrintedRemaining\)/);
assert.match(main, /pre-scoring complete; ranked snapshot saved/);
assert.match(runtime, /function buildRuntime\(frontierSize = 16, onScored\?/);
assert.match(runtime, /scoredCount\+\+;\s*onScored\?\.\(scoredCount, candidates\.length\)/);
assert.match(runtime, /const result = buildRuntime\(Math\.max\(16, requestedCombs\), onScored\)/);
assert.match(runtime, /if \(\s*result\.watersheep\.status !== "ready"/);
assert.match(runtime, /writeRuntime\(result\);/);
console.log(
  "WaterSheep gCLI: rounded two-second estimates, progressive scoring, and final commit gate PASS",
);
