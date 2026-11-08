import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

// Import pure runtime functions without relying on the KoLmafia module.
const source = readFileSync(new URL("../src/runtime/run-interface.ts", import.meta.url), "utf8");
const compiled =
  source.replace(/^\/\/ @ts-nocheck.*$/m, "").replace(/export function /g, "function ") +
  "\nmodule.exports = {startRunInterface,observeRunAction,runProgress,renderRunObservation,priceCacheFromText,renderRunValue,formatMeatNumber,renderFinalCliSection};";
const module = { exports: {} };
runInNewContext(compiled, { module, exports: module.exports });
const {
  startRunInterface,
  observeRunAction,
  runProgress,
  renderRunObservation,
  priceCacheFromText,
  renderRunValue,
  formatMeatNumber,
  renderFinalCliSection,
} = module.exports;

const t0 = Date.parse("2026-10-28T20:00:00.000Z");
const run = startRunInterface(30, t0, "watersheep-paid");
assert.equal(runProgress(0, 30), "+ (0000/0030) -- turns(spent/requested)");
assert.equal(runProgress(30, 30), "+ (0030/0030) -- turns(spent/requested)");
const castle = observeRunAction(run, {
  minute: 3200,
  layout: "2:ccrrrrrrrr,3:rrrcrrrrrr,4:rrrrrrrrrr,5:rrrrrrrcrr,10:rrrrrcrrrr",
  planned_row: 2,
  planned_col: 0,
  actual_row: 4,
  actual_col: 8,
  outcome: "sand_castle_fallback",
  items: { "magenta seashell": 1 },
  output: "",
});
assert.equal(castle.observed, true);
assert.ok(castle.names.includes("sand_castle"));
assert.ok(castle.names.includes("scratch_observed"));
assert.ok(castle.names.includes("planned_rare_revisit"));
assert.equal(run.counts.any_rare_tiles, 0, "Ordinary castle loot never becomes a rare reward");
assert.equal(run.counts.revisited_tiles, 1);
const bottle = observeRunAction(run, {
  minute: 10,
  layout: "10:rrrrrrrrrr",
  planned_row: 10,
  planned_col: 1,
  actual_row: 10,
  actual_col: 1,
  outcome: "rare_target",
  items: {},
  output: "> You found a message in a bottle!",
});
assert.equal(bottle.observed, true);
assert.equal(run.counts.message_bottles, 1);
assert.equal(run.counts.uncommon_rare_tiles, 1);
const whale = observeRunAction(run, {
  minute: 11,
  layout: "10:Wrrrrrrrrr",
  planned_row: 10,
  planned_col: 1,
  actual_row: 10,
  actual_col: 0,
  outcome: "whale",
  items: {},
  output: "",
});
assert.equal(run.counts.whales, 1);
assert.equal(run.counts.uncommon_rare_tiles, 2);
const scarce = observeRunAction(run, {
  minute: 12,
  layout: "10:rrrrrrrrrr",
  planned_row: 10,
  planned_col: 1,
  actual_row: 10,
  actual_col: 1,
  outcome: "rare_target",
  items: {
    "piece of driftwood": 1,
    "cursed pirate cutlass": 1,
    "rainbow pearl": 1,
    "meteorite fragment": 1,
  },
  output: "",
});
assert.equal(run.counts.any_rare_tiles, 3, "A tile is counted once, even for multiple rare items");
assert.equal(run.counts.ultra_rare_tiles, 1);
assert.equal(run.counts.uncommon_rare_tiles, 3);
assert.equal(run.counts.route_target_matches, 2);
const nullEvent = observeRunAction(run, {
  minute: 13,
  layout: "10:rrrrrrrrrr",
  planned_row: 10,
  planned_col: 1,
  actual_row: 10,
  actual_col: 1,
  outcome: "rough_fallback",
  items: { "grain of sand": 3 },
  output: "",
});
assert.equal(nullEvent.observed, false);
assert.equal(run.counts.event_tiles, 4);
const txt = renderRunObservation(run, 5, t0 + 12500).join("\n");
assert.match(txt, /event_tiles: 4\/5 \(80\.00%\)/);
assert.match(txt, /correctly_predicted_tiles: N\/A/);
assert.match(txt, /total IRL time: 0m 12s 500ms/);
assert.match(txt, /average time per completed comb: 2\.500s/);
assert.match(
  renderRunObservation(startRunInterface(0, t0, "combo-default"), 0, t0).join("\n"),
  /N\/A \(0 combs\)/,
);
const prices = priceCacheFromText(
  "983253\n42\t1700000000\t1234\n42\t1690000000\t100\n99\t1700000000\t0\n",
);
assert.equal(prices.valid, true);
assert.equal(prices.prices[42].price, 1234);
assert.equal(prices.prices[99], undefined);
assert.equal(priceCacheFromText("bad header\n42\t1700000000\t999").valid, false);
const value = renderRunValue(
  [
    { id: 42, name: "seashell", quantity: 2 },
    { id: 99, name: "unknown", quantity: 1 },
  ],
  7,
  "983253\n42\t1700000000\t1234",
);
assert.equal(value.estimated_total_known_meat, 2475);
// KoLmafia/Rhino regression: never call Number.toLocaleString("en-US").
assert.equal(formatMeatNumber(1234567), "1,234,567");
assert.equal(formatMeatNumber(-1234567), "-1,234,567");
assert.equal(formatMeatNumber(1234.5), "1,234.5");
assert.equal(formatMeatNumber(0), "0");
assert.match(value.lines.join("\n"), /seashell \| 2 x 1,234 = 2,468 meat/);
assert.match(value.lines.join("\n"), /raw meat: 7/);
assert.match(value.lines.join("\n"), /est final total: 2,475 meat/);
assert.doesNotMatch(source, /\.toLocaleString\s*\(/);

// Three distinct display-only final sections, with no HTML/SVG that collapses
// cells in KoLmafia's Xpra gCLI. Purple replaces every gold/lime accent.
const resultsTable = renderFinalCliSection("results", [
  "-Found 0 meat",
  "-Found 85 grain of sand",
  "-Found 2 cyan seashell",
]);
const observationTable = renderFinalCliSection("observation", [
  "+ === OBSERVATION ===",
  "+ high_scratch: 25/37 (67.57%)",
  "+ beached_whale: 0/37 (0.00%)",
  "+ correctly_predicted_tiles: N/A (WaterSheep scores uncalibrated; no verified prediction label)",
]);
const valueTable = renderFinalCliSection("value", [
  "+ === VALUE ===",
  "+ grain of sand | 85 x 100 = 8,500 meat",
  "+ est final total: 15,985 meat (known-price subtotal; 2 unpriced item types)",
]);
for (const table of [resultsTable, observationTable, valueTable]) {
  assert.equal(table[0].color, "#A855F7", "all section borders must be purple");
  assert.equal(table[table.length - 1].color, "#A855F7");
  assert.ok(table.every((row) => row.text.length === table[0].text.length), "rectangular gCLI table");
  assert.ok(table.every((row) => !/<(?:table|svg|font)/.test(row.text)), "plain gCLI rows only");
  assert.ok(table.every((row) => row.color !== "#FFD700" && row.color !== "#AAFF00"));
}
assert.equal(resultsTable[1].color, "#A855F7");
assert.equal(observationTable[1].color, "#FF8800");
assert.equal(valueTable[1].color, "#A855F7");
assert.ok(resultsTable.some((row) => row.text.includes("grain of sand") && row.text.includes("85")));
assert.ok(observationTable.some((row) => row.text.includes("25/37") && row.color === "#00CC66"));
assert.ok(observationTable.some((row) => row.text.includes("0/37") && row.color === "#FF8800"));
assert.ok(valueTable.some((row) => row.text.includes("15,985") && row.color === "#A855F7"));
assert.ok(observationTable.some((row) => row.text.includes("uncalibrated")));
assert.ok(observationTable.some((row) => row.text.includes("prediction label")));
assert.throws(() => renderFinalCliSection("invalid", []), /Unknown/);

assert.equal(value.unpriced, 1);
assert.match(value.lines.join("\n"), /known-price subtotal/);
assert.equal(renderRunValue([], 0, "").estimated_total_known_meat, 0);
const release = readFileSync(
  new URL("../dist/scripts/don_combo/doncombo.js", import.meta.url),
  "utf8",
);
for (const fragment of [
  "function startRunInterface(",
  "function observeRunAction(",
  "function renderRunValue(",
  "function renderFinalCliSection(",
  "event_observed=",
  "don_combo_run_reports.jsonl",
]) {
  assert.ok(release.includes(fragment), "Release lacks " + fragment);
}
console.log(
  "Don Combo run interface: classification, counters, timing, cached price and release markers PASS",
);
