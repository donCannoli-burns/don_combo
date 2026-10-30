import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/don_combo_runtime.ts", import.meta.url), "utf8");
const adapter = readFileSync(
  new URL("../mafia/scripts/don_combo/watersheep_post_adapter.py", import.meta.url), "utf8",
);
assert.match(source, /127\\.0\\.0\\.1:8767\\/v1\\/kolmafia/);
assert.match(source, /visitUrl\\(url, true, true\\)/);
assert.doesNotMatch(source, /visitUrl\\(url, false\\)/);
assert.match(source, /urlEncode\\(JSON\\.stringify\\(payload\\)\\)/);
assert.match(adapter, /127\\.0\\.0\\.1/);
assert.match(adapter, /v1\\/systemone/);
assert.match(adapter, /method="POST"/);
assert.match(adapter, /MAX_BODY/);
assert.match(adapter, /shadow-only; no action authorized/);
console.log("WaterSheep transport uses loopback form POST and standard JSON POST upstream: PASS");
