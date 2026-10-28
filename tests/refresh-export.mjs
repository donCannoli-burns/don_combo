import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../mafia/relay/don_combo_matrix.html", import.meta.url), "utf8");
const ash = readFileSync(
  new URL("../mafia/relay/relay_DonComboRefresh.ash", import.meta.url),
  "utf8",
);
const native = readFileSync(new URL("../src/don_combo_runtime.ts", import.meta.url), "utf8");

assert.match(html, /id="refreshMatrix"/);
assert.doesNotMatch(html, /onclick="location\.reload\(\)"/);
assert.match(html, /relay_DonComboRefresh\.ash\?ts=/);
assert.match(html, /function exportFreshSnapshot\(\)/);
assert.match(html, /refreshAndVerify\(\)\.then\(function\(\)\{exportHtmlSnapshotVerified\(\)\}\)/);
assert.match(html, /if\(!R\|\|R\.generated_at!==verifiedGeneration\)/);
assert.match(html, /"don-combo-refresh-verified-generation",verifiedGeneration/);
assert.match(html, /if\(refreshBusy\)return;/);
assert.match(ash, /don_combo_running/);
assert.match(ash, /don_combo\/don_combo_listener\.ash refresh combo-matrix-manual/);
assert.match(ash, /data-status=/);
assert.match(ash, /data-generation=/);
assert.match(ash, /data-events=/);
assert.match(ash, /data-run-status=/);
assert.match(native, /setProperty\("don_combo_matrix_refresh_generation"/);
assert.match(native, /setProperty\("don_combo_matrix_refresh_events"/);
assert.match(native, /setProperty\("don_combo_matrix_refresh_run_status"/);

// Execute the exact pure browser validator. These tests model the user's
// October 28 evidence: a stale 3,117-event snapshot exported after a 3,129-
// event interrupted run. Export MUST refuse that mismatch, even if the page
// itself was reloaded and the HTML filename had a later wall-clock time.
const start = html.indexOf("function validateRefreshedRuntime(");
const end = html.indexOf("\nfunction parseRuntimeJs(", start);
assert.ok(start > 0 && end > start, "pure refresh validator exists");
const validate = new Function(html.slice(start, end) + "\nreturn validateRefreshedRuntime;")();
const newer = {
  schema: "don-combo-matrix-runtime/v0.8-ts",
  generated_at: "2026-10-28T06:31:12.000Z",
  player_id: 1079721,
  gameday: 30,
  ml_lab: { events_total: 3129 },
  run_control: { status: "interrupted", completed_combs: 12 },
};
const receipt = {
  generation: newer.generated_at,
  previousGeneration: "2026-10-28T06:28:56.245Z",
  events: 3129,
  runStatus: "interrupted",
  player: 1079721,
  gameday: 30,
};
assert.equal(validate(newer, receipt), true);
const stale = {
  ...newer,
  generated_at: "2026-10-28T06:28:56.245Z",
  ml_lab: { events_total: 3117 },
  run_control: { status: "completed", completed_combs: 50 },
};
assert.throws(() => validate(stale, receipt), /generation/);
assert.throws(
  () => validate({ ...newer, ml_lab: { events_total: 3117 } }, receipt),
  /ML event count/,
);
assert.throws(
  () => validate({ ...newer, run_control: { status: "completed" } }, receipt),
  /Run status/,
);
assert.throws(() => validate({ ...newer, gameday: 31 }, receipt), /game day/);
assert.throws(() => validate({ ...newer, player_id: 1 }, receipt), /player/);
assert.throws(
  () => validate(newer, { ...receipt, previousGeneration: newer.generated_at }),
  /unchanged/,
);
assert.throws(() => validate(null, receipt), /schema/);
assert.throws(() => validate(newer, { ...receipt, generation: null }), /generation/);

console.log(
  "native relay refresh + verified export regression: PASS (stale 3117 vs 3129 rejected)",
);
