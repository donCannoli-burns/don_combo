# WaterSheep × Combo matrix prototype

The downstream prototype preserves Combo's normal execution path and rare-tile corpus while adding a read-only shadow-routing lab.

## v0.2 boundary

- **Dense address space:** all 1,000,000 beach tiles retain deterministic order-10 Hilbert addresses inside a 1024 × 1024 matrix.
- **Sparse inference:** WaterSheep receives only a small mixed frontier of current, previously observed, and deterministic exploration beachfronts.
- **Blinded route assessment:** known rare coordinates, known-rare counts, Combo's target, and Combo's shuffled order are withheld from WaterSheep input.
- **Observed evidence ledger:** distinct local `_beachLayout` snapshots are recorded in `data/don_combo_matrix_ledger.json`; repeated layouts are deduplicated by hash.
- **Uncalibrated model output:** WaterSheep output is labeled **score mass**, not a validated KoL probability.
- **Policy outside the model:** fixed outcome weights and exploration/observation adjustments are applied after inference.
- **Exact baseline comparison:** the relay launcher supplies read-only `my_id()` and `gameday_to_int()` context so the browser can reproduce Combo's seeded shuffle and tide-skip behavior without issuing a game action.
- **No authority:** neither the bridge nor relay page sends a KoL request or executes a KoLmafia command.

## Evidence classes

The relay UI makes three evidence classes explicit:

- **FACT** — local KoLmafia preferences, Combo's corpus, current layout, and observation ledger.
- **MODEL** — WaterSheep score mass over rare / whale / sandcastle / twinkle / regular / scratched.
- **POLICY** — deterministic utility weights and post-model ranking math.

Known facts always outrank model inference.

## Candidate frontier

A default refresh scores six fronts:

1. the current beach, when known;
2. a bounded set of previously observed fronts with useful signal;
3. deterministic exploration samples from the full 1..10,000 beachfront space.

This keeps the million-cell world model while avoiding a million model calls.

## UI lineage

The relay surface uses `es-3581100/math-by-design` at commit
`4f3cfebc0bc8f2f243080d9c758290323eeaf595` as a **reference, not a template**.

Borrowed behavior is limited to semantic hierarchy, evidence/provenance separation, stable inspection destinations, and agent-readable handoff structure. Its visual palette, typography signature, and mathematical branding are not copied.

## Run

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

The expected v0.2 terminal line is:

```text
don_combo matrix v0.2: ready | 6 candidates | shadow top <minute> | <mafia-root>
```

The first evaluation target is not "does WaterSheep predict rares?" It is: **does a blinded dynamic shadow route produce useful disagreements with Combo that survive comparison against actual observations?**
