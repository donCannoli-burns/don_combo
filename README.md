# don_combo

> Experimental downstream fork of [loathers/combo](https://github.com/loathers/combo). The normal Combo execution path and rare-tile data are preserved; the WaterSheep/Hilbert matrix is shadow-only and does not execute KoL actions.

## Introduction

Combo is an automated [beach combing](https://kol.coldfront.net/thekolwiki/index.php/Comb_the_Beach) script that harvests known rare tiles. This downstream copy currently preserves the upstream data set of 1,001 rare-tile records.

## Setup

Install this downstream release from the KoLmafia CLI:

```text
git checkout https://github.com/donCannoli-burns/don_combo.git release
```

If the upstream Combo project is already installed, remove that project first so both projects do not claim the same `scripts/combo/combo.js` and `data/raretiles.json` files.

## Usage

Normal Combo behavior is unchanged. Run `combo N` in the KoLmafia CLI, where `N` is the number of combs you wish to perform. Combo does not differentiate between free and non-free combs, so `combo 11` performs eleven combs.

## WaterSheep matrix prototype

The downstream release adds a relay-browser entry named `DonComboMatrix`. It displays the complete 1,000,000-tile beach address space inside a 1024 x 1024 order-10 Hilbert matrix, overlays known rare positions and the currently observed beach front, and shows WaterSheep score-mass reports for a small mixed candidate frontier drawn from current, observed, and deterministic exploration fronts.

WaterSheep remains advisory only. The exact Combo baseline is scored inside the same pool as the dynamic alternatives, but baseline membership, known rare coordinates/counts, candidate source labels, and Combo's route are withheld from model input. Its score mass is explicitly uncalibrated for KoL beach outcomes.

The preferred v0.6 runtime is KoLmafia-native: Combo records observations directly from its TypeScript execution path, a short ASH wrapper emits a flat `string[string]` request with `map_to_file()`, and `don_combo_runtime.js` reads the native tab-delimited map wire with `fileToBuffer()`, validates typed contracts, calls localhost WaterSheep, writes the rich runtime/receipt artifacts, and returns. Goblin Docs remains the read-only player/day context owner. No dedicated Python matrix watcher is required.

Start the downstream KOL-WaterSheep server:

```bash
watersheep --model samratduttaofficial/WaterSheep --serve
```

Install/repair the callable aliases from `kolmafia-skills`:

```text
call agent_skill_relay.js --install
```

Then normal use remains:

```text
combo 10
```

The installed `combo` alias routes through `don_combo_listener.ash`, executes the deterministic Combo script, refreshes Goblin Docs context, runs one advisory matrix reassessment, and returns. For a no-KoL-mutation compatibility smoke:

```text
agentcall.combo-smoke
```

That round-trips an Excavator-shaped `event/meta/page` envelope through the same native ASH-map/TypeScript boundary without changing `spadingScript` or sending spading data.

Then open the KoLmafia relay browser and choose `DonComboMatrix` from the `-run script-` dropdown.

### Clean relay interrupt

The downstream release also adds `DonComboInterrupt` to the same relay-script dropdown. This is a cooperative stop modeled after garbage-collector's relay interrupt: it sets a local `don_combo_interrupt` preference and lets the running Combo invocation consume that request at a safe boundary.

The Shadow Route Lab exposes the same control as **Interrupt after current comb**.

A cooperative interrupt never cuts through an in-flight beach comb. Combo finishes the current comb, writes its observation/ML trace, exits the Beach choice, restores its temporary preference filter, prints partial run results, and returns normally. The listener then refreshes the shadow runtime with reason `combo-interrupted`.

The relevant local state is:

```text
don_combo_running
don_combo_interrupt
don_combo_last_run_status
don_combo_last_run_combs
```

If `DonComboInterrupt` is selected while Combo is idle, it clears any stale stop request and performs no action. The relay control itself never issues a KoL action.

The relay also exposes **Export HTML snapshot**. It downloads a self-contained, script-free HTML evidence artifact containing the frozen Hilbert canvas, rendered comparison/evidence UI, agent packet, provenance, and the full runtime object as inert `application/json`. Snapshot filenames include the runtime timestamp and the first 12 characters of the comparison receipt state hash.

### ML trace and all-in-one experiment artifact

The relay now includes an **ML Lab** section inspired by compact research-paper plots. It separates two questions that the earlier snapshot blurred together:

- **model-only history** — WaterSheep score-mass rank for Combo's blinded baseline;
- **model + policy history** — the final deterministic utility rank after exploration and observed-evidence adjustments;
- **per-comb target traces** — an optional pre-action WaterSheep score for the exact Combo target, joined after the action to the actual comb coordinate, outcome, meat, and item delta.

Per-comb tracing is opt-in because it adds one localhost WaterSheep inference per successful comb. Enable it from gCLI:

```text
set don_combo_ml_trace=true
combo 10
```

Disable it with:

```text
set don_combo_ml_trace=false
```

Trace failures are evidence failures only: Combo continues on its deterministic route and the failed prediction is logged instead of gaining fallback authority. New trace rows append to `data/don_combo_ml_events.jsonl`.

The exported HTML snapshot is self-contained and includes the rendered ML plots, per-comb verification table, current comparison, receipt history summary, and inert machine-readable runtime. Older observations cannot be retroactively assigned a pre-action WaterSheep score; exact prediction-to-loot attribution begins only after tracing is enabled.

WaterSheep input intentionally excludes Combo-derived outcome labels such as `rare_target` and fallback classifications. Those remain available to deterministic policy and evaluation only.

See [docs/WATERSHEEP_MATRIX_PROTOTYPE.md](docs/WATERSHEEP_MATRIX_PROTOTYPE.md) for the prototype boundary and data flow.

## Rare tile data

The rare-tile list is in [mafia/data/raretiles.json](mafia/data/raretiles.json). The formatting follows KoLmafia's beach coordinates: rows are 1-indexed and columns are 0-indexed.

## How does Combo work?

In order to avoid having all users combing the same tiles in sequence, whenever Combo is called it shuffles the order of the rare tiles using your user ID as a seed. This gives each player a persistent rare-tile order until the data changes. Combo walks that sequence, skips inaccessible submerged tiles, and records progress in `combo_lastTileCombed`.

### Frequently Asked Questions

> COMBO printed out "Our rare tile is combed, but we found a twinkle!" -- what does that mean?

The scarce beach-comb tile Combo targeted has already been combed, so rather than taking an already-combed tile it found a twinkly spot. Twinkly spots yield uncommon items rather than the common pool.

### Credits

The downstream prototype preserves the original Combo project and its credits. Thank you to the players who provided the rare-tile data:

- Tadpoleloop
- SSBBHax
- DanceCommander6
- Disco Stew
- Grushvak
- Veracity
- The Dictator
- Playultm8

## Offline deterministic lab

The live runtime stays intentionally small. Offline model evaluation lives in the
`tokens-of-loathing` compatibility stack:

```text
tokens-of-loathing SQLite snapshot
        +
pinned kolmafia-mock
        +
kol.js pure utilities
        ↓
explicit labeled beach evidence fixtures
        ↓
don-combo-watersheep-evidence/v1
        ↓
WaterSheep benchmark
```

Materialize it from the `tokens-of-loathing` checkout:

```bash
bash compat/don-combo-watersheep/materialize.sh \
  --lab-dir /tmp/don-combo-watersheep \
  --watersheep http://127.0.0.1:8766/v1/systemone \
  --live-runtime ~/.kolmafia/data/don_combo_matrix_runtime.json
```

The lab records corpus/mock provenance, SQLite SHA-256, accuracy, multiclass
Brier, ECE, latency, per-class metrics, and optional cyclic option-order flip
rate. Lab results are test evidence only and never grant live KoL authority.
