import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const control = readFileSync(new URL("../mafia/scripts/don_combo.js", import.meta.url), "utf8");
const listener = readFileSync(new URL("../mafia/scripts/don_combo/don_combo_listener.ash", import.meta.url), "utf8");

assert.match(listener, /DON_COMBO_LISTENER_V2 stable=don_combo\/doncombo\.js/);
assert.match(listener, /string invoke = "call don_combo\/doncombo\.js"/);
assert.doesNotMatch(listener, /string invoke = "call combo\/combo\.js"/);

const EXPECTED = "call don_combo/don_combo_listener.ash combo %%";
const commands = ["status", "-restore", "status --r"];

function scenario({ alias, listenerReady = true, binaryReady = true, command, expectedWrites, expectedActive, savedBackup }) {
  let current = alias;
  const executed = [];
  const output = [];
  const prefs = {};
  const mafia = {
    cliExecuteOutput(command) {
      executed.push(["read", command]);
      if (command === "alias combo") return current ?? "";
      if (command === "call don_combo/don_combo_listener.ash identify") {
        return listenerReady ? "DON_COMBO_LISTENER_V2 stable=don_combo/doncombo.js" : "listener missing";
      }
      if (command === "call don_combo/doncombo.js info") {
        return binaryReady ? "DonCombo extended CLI active" : "Invalid argument!";
      }
      throw Error("unexpected diagnostic: " + command);
    },
    cliExecute(command) {
      executed.push(["write", command]);
      assert.equal(command, "alias combo => " + EXPECTED);
      current = "combo => " + EXPECTED;
      return true;
    },
    getProperty(key) { return prefs[key] ?? ""; },
    setProperty(key, value) { prefs[key] = value; },
    print(message) { output.push(message); },
  };
  const module = { exports: {} };
  runInNewContext(control, { require: () => mafia, module, exports: module.exports });
  assert.ok(commands.includes(command));
  module.exports.main(command);
  const writes = executed.filter(([type]) => type === "write");
  assert.equal(writes.length, expectedWrites);
  assert.equal(output.includes("Don Combo hook: ACTIVE"), expectedActive);
  if (savedBackup) assert.equal(prefs.don_combo_previous_combo_alias, savedBackup);
  for (const [, cmd] of executed) {
    assert.doesNotMatch(cmd, /beach wander|beach comb|combo 1|watersheep-30|runChoice/i);
  }
}

scenario({ alias: "combo => " + EXPECTED, command: "status", expectedWrites: 0, expectedActive: true });
scenario({ alias: "<b> combo </b> => " + EXPECTED, command: "status", expectedWrites: 0, expectedActive: true });
scenario({ alias: "<b> agentcall.combo </b> => something\n<b> combo </b> => " + EXPECTED, command: "status --r", expectedWrites: 0, expectedActive: true });
scenario({ alias: "combo => call combo/combo.js %%", command: "status", expectedWrites: 0, expectedActive: false });
scenario({ alias: "", command: "status --r", expectedWrites: 1, expectedActive: true });
scenario({ alias: "combo => call other.ash %%", command: "-restore", expectedWrites: 1, expectedActive: true, savedBackup: "call other.ash %%" });
scenario({ alias: "combo => " + EXPECTED, command: "status --r", expectedWrites: 0, expectedActive: true });
scenario({ alias: "combo => call other.ash %%", listenerReady: false, command: "status --r", expectedWrites: 0, expectedActive: false });
scenario({ alias: "combo => call other.ash %%", binaryReady: false, command: "-restore", expectedWrites: 0, expectedActive: false });

console.log("DonCombo hook status and restore: 9 mock cases + stable-listener audit PASS");
