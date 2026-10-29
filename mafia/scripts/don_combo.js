/*
 * Don Combo CLI hook control.
 * Usage: don_combo status | don_combo -restore | don_combo status --r
 * Status and probes are read-only; restore changes only the local combo alias.
 */
var km = require("kolmafia");

var HOOK = "call don_combo/don_combo_listener.ash combo %%";
var HOOK_COMMAND = "alias combo => " + HOOK;
var SAVED_ALIAS_PREF = "don_combo_previous_combo_alias";
var LISTENER_ID = "DON_COMBO_LISTENER_V2";
var EXECUTABLE_ID = "DonCombo extended CLI active";

function trim(value) {
  return String(value || "").replace(/^\s+|\s+$/g, "");
}
function joinArgs(args) {
  var parts = [];
  for (var i = 0; i < args.length; i++) parts.push(String(args[i]));
  return trim(parts.join(" "));
}
function aliasDefinition() {
  // Query ONLY alias definitions; never execute "combo" as a diagnostic.
  var output = "";
  try {
    output = String(km.cliExecuteOutput("alias combo") || "");
  } catch (error) {
    return { value: null, error: String(error) };
  }
  var lines = output.split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    // KoLmafia alias listings may arrive as HTML: <b> combo </b> => ...
    var listing = lines[i].replace(/<\/?b>/gi, "").replace(/&gt;/gi, ">").replace(/&amp;/gi, "&");
    var match = listing.match(/^\s*(?:>\s*)?combo(?:\s+%%)?\s*=>\s*(.*?)\s*$/i);
    if (match) return { value: trim(match[1]), error: null };
  }
  return { value: null, error: null };
}
function probe(command, marker) {
  try {
    return String(km.cliExecuteOutput(command) || "").indexOf(marker) >= 0;
  } catch (error) {
    return false;
  }
}
function inspect() {
  var alias = aliasDefinition();
  var listener = probe("call don_combo/don_combo_listener.ash identify", LISTENER_ID);
  var executable = probe("call don_combo/doncombo.js info", EXECUTABLE_ID);
  return {
    alias: alias,
    aliasOk: alias.value === HOOK,
    listenerOk: listener,
    executableOk: executable,
    active: alias.value === HOOK && listener && executable
  };
}
function report(result) {
  km.print("Don Combo hook: " + (result.active ? "ACTIVE" : "INACTIVE"),
    result.active ? "green" : "red");
  km.print("  combo alias: " +
    (result.aliasOk ? "correct" : result.alias.value === null ? "missing/unreadable" : "different"));
  if (result.alias.value !== null && !result.aliasOk)
    km.print("  current combo alias: " + result.alias.value, "gray");
  km.print("  listener identity: " + (result.listenerOk ? "ready (v2)" : "missing/old"), "gray");
  km.print("  unique executable: " + (result.executableOk ? "ready" : "missing/old"), "gray");
  if (!result.active)
    km.print("  Repair: don_combo status --r (or don_combo -restore).", "gray");
}
function restore() {
  // A different or missing listener cannot be repaired by re-aliasing.
  var before = inspect();
  if (!before.listenerOk || !before.executableOk) {
    km.print("Don Combo restore BLOCKED: update the Don Combo release first.", "red");
    km.print("  git update donCannoli-burns-don_combo-release");
    km.print("  don_combo status --r");
    return false;
  }
  if (before.alias.value !== null && !before.aliasOk &&
      !km.getProperty(SAVED_ALIAS_PREF)) {
    km.setProperty(SAVED_ALIAS_PREF, before.alias.value);
    km.print("Don Combo: previous combo alias saved to " + SAVED_ALIAS_PREF + ".", "gray");
  }
  if (!before.aliasOk) {
    if (!km.cliExecute(HOOK_COMMAND)) {
      km.print("Don Combo: KoLmafia rejected combo alias installation.", "red");
      return false;
    }
  } else {
    km.print("Don Combo: combo alias already correct (no rewrite).", "gray");
  }
  var after = inspect();
  if (!after.active) {
    km.print("Don Combo: restore verification FAILED; alias did not resolve.", "red");
    return false;
  }
  km.print("Don Combo: combo hook restored and verified. No beach combs executed.", "green");
  return true;
}
function main() {
  var args = joinArgs(arguments);
  if (args === "status") {
    report(inspect());
  } else if (args === "-restore") {
    restore();
    report(inspect());
  } else if (args === "status --r") {
    var state = inspect();
    report(state);
    if (!state.active) {
      km.print("Don Combo: hook inactive; attempting guarded alias restore.", "gray");
      restore();
      report(inspect());
    }
  } else {
    km.print("Don Combo CLI hook control (no gameplay actions):");
    km.print("  don_combo status       - read-only hook/executable check");
    km.print("  don_combo -restore     - manually restore combo alias");
    km.print("  don_combo status --r   - check and restore only if inactive");
  }
}
module.exports.main = main;
