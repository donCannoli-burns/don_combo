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

Update/refresh the already-installed Goblin Docs runtime snapshot first:

```text
update-llm
kol-goblin-docs refresh combo-matrix
```

Start WaterSheep locally:

```bash
watersheep --model samratduttaofficial/WaterSheep --serve
```

Then from the KoLmafia root:

```bash
python3 scripts/don_combo/watersheep_combo_bridge.py --watch 30
```

For a deterministic bridge/UI smoke test:

```bash
python3 scripts/don_combo/watersheep_combo_bridge.py --mock
```

Open the KoLmafia relay browser and select `DonComboMatrix` from the `-run script-` dropdown.

The expected v0.3 terminal line is:

```text
don_combo matrix v0.3: ready | pool 7 | baseline rank <n> | shadow top <minute> | <mafia-root>
```

The evaluation target remains: **does a blinded dynamic route consistently rank or discover better real outcomes than the existing deterministic Combo route once observation evidence accumulates?**
