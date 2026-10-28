import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const source = readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
const buildConfig = readFileSync(new URL("../rollup.config.ts", import.meta.url), "utf8");
const legacy = new URL("../dist/scripts/combo/combo.js", import.meta.url);
const unique = new URL("../dist/scripts/don_combo/doncombo.js", import.meta.url);

assert.match(buildConfig, /"scripts\/combo\/combo": "src\/main\.ts"/);
assert.match(buildConfig, /"scripts\/don_combo\/doncombo": "src\/main\.ts"/);
assert.ok(
  source.indexOf('if (args === "info" || args === "help")') <
    source.indexOf('if (args === "lifetime")'),
);
assert.ok(
  source.indexOf('if (args === "info" || args === "help")') <
    source.indexOf("prepareWaterSheepRoute(wsCount"),
);
assert.match(source, /const wsPaidMatch = typeof rawArg === "string" \? \/\^watersheep-/);
assert.match(source, /DON_COMBO_OBSERVATION minute=/);
assert.match(source, /"DonCombo extended CLI active/);
assert.match(source, /No beach walks or WaterSheep requests were made by this diagnostic/);

for (const file of [legacy, unique]) {
  assert.ok(existsSync(file), `Missing compiled entrypoint: ${file}`);
  const compiled = readFileSync(file, "utf8");
  for (const phrase of [
    "DON_COMBO_OBSERVATION minute=",
    "watersheep-",
    "DonCombo extended CLI active",
    "don_combo_share_data",
    "WaterSheep: pre-scoring",
  ]) {
    assert.ok(compiled.includes(phrase), `Missing feature "${phrase}" in ${file}`);
  }
}

console.log(
  "DonCombo distinct CLI binary, legacy compatibility and read-only self-identification PASS",
);
