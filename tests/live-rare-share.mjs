import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  LIVE_RARE_SHARE_HEADER,
  LIVE_RARE_SHARE_PREF,
  LIVE_RARE_SHARE_RECIPIENT,
  liveRareFromAction,
  liveRareKmailBatches,
} from "../src/runtime/live-rare-share.ts";

assert.equal(LIVE_RARE_SHARE_PREF, "don_combo_share_data");
assert.equal(LIVE_RARE_SHARE_RECIPIENT, "3773192");
assert.equal(LIVE_RARE_SHARE_HEADER, "don_combo_live_rare_v1\ntimestamp_utc,minute,row,column");
const base = {
  minute: 6463,
  row: 4,
  column: 4,
  pre_action_layout: "4:rrrrtrrrrr,5:rrrrrrrrrr",
  outcome: "rare_target",
  items: { "cursed tricorn hat": 1, hamethyst: 5, "grain of sand": 3 },
  action_output: "You acquire an item: cursed tricorn hat",
  observed_at_utc: "2026-10-28T09:30:06.000Z",
};
const result = { timestamp_utc: base.observed_at_utc, minute: 6463, row: 4, column: 4 };
assert.deepEqual(liveRareFromAction(base), result);
for (const rare of [
  "piece of driftwood",
  "rainbow pearl",
  "meteorite fragment",
  "cursed swash buckle",
  "cursed pirate cutlass",
]) {
  assert.deepEqual(liveRareFromAction({ ...base, items: { [rare]: 1 } }), result, rare);
}
assert.deepEqual(
  liveRareFromAction({
    ...base,
    pre_action_layout: "4:rrrrrrrrrr,5:rrrrrrrrrr",
  }),
  result,
  "reward on rough with no twinkle vision may confirm a scarce tile",
);
assert.equal(liveRareFromAction({ ...base, items: { "sand dollar": 1 } }), null);
assert.equal(liveRareFromAction({ ...base, items: { "grain of sand": 4 } }), null);
assert.equal(liveRareFromAction({ ...base, items: {}, action_output: "" }), null);
assert.equal(
  liveRareFromAction({
    ...base,
    items: {},
    action_output: "Sometimes you can find a message in a bottle!",
  }),
  null,
);
assert.deepEqual(
  liveRareFromAction({
    ...base,
    items: {},
    action_output: "You found a message in a bottle!",
  }),
  result,
  "native non-item bottle evidence counts as a scarce encounter, not a loot item",
);
assert.equal(liveRareFromAction({ ...base, outcome: "whale" }), null);
assert.equal(liveRareFromAction({ ...base, outcome: "sand_castle_target" }), null);
assert.equal(liveRareFromAction({ ...base, outcome: "sand_castle_fallback" }), null);
assert.equal(
  liveRareFromAction({
    ...base,
    pre_action_layout: "4:rrrrCrrrrr,5:rrrrrrrrrr",
  }),
  null,
  "castle overlay cannot establish a scarce tile",
);
assert.equal(
  liveRareFromAction({
    ...base,
    pre_action_layout: "4:rrrrcrrrrr,5:rrrrrrrrrr",
  }),
  null,
  "already combed cannot establish a scarce tile",
);
assert.equal(
  liveRareFromAction({
    ...base,
    pre_action_layout: "4:rrrrWrrrrr,5:rrrrrrrrrr",
  }),
  null,
  "whale overlay cannot establish a scarce tile",
);
assert.equal(
  liveRareFromAction({
    ...base,
    pre_action_layout: "5:rrrrrrrrrr",
  }),
  null,
  "tide-hidden row cannot establish a scarce tile",
);
assert.equal(liveRareFromAction({ ...base, minute: 0 }), null);
assert.equal(liveRareFromAction({ ...base, row: 11 }), null);
assert.equal(liveRareFromAction({ ...base, column: -1 }), null);
assert.equal(liveRareFromAction({ ...base, observed_at_utc: "yesterday" }), null);
assert.deepEqual(liveRareKmailBatches([]), []);
const messages = liveRareKmailBatches([result, result]);
assert.equal(messages.length, 1);
assert.equal(messages[0], LIVE_RARE_SHARE_HEADER + "\n2026-10-28T09:30:06.000Z,6463,4,4");
assert.equal(messages[0].split("\n").length, 3, "repeat same-coordinate sightings collapsed");
for (const forbidden of [
  "player",
  "run_id",
  "doncannoli",
  "stICKYrICKY",
  "hamethyst",
  "cursed",
  "meat",
]) {
  assert.ok(
    !messages[0].toLowerCase().includes(forbidden.toLowerCase()),
    "body leaked " + forbidden,
  );
}
const many = Array.from({ length: 100 }, (_, i) => ({
  timestamp_utc: "2026-10-28T09:30:06.000Z",
  minute: i + 1,
  row: 4,
  column: 4,
}));
const batches = liveRareKmailBatches(many);
assert.ok(batches.length > 1);
assert.ok(batches.every((s) => s.length <= 1200 && s.startsWith(LIVE_RARE_SHARE_HEADER)));
assert.equal(batches.flatMap((s) => s.split("\n").slice(2)).length, 100);

const main = readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
assert.match(main, /getProperty\(LIVE_RARE_SHARE_PREF\) === "true"/);
assert.match(
  main,
  /print\("'don_combo_share_data=true' Your current beach findings are set to share\.", "red"\)/,
);
assert.match(main, /cliExecute\("wait 5"\)/);
assert.ok(main.indexOf('cliExecute("wait 5")') < main.indexOf("prepareWaterSheepRoute(wsCount"));
assert.match(main, /consumeInterruptRequest\(\)/);
assert.match(main, /shareThisRun = shareDataEnabled\(\)/);
assert.match(main, /activeLiveRareShare = shareThisRun \? \[\] : null/);
assert.match(
  main,
  /if \(!interrupted && shareThisRun && shareDataEnabled\(\) && activeLiveRareShare\?\.length\)/,
);
assert.match(
  main,
  /if \(!shareDataEnabled\(\) \|\| get\("don_combo_interrupt", false\) \|\| !safeToKmail\(\)\)/,
);
assert.match(main, /Kmail\.send\(LIVE_RARE_SHARE_RECIPIENT, batch\)/);
assert.match(main, /activeLiveRareShare = null; \/\/ discard, never persist for replay/);
assert.ok(!main.includes("loadMlTraceEvents(5000)"), "outbound sharing must not replay history");
console.log(
  "live-only rare share: default-off, grace warning, strict body, safe send and no replay PASS",
);
