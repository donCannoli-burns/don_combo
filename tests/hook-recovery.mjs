import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const control = readFileSync(new URL("../mafia/scripts/don_combo.js", import.meta.url), "utf8");
const listener = readFileSync(
  new URL("../mafia/scripts/don_combo/don_combo_listener.ash", import.meta.url),
  "utf8",
);

assert.match(listener, /DON_COMBO_LISTENER_V2 stable=don_combo\/doncombo\.js/);
assert.match(listener, /string invoke = "call don_combo\/doncombo\.js"/);
assert.doesNotMatch(listener, /string invoke = "call combo\/combo\.js"/);

const EXPECTED = "call don_combo.js run %%";
const commands = ["status", "-restore", "status --r"];

function scenario({
  alias,
  listenerReady = true,
  binaryReady = true,
  command,
  expectedWrites,
  expectedActive,
  savedBackup,
}) {
  let current = alias;
  const executed = [];
  const output = [];
  const prefs = {};
  const mafia = {
    cliExecuteOutput(command) {
      executed.push(["read", command]);
      if (command === "alias combo") return current ?? "";
      if (command === "call don_combo/don_combo_listener.ash identify") {
        return listenerReady
          ? "DON_COMBO_LISTENER_V2 stable=don_combo/doncombo.js"
          : "listener missing";
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
    getProperty(key) {
      return prefs[key] ?? "";
    },
    setProperty(key, value) {
      prefs[key] = value;
    },
    print(message) {
      output.push(message);
    },
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

scenario({
  alias: "combo => " + EXPECTED,
  command: "status",
  expectedWrites: 0,
  expectedActive: true,
});
scenario({
  alias: "<b> combo </b> => " + EXPECTED,
  command: "status",
  expectedWrites: 0,
  expectedActive: true,
});
scenario({
  alias: "<b> agentcall.combo </b> => something\n<b> combo </b> => " + EXPECTED,
  command: "status --r",
  expectedWrites: 0,
  expectedActive: true,
});
scenario({
  alias: "combo => call combo/combo.js %%",
  command: "status",
  expectedWrites: 0,
  expectedActive: false,
});
scenario({ alias: "", command: "status --r", expectedWrites: 1, expectedActive: true });
scenario({
  alias: "combo => call other.ash %%",
  command: "-restore",
  expectedWrites: 1,
  expectedActive: true,
  savedBackup: "call other.ash %%",
});
scenario({
  alias: "combo => " + EXPECTED,
  command: "status --r",
  expectedWrites: 0,
  expectedActive: true,
});
scenario({
  alias: "combo => call other.ash %%",
  listenerReady: false,
  command: "status --r",
  expectedWrites: 0,
  expectedActive: false,
});
scenario({
  alias: "combo => call other.ash %%",
  binaryReady: false,
  command: "-restore",
  expectedWrites: 0,
  expectedActive: false,
});

// The guarded combo alias must dispatch only after the internal Boolean
// verification succeeds. Never rely on comparing printed status text.
function runScenario({
  alias,
  listenerReady = true,
  binaryReady = true,
  command = "run watersheep-30",
  expectedRestores = 0,
  expectedDispatches = 1,
  listenerSucceeds = true,
}) {
  let current = alias;
  const calls = [];
  const output = [];
  const prefs = {};
  const mafia = {
    cliExecuteOutput(cmd) {
      calls.push(["read", cmd]);
      if (cmd === "alias combo") return current;
      if (cmd === "call don_combo/don_combo_listener.ash identify")
        return listenerReady ? "DON_COMBO_LISTENER_V2 stable=don_combo/doncombo.js" : "missing";
      if (cmd === "call don_combo/doncombo.js info")
        return binaryReady ? "DonCombo extended CLI active" : "missing";
      throw Error("unexpected probe: " + cmd);
    },
    cliExecute(cmd) {
      calls.push(["write", cmd]);
      if (cmd === "alias combo => " + EXPECTED) {
        current = "combo => " + EXPECTED;
        return true;
      }
      if (cmd.startsWith("call don_combo/don_combo_listener.ash combo")) return listenerSucceeds;
      throw Error("unexpected CLI call " + cmd);
    },
    getProperty(name) {
      return prefs[name] ?? "";
    },
    setProperty(name, value) {
      prefs[name] = value;
    },
    print(value) {
      output.push(value);
    },
  };
  const module = { exports: {} };
  runInNewContext(control, { require: () => mafia, module, exports: module.exports });
  module.exports.main(command);
  const writes = calls.filter(([kind]) => kind === "write").map(([, value]) => value);
  const restores = writes.filter((value) => value === "alias combo => " + EXPECTED);
  const dispatches = writes.filter((value) =>
    value.startsWith("call don_combo/don_combo_listener.ash combo"),
  );
  assert.equal(restores.length, expectedRestores);
  assert.equal(dispatches.length, expectedDispatches);
  assert.ok(
    !writes.some((value) => /^combo(?:\s|$)/.test(value)),
    "Recursive combo dispatch forbidden",
  );
  assert.ok(
    !writes.some((value) => /beach wander|beach comb/i.test(value)),
    "Controller never combs directly",
  );
  if (expectedDispatches === 0 && command.startsWith("run"))
    assert.ok(output.some((value) => /INACTIVE|invalid combo argument/.test(value)));
}

runScenario({ alias: "combo => " + EXPECTED });
runScenario({ alias: "<b> combo </b> => " + EXPECTED, command: "run watersheep-free" });
runScenario({ alias: "combo => call combo/combo.js %%", command: "run 1", expectedRestores: 1 });
runScenario({ alias: "combo => " + EXPECTED, command: "run", expectedDispatches: 1 });
runScenario({ alias: "combo => other", listenerReady: false, expectedDispatches: 0 });
runScenario({ alias: "combo => other", binaryReady: false, expectedDispatches: 0 });
runScenario({
  alias: "combo => " + EXPECTED,
  command: "run watersheep-30; wait 1",
  expectedDispatches: 0,
});
runScenario({ alias: "combo => " + EXPECTED, command: "run 10 11", expectedDispatches: 0 });

console.log("DonCombo guarded run and recovery: 9 status/restore + 8 dispatch scenarios PASS");
