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

The preferred v0.8 runtime is KoLmafia-native: Combo records observations directly from its TypeScript execution path, a short ASH wrapper emits a flat `string[string]` request with `map_to_file()`, and `don_combo_runtime.js` reads the native tab-delimited map wire with `fileToBuffer()`, validates typed contracts, calls localhost WaterSheep, writes the rich runtime/receipt artifacts, and returns. Goblin Docs remains the read-only player/day context owner. No dedicated Python matrix watcher is required.

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
don_combo_last_run_requested
don_combo_last_run_combs
don_combo_last_run_end_reason
don_combo_last_run_interrupt_consumed
don_combo_last_run_started_at
don_combo_last_run_ended_at
don_combo_last_run_ml_events_before
don_combo_last_run_ml_events_after
```

The v0.7 runtime projects those preferences into `run_control` in both the runtime and durable receipt. A clean early stop records `status=interrupted`, `end_reason=user_cooperative_interrupt`, the requested/completed comb counts, and `interrupt_consumed=true`. It also records the ML event count before and after the run and marks `ml_trace_span_complete=true` only when the event delta equals the completed comb count.

If `DonComboInterrupt` is selected while Combo is idle, it clears any stale stop request and performs no action. The relay control itself never issues a KoL action.

### Linked evidence atlas

The relay's primary proof surface now treats the Hilbert field, evidence graph, and readable tables as **projections of the same runtime data** rather than separate widgets.

Representation lineage is explicit:

- `es-3581100/math-by-design` @ `4f3cfebc0bc8f2f243080d9c758290323eeaf595` supplies semantic reading order and FACT / MODEL / POLICY / provenance separation.
- `es-3581100/Kotlin-Studio/Sacred-Computations-Map` @ `244b4cf4445abc4026975cdd6d2bbef6ded1591f` supplies the representation pattern: one semantic dataset projected into graph, matrix, focus inspector, signal profile, and exact readable cross-index.
- the user-provided Hilbert hash-table example (SHA-256 `6d2cb93d716a72789569005e3d41cd4eb3b227602eaace7e96720f45acd9ceac`) supplies the direct `(x,y) -> d -> bucket -> table` interaction and bucket-isolation behavior.

The atlas uses actual runtime evidence:

- every observed beachfront paints its real 100-address Hilbert span;
- known rare tiles, the current front, Combo baseline, and WaterSheep candidates remain separately legended layers;
- five lenses can show all evidence, observed fronts, candidates, known rares, or the current front;
- clicking a Hilbert cell resolves its exact `d`, 1/256 contiguous bucket, beach minute, row, and column;
- clicking a bucket row isolates that contiguous 4096-address Hilbert range without confusing ordinary cell selection with filtering;
- the relation graph traces the selected address through FACT observation evidence, model-safe WaterSheep scoring, deterministic policy utility, and any later traced outcome;
- the readable cross-index is built from the same observed-front and candidate objects painted into the matrix, so it remains the auditable fallback rather than a second data source;
- the candidate table reports both WaterSheep-only rank and final model+policy rank.

Runtime v0.8 therefore exposes compact per-front observation summaries under `observations.fronts` specifically so the spatial map and readable table can represent the ledger rather than merely decorating candidate points.

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

### Daily shadow learning (passive; no extra beach turns)

Every Combo run already records its pre-comb beachfront layout, the planned rare tile,
the **actual** comb coordinate, the fallback outcome, and inventory delta. Starting
with this release, each run also stamps its events with an exact run ID, KoL game
day, and route mode. At run completion, it appends a passive daily cohort receipt
to `data/don_combo_daily_shadow_runs.jsonl`.

The `combo watersheep-free`, `combo watersheep-N`, and relay top-11 routes
**automatically enable pre-comb WaterSheep shadow predictions** for that run,
even when `don_combo_ml_trace` is false. They still use the **original frozen
route**: the additional inference cannot alter targets, buy beach turns or train
the model in place. Pre-action inference failures are retained as errors, not
successful predictions, and never interrupt gameplay. The ordinary `combo N`
shuffled route keeps the existing opt-in `set don_combo_ml_trace=true` for
additional model requests; it always records passive layout/outcome/loot events
and produces a run summary without opt-in.

Each cohort reports recorded vs completed combs, prediction success/failure,
free and paid comb consumption, planned rare coordinates already combed, twinkle
and rough **fallback** counts, actual-vs-planned coordinate matches, and loot.
A twinkle on some other tile of the same beachfront is **not** a verified rare
respawn. In particular, an 11-comb run with six twinkle fallbacks is **six
incidental twinkles, not six rare-tile recoveries**. An observed rare-target
attempt is not by itself evidence of a verified rare drop. This artifact is
evidence for **later** offline calibration; it is not online weight training,
a claimed cooldown probability, or automatic authorization of actions.

The **ML Lab → Daily shadow-learning cohorts** table displays recent run
receipts by KoL game day. Earlier events remain readable but cannot
retroactively acquire a run ID or pre-action predictions.

The exported HTML snapshot is self-contained and includes the rendered ML plots, per-comb verification table, current comparison, receipt history summary, run-control proof, and inert machine-readable runtime. Snapshot v0.6 surfaces requested/completed combs, status, end reason, interrupt-consumed state, ML event span, and trace-span completeness directly in the frozen manifest. Older observations cannot be retroactively assigned a pre-action WaterSheep score; exact prediction-to-loot attribution begins only after tracing is enabled.

WaterSheep input intentionally excludes Combo-derived outcome labels such as `rare_target` and fallback classifications. Those remain available to deterministic policy and evaluation only.

See [docs/WATERSHEEP_MATRIX_PROTOTYPE.md](docs/WATERSHEEP_MATRIX_PROTOTYPE.md) for the prototype boundary and data flow.

<!-- prettier-ignore-start -->

## WaterSheep cooldown evidence and free-only top-11 route (experimental)

The native Combo observer writes a per-coordinate `data/don_combo_tile_recovery.json`
index alongside the existing ML trace and beachfront aggregate ledger. For every
known rare coordinate on a visited visible beachfront, the index records its
last observed state, observation count, last positive *loot-inferred* rare
harvest, observed still-combed states, and bounded intervals between a combed
observation and a subsequently observed twinkle.

**Evidence caveat:** A `rare_target` action is an attempt, not proof of a rare
drop. Candidate harvests require a positive inventory item delta and may still
need item-class verification; they are marked `loot-inferred`. Observing an
available tile bounds a cooldown interval; it does not establish the exact
respawn time. A 12-day revisit signal is an uncalibrated deterministic
exploration heuristic **not a probability or a claimed game mechanic**.
The special-event vs ordinary-rare pool theory is not treated as established
fact. Older aggregate ledger rows and per-comb traces are not retroactively
asserted to contain full tile-state histories.

Shadow scoring now samples 17 tide-accessible, known-rare beachfronts (including
the Combo baseline when available), not arbitrary empty fronts. WaterSheep sees
tile-level recovery evidence but remains advisory: exact Combo baseline membership,
candidate source labels and target order remain withheld. The candidate table
shows final model-plus-policy rank separately from model-only rank.

### gCLI: explicit WaterSheep routes (experimental)

The installed `combo` gCLI alias still calls the DonCombo listener, which forwards
arguments unchanged to the native Combo execution owner. The new modes are:

```text
combo watersheep-free
combo watersheep-20
```

- `watersheep-free` scores a fresh eligible rare-front pool and runs **only**
  the remaining daily free beach combs (up to 11). It refuses if none remain.
- `watersheep-N` scores a fresh eligible rare-front pool and executes exactly
  **N beach comb attempts** in descending frozen WaterSheep+policy order. It may
  use adventures once free beach combs are exhausted. **This explicitly
  authorizes adventure spending**; no extra free-only permission is inferred.
- `N` must be a positive integer, **1–100 per invocation**. The caller must
  have enough free combs and remaining adventures for the requested attempts.
  If WaterSheep cannot score enough accessible known rare fronts, the script
  refuses before touching KoL. It never silently returns to the original
  shuffled Combo path.
- The player, game day, snapshot age, unique coordinates, tide availability,
  model scoring, and each action's counter/adventure change are checked. A
  discrepancy stops further beach actions; existing cooperative interrupt
  support is preserved.
- Neither mode promises N *rare items*: an already-combed coordinate may
  fall back to the ordinary in-front twinkle/rough selection. The CLI argument
  counts beach comb attempts, not guaranteed loot or exactly N adventures
  deducted. A 20-comb run might use some free combs and some paid ones.
- Opening the relay **Review** page is read-only; it now reports why a route
  is blocked rather than presenting a dead disabled button. A second
  confirmation remains required before a free relay run. The confirmation
  is bound to the exact locally verified shadow snapshot.

**No live KoL beach actions are part of the automated tests.** Start with a
read-only relay Review, or a low-count CLI run you explicitly choose, and
check KoLmafia's run log before using the paid route mode at larger counts.

### Relay: run WaterSheep's top 11 with free beach combs only

Open **DonComboMatrix** and scroll to **WaterSheep top 11 · free-only route**.
The visible ranked route includes the chosen coordinate, cooldown age,
observed state, and uncalibrated revisit signal. Choose
**Review top 11 and run free Combo**, then use the explicit confirmation on
the next page.

- KoLmafia's `_freeBeachWalksUsed` provides the daily budget: at most
  `11 - _freeBeachWalksUsed` combs can be executed. The guard is checked
  before **each** action and verified after the action. It never pays for
  additional combs.
- The saved scoring snapshot must be from the same player and in-game day,
  no older than 20 minutes, and have ready WaterSheep scores. The list
  must resolve to distinct, tide-accessible non-false known rare coordinates.
  If any check fails, refresh the matrix and review again.
- The confirmation token is single-use. The model cannot supply arbitrary
  tile coordinates, rerank during a run or cause fallback paid actions.
- The normal `combo N` shuffle/cursor path is unchanged. The special
  `combo shadow11` argument uses a frozen route and does **not** advance
  `combo_lastTileCombed`. A clean cooperative interrupt is still supported.
  If a target is already combed, Combo's existing in-front twinkle/rough
  fallback logic still applies. Execution can finish with fewer than 11
  actual rare harvests; this is an experimental route, not a guarantee.
- Results and observed loot feed the same existing run-control/ML history.

No live KoL actions were performed while developing this feature. The repo's
CI checks cover the TypeScript build, relay JavaScript syntax/DOM binding,
and offline cooldown/route invariants. Validate in your own KoLmafia environment
before using the relay's mutating action.

<!-- prettier-ignore-end -->

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
