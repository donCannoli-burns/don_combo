# WaterSheep × Combo matrix prototype

The downstream prototype preserves Combo's normal execution path and rare-tile corpus while adding a read-only shadow-routing lab.

## v0.3 boundary

- **Dense address space:** all 1,000,000 beach tiles retain deterministic order-10 Hilbert addresses inside a 1024 × 1024 matrix.
- **Sparse inference:** WaterSheep receives only a small mixed frontier rather than scanning the whole matrix.
- **Baseline in pool:** Combo's exact next deterministic target is inserted into the same WaterSheep scoring pool as the dynamic alternatives.
- **Blinded route assessment:** WaterSheep is not told which candidate is Combo's target, whether a candidate is a known rare, the known-rare count, the Combo order, or the human-facing candidate source label.
- **Observed evidence ledger:** distinct local `_beachLayout` snapshots are recorded in `data/don_combo_matrix_ledger.json`; repeated layouts are deduplicated by hash.
- **Uncalibrated model output:** WaterSheep output is labeled **score mass**, not a validated KoL probability.
- **Policy outside the model:** fixed outcome weights and exploration/observation adjustments are applied after inference.
- **Readiness metrics:** the UI reports evidence maturity, top-vs-second margin, baseline rank, and ranking separation without presenting those values as calibrated confidence.
- **Durable receipts:** materially new comparison states append to `data/don_combo_matrix_receipts.jsonl`; unchanged watch cycles do not spam duplicate receipts.
- **No authority:** neither the bridge nor relay page sends a KoL request or executes a KoLmafia command.

## Runtime context owner

When installed, `kol-goblin-docs` is the preferred owner of KoLmafia-local runtime identity/context.

The matrix bridge reads:

```text
data/kol-goblin-docs/runtime.tsv
```

and consumes its read-only `player_id` and `gameday` fields to reproduce Combo's deterministic seeded shuffle and tide visibility. This avoids creating a second parallel player/day context store.

The browser independently reproduces the same baseline from relay-local `my_id()` / `gameday_to_int()` values and reports baseline parity, providing a second implementation check.

## Evidence classes

The relay UI makes three evidence classes explicit:

- **FACT** — local KoLmafia preferences, Combo's corpus, current layout, observation ledger, and exact Combo baseline.
- **MODEL** — WaterSheep score mass over rare / whale / sandcastle / twinkle / regular / scratched.
- **POLICY** — deterministic utility weights and post-model ranking math.

Known facts always outrank model inference.

## Candidate pool

A normal v0.3 comparison includes:

1. Combo's exact next deterministic target as a **blinded baseline**;
2. the current beach, when known and not already the baseline;
3. a bounded set of previously observed fronts with useful local signal;
4. deterministic exploration samples from the full 1..10,000 beachfront space.

With the default `--candidate-count 6`, a valid baseline produces a seven-member scoring pool: one blinded Combo baseline plus six dynamic candidates.

## Readiness

The current readiness labels are deliberately simple:

- `COLD_START` — none of the scored pool members has observed layout evidence.
- `WARMING` — some observed evidence exists, but the pool/corpus is still sparse.
- `EVIDENCE_RICH` — at least half the current pool is observation-backed and at least ten fronts exist in the local ledger.

`ranking_separation` is derived only from the top-vs-second utility margin. It is descriptive and **not** model confidence.

## Receipts

For each materially distinct state, the bridge writes a compact comparison receipt containing:

- exact Combo baseline and its rank in the blinded pool;
- WaterSheep top candidate;
- top-vs-second and top-vs-baseline deltas;
- candidate score mass and utility;
- observation coverage;
- evidence maturity;
- a SHA-256 state key.

Files:

```text
data/don_combo_matrix_last_receipt.json
data/don_combo_matrix_receipts.jsonl
```

## HTML snapshot export

The relay exposes **Export HTML snapshot** in both the sticky header and the agent-packet section.

The export is intentionally a frozen evidence artifact rather than a browser-dependent page save:

- converts the live 1024 × 1024 Hilbert canvas into an embedded PNG data URL;
- preserves the currently rendered baseline/shadow comparison, candidate table, selected evidence inspector, readiness metrics, agent packet, and runtime/provenance;
- removes all executable scripts and disables controls;
- adds a visible snapshot manifest with export time, runtime generation time, receipt state hash, and `authority: none`;
- embeds the full runtime object plus selected-candidate index and agent packet as inert `application/json` for downstream machine/LLM inspection;
- uses a deterministic filename shape: `don_combo-shadow-<runtime-time>-<receipt-prefix>.html`.

The snapshot does not execute KoL requests, KoLmafia commands, or WaterSheep inference when opened.

## UI lineage

The relay surface uses `es-3581100/math-by-design` at commit
`4f3cfebc0bc8f2f243080d9c758290323eeaf595` as a **reference, not a template**.

Borrowed behavior is limited to semantic hierarchy, evidence/provenance separation, stable inspection destinations, and agent-readable handoff structure. Its visual palette, typography signature, and mathematical branding are not copied.

## Run

Start WaterSheep locally:

```bash
watersheep --model samratduttaofficial/WaterSheep --serve
```

Install or repair the callable aliases:

```text
call agent_skill_relay.js --install
```

Then use Combo normally:

```text
combo 10
```

The alias routes through `don_combo_listener.ash`. That wrapper calls the real
Combo script, refreshes Goblin Docs context when available, writes one flat ASH
map request with `map_to_file()`, invokes the typed TypeScript runtime
synchronously, and returns.

For a no-KoL-mutation boundary smoke:

```text
agentcall.combo-smoke
```

Open the KoLmafia relay browser and select `DonComboMatrix` from the
`-run script-` dropdown.

The evaluation target remains: **does a blinded dynamic route consistently rank
or discover better real outcomes than the existing deterministic Combo route
once observation evidence accumulates?**


## v0.6 native TypeScript runtime cut

The v0.7 runtime keeps the hot path into the same tested KoLmafia TypeScript/Libram toolchain used by Combo.

Control flow:

```text
combo <n>
  -> kolmafia-skills alias
  -> don_combo_listener.ash
  -> real combo/combo.js
  -> Goblin Docs context refresh
  -> ASH string[string] request
  -> map_to_file(agent-runtime/inbox/<id>.txt)
  -> don_combo_runtime.js
  -> fileToBuffer + native ASH-map text decoder
  -> localhost WaterSheep scoring
  -> runtime/receipt artifacts
  -> return
```

There is no dedicated matrix watcher or Python listener in this path. The previous Python bridge remains historical/fallback material while the TS cut is proven.

Combo now records beach observations directly when it knows the layout and deterministic outcome. Session logs remain recovery/audit evidence rather than the hot-path signal.

### Type/reference lineage

- **Libram / KoLmafia TypeScript bindings:** runtime vocabulary and native game-state access.
- **Excavator:** precedent for KoLmafia-native event-driven evidence collection. The runtime includes an `excavator-smoke` envelope check and does not replace or modify `spadingScript`.
- **SymType:** design reference only for explicit properties, relations, and indeterminate truth. No SymType/SymPy runtime dependency is introduced.
- **WaterSheep:** advisory model scoring only.

The runtime exposes a deterministic proof graph alongside model output. Facts and relations are explicitly typed as FACT/MODEL/POLICY and relation truth can be true, false, or indeterminate. This proof graph is not sent to WaterSheep unless a field is deliberately projected into the blinded evidence DTO.

### Native smoke

After install/update:

```text
agentcall.combo-smoke
```

or:

```text
call don_combo/don_combo_listener.ash smoke excavator
```

round-trips an Excavator-shaped `event/meta/page` envelope through ASH `map_to_file()` and the TypeScript decoder. It performs no KoL action, does not change `spadingScript`, and makes no spading network request.

## Offline deterministic WaterSheep lab

The live KoLmafia runtime does not depend on Node, SQLite, `kol.js`, or
`kolmafia-mock`. Those pieces form a separate test ring in
`donCannoli-burns/tokens-of-loathing`.

The lab reuses the pinned SQLite-backed mock materializer, validates real KoL
item IDs through both the corpus and mock, then runs explicit labeled beach
fixtures through the same model-facing contract:

```text
don-combo-watersheep-evidence/v1
```

Optional comparison to a live runtime hard-fails on contract mismatch. The
benchmark produces accuracy, multiclass Brier, ECE, latency, per-class metrics,
and optional cyclic option-order flip rate.

Kingdomsitter remains the ASH parse/typed-IR/transpile verification layer;
`ashref` remains installed-runtime truth; `kolmafia-types` is a secondary
compile-time/reference oracle; `kol.js` is confined to the offline test/data
ring.


## ML Lab / frozen experiment artifact

The v0.7 runtime adds an opt-in target-trace stream without changing Combo's authority.

When `don_combo_ml_trace=true`, Combo asks WaterSheep exactly once for the planned target after the beach layout is known and before any tile is combed. The result is advisory only. The actual comb then records its coordinate plus the Session delta for meat and items into:

```text
data/don_combo_ml_events.jsonl
```

Each event uses `don-combo-ml-event/v0.1` and binds:

```text
pre-action target evidence
  -> WaterSheep score mass
  -> model-only weighted utility
  -> deterministic model+policy utility
  -> actual comb coordinate
  -> deterministic outcome label
  -> exact item/meat delta
```

A WaterSheep error is caught, recorded, and never blocks or redirects Combo.

The model-facing DTO no longer contains `observed_outcome_rates`. In particular, labels such as `rare_target`, `false_rare_rough`, and fallback classes are deterministic evaluation/policy evidence and are withheld from WaterSheep so they cannot proxy Combo's known-rare route.

The relay's **ML Lab** renders two paper-style SVG plots:

1. pre-action model-only and model+policy utility over traced combs, with actual outcome markers and exact loot in the live hover metadata;
2. Combo baseline rank over durable shadow snapshots, comparing WaterSheep-only rank with final model+policy rank.

It also renders a per-comb table with front, prediction, actual outcome, actual comb coordinate, loot, and inference latency.

The HTML exporter freezes those plots and tables into `don-combo-html-snapshot/v0.4` and embeds the full v0.7 runtime as inert `application/json`. The artifact is therefore sufficient to answer questions such as “what did WaterSheep say before the driftwood hit?” for events captured after tracing was enabled.

Older ledger observations remain valid evidence but cannot be retroactively assigned a pre-action prediction.


## v0.7 run-control proof

Cooperative interrupt state is now part of the evidence contract rather than console-only context.

The runtime and durable receipt include `don-combo-run-control/v0.1`:

```json
{
  "requested_combs": 100,
  "completed_combs": 27,
  "status": "interrupted",
  "end_reason": "user_cooperative_interrupt",
  "interrupt_consumed": true,
  "ml_events_before": 110,
  "ml_events_after": 137,
  "ml_event_delta": 27,
  "ml_trace_span_complete": true
}
```

The values come from KoLmafia-local preferences written by Combo itself. The state hash includes this envelope, so a receipt changes when the run-control outcome changes even if the candidate pool does not.

Snapshot `don-combo-html-snapshot/v0.5` copies the same fields into visible manifest rows and machine-readable `meta` tags while retaining the complete `run_control` object in inert embedded JSON. This allows one exported artifact to establish that a requested run ended early by cooperative user interrupt, exactly how many combs completed, and whether the ML event span is complete.

The relay interrupt remains control-plane only. It cannot cancel an in-flight KoL request, and WaterSheep remains advisory with no execution authority.
