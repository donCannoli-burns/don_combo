import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Some downstream Node 22 builds disable native TypeScript stripping.
// Compile this tiny, dependency-free TypeScript module with the project's
// existing devDependency, then exercise the actual exported implementation.
const source = readFileSync(
  new URL("../src/runtime/watersheep-endpoint.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  fileName: "watersheep-endpoint.ts",
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2018 },
  reportDiagnostics: true,
});
const errors = (compiled.diagnostics ?? []).filter(
  (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
);
assert.deepEqual(errors, [], "Endpoint TypeScript must transpile without errors");
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString("base64")}`;
const { DEFAULT_WATERSHEEP_ENDPOINT, resolveWaterSheepEndpoint } = await import(moduleUrl);

assert.equal(resolveWaterSheepEndpoint(""), DEFAULT_WATERSHEEP_ENDPOINT);
for (const host of ["127.0.0.1", "172.29.0.1", "10.2.3.4", "192.168.1.1"]) {
  const endpoint = `http://${host}:8768/v1/kolmafia`;
  assert.equal(resolveWaterSheepEndpoint(endpoint), endpoint);
}
for (const unsafe of [
  "http://0.0.0.0:8768/v1/kolmafia",
  "http://8.8.8.8:8768/v1/kolmafia",
  "http://169.254.1.1:8768/v1/kolmafia",
  "http://127.0.0.2:8768/v1/kolmafia",
  "http://172.32.0.1:8768/v1/kolmafia",
  "http://192.169.0.1:8768/v1/kolmafia",
  "http://172.29.0.1:8767/v1/kolmafia",
  "http://172.29.0.1:8768/other",
  "https://172.29.0.1:8768/v1/kolmafia",
  "http://localhost:8768/v1/kolmafia",
  "http://user@172.29.0.1:8768/v1/kolmafia",
  "http://172.29.0.1:8768/v1/kolmafia?x=1",
  "http://172.029.0.1:8768/v1/kolmafia",
  "http://999.29.0.1:8768/v1/kolmafia",
  " http://172.29.0.1:8768/v1/kolmafia",
  "http://172.29.0.1:8768/v1/kolmafia\n",
]) {
  assert.throws(() => resolveWaterSheepEndpoint(unsafe), /Invalid|must be/);
}
console.log("Private WaterSheep endpoint validation: PASS");
