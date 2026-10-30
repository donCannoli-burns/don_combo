import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/don_combo_runtime.ts", import.meta.url), "utf8");
const adapter = readFileSync(
  new URL("../mafia/scripts/don_combo/watersheep_post_adapter.py", import.meta.url), "utf8",
);
for (const token of [
  "http://127.0.0.1:8766/v1/kolmafia",
  "visitUrl(url, true, true)",
  "urlEncode(JSON.stringify(payload))",
]) assert.ok(source.includes(token), "Missing client transport " + token);
assert.ok(!source.includes("visitUrl(url, false)"));
for (const token of [
  '("127.0.0.1", args.listen_port)',
  '/v1/systemone',
  'method="POST"',
  "MAX_BODY",
  "shadow-only; no action authorized",
]) assert.ok(adapter.includes(token), "Missing adapter safety " + token);
console.log("WaterSheep transport uses loopback form POST and standard JSON POST upstream: PASS");
