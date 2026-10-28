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

## Optional live rare-tile sharing via Kmail

**OFF by default.** DonCombo does not send beach observations to any player
unless that character explicitly enables this KoLmafia preference in gCLI:

```text
set don_combo_share_data=true
```

To disable it immediately for subsequent sends (and future runs):

```text
set don_combo_share_data=false
```

When a combing run starts with the preference exactly `true`, DonCombo prints
this **red warning before any WaterSheep pre-scoring or beach action**:

> 'don_combo_share_data=true' Your current beach findings are set to share.
> If this is a mistake, hit Interrupt Comb in the relay for a safe stop, or Esc
> for a hard stop. In gCLI enter 'set don_combo_share_data=false' to turn off.

The command then waits **five seconds**. The relay interrupt can cancel before
any combs; a cooperative interruption later in the run suppresses the queued
sharing. Turning the preference off before dispatch also prevents transmission.
Read-only `lifetime` and `watersheep-preview` commands do not send anything.
A previously OFF run cannot enable sharing midway without a new invocation.

**What qualifies as a live finding:** a just-executed beach comb at a currently
visible non-combed tile, whose own item delta contains a positively identified
scarce-tile reward (piece of driftwood, cursed pirate gear, meteorite fragment
or rainbow pearl), or whose native command output contains the exact
message-in-a-bottle encounter. Seeing a twinkle alone, visiting a preloaded
known-rare coordinate, finding an infrequent/common item, a whale, an existing
castle, or an historical result **does not** count as a shareable confirmed
scarce-tile finding. Bottles remain pool-unassigned in the ML Lab; this share
format does not claim a pool or a measured cooldown.

After a **clean, uninterrupted** run, outside combat/choice, DonCombo batches
only these freshly observed coordinates to KoL
[stICKYrICKY (#3773192)](https://www.kingdomofloathing.com/showplayer.php?who=3773192)
using normal `Kmail.send`. The Kmail body is a restricted CSV-like envelope,
for example:

```text
don_combo_live_rare_v1
timestamp_utc,minute,row,column
2026-10-28T09:30:06.000Z,6463,4,4
```

These are UTC *observation* timestamps and KoLmafia's zero-indexed columns.
Duplicate coordinates within one run are sent once. The body contains **no
player name or player ID, run ID, account state, items, meat, session log, or
full beach layout**. There is no historical scan, persistent outbound queue,
retry on a later run, or automatic upload to GitHub. Failed or interrupted
sends are dropped and reported without interrupting the beach-run results.

**Kmail itself is not anonymous.** KoL exposes the **sender's account** to the
recipient in Kmail metadata, even though DonCombo never puts it in the body.
A specific timestamp and coordinate can also sometimes be correlated with
other activity. The intended later public data export must strip all Kmail
headers and sender metadata before creating the public coordinate dataset;
that pipeline has **not** been built or audited here.

**Removal requests:** Players who want a sent submission removed should Kmail
[DOncAnNOli (#1079721)](https://www.kingdomofloathing.com/showplayer.php?who=1079721)
**within the approximately two-week vanilla Kmail retention window**, while
the incoming message can still be attributed to its sender. After the Kmail
has been removed and no player identity is retained in the coordinate dataset,
it may be impossible to determine which observations belonged to that player.
Disabling the preference prevents future sends; it cannot retract already
delivered Kmail or guarantee removal from a future public export. No
long-term sender mapping is created by this script.

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

**Refresh is now a native evidence regeneration, not a browser reload.** The
**Refresh data** button invokes the read-only `relay_DonComboRefresh.ash`
endpoint, which synchronously runs the established listener's matrix refresh,
including KoLmafia observation / ML-trace readback and a new WaterSheep score
comparison. After the runtime commits its files, the browser requests the
fresh relay JSON/JS with caching disabled and checks its generation, player,
game day, ML event total, and last-run status against the native acknowledgement.

**Each Export HTML snapshot** performs that same verified refresh first; it
does not simply export a previously loaded JS object. If Combo is still
running, runtime generation fails, or the readback is stale or inconsistent,
the export **stops with a visible error** instead of creating a misleading
newly-dated HTML file. A verified export carries
`don-combo-refresh-verified=true` and the matched runtime generation in its
HTML metadata. The full model comparison can take longer when many
WaterSheep candidates are scored. This path never spends beach combs and
never authorizes model-selected KoL actions.

The October 28, 2026 discrepancy motivating this safeguard was a frozen HTML
export created after a 12-comb interrupted run, but still containing a
runtime generated before that run (`ml_lab.events_total=3117` instead
of `3129`). The regression suite explicitly rejects that mismatch.

### Future-agent reference: historical KoLmafia session logs

For **future research only** (no active import or runtime changes), see
[KoLmafia session-log recall and run boundary notes](docs/agent-notes/kolmafia-session-log-recall.md).
The note records the `/sessions/<player_name>_<YYYYMMDD>` convention, `don_combo_running`
start/end markers, `combo N` line-window heuristic, sample beach/event/footer
format, and safeguards for a potential read-only Python historical parser.

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

### Scratch-density observations (live, shadow and historical)

Every visited beach front contributes a **pre-action scratch-density observation**:
the number of visible already-combed squares (the `c` glyph in KoLmafia's
`_beachLayout`) across its currently visible rows. Hidden rows are excluded
rather than treated as scratch-free. We call 6–10 scratches **high interest**;
11 or more **very interesting**. This is a heuristic about a visited front's
history, **not proof of a rare tile, rare respawn, or predictive probability**.

The live path records the layout once per comb into
`data/don_combo_scratch_observations.json` (alongside the existing
`data/don_combo_ml_events.jsonl`). A read-only historical pass also derives
scratch density from **the full already-recorded ML event log**, including
legacy unbound events, without requiring a new beach visit or inventing
timestamps. Run-bound events from other players are excluded from this
player-specific scratch history; old unbound observations retain their
uncertain provenance.

A day is one UTC calendar date because legacy events generally have UTC
timestamps but no reliable KoL game-day ID. The tracker stores the maximum
observed pre-action scratch count **once per front per UTC day**: repeated
observations within a day can improve its maximum but **cannot compound**
interest merely by refreshing or re-running the same beachfront. Independent
high-scratch days increase a bounded `interest_score` (0–1); 11+ days are
weighted more strongly. Scores also feed a small bounded policy exploration
bonus (maximum +0.06 utility) and raise consideration of observed high-scratch
fronts during candidate discovery. WaterSheep receives the explicit
`scratch_interest` evidence input, with `interest_kind` identifying it as
an uncalibrated **exploration heuristic, not a rare probability**.

This applies to both ordinary `combo N` and
`combo watersheep-N` / `combo watersheep-free`: all actual completed
comb observations are recorded; routed runs continue to get automatic
pre-action WaterSheep predictions. The **ML Lab → Scratch-density watch**
shows high/very-interesting and repeat-day front counts, followed by the
highest-interest fronts. Daily shadow-learning cohorts separately count
their 6+ and 11+ observed scratches. Neither mode changes paid-action gates,
frozen routes, or model authority.

### Sand castles: layout sightings, selection and verified demolition (2026-10-28)

Sand castles are **uppercase `C`** in KoLmafia's pre-action `_beachLayout`;
lowercase `c` is already-combed sand. KoLmafia may show multiple castles
within a beach minute. The native event log records every visible
`(minute,row,column)` sighting, even if no castle is chosen. Tide-hidden rows
are never inferred. The ML Lab reports total sightings **and distinct
coordinates/minutes**, since repeat sightings are not new castles.

Native `combo` and the explicit WaterSheep routes share the same action
selector. They still prioritize an actual whale and then an available planned
rare target. When that rare tile is already combed, they now select the first
visible castle before falling back to twinkles or rough/combed sand. If the
planned target itself is `C`, its attempt is labeled `sand_castle_target`
rather than an ordinary rare harvest. The alternative is labeled
`sand_castle_fallback`. No extra beach action is performed.

For each selected castle, the log keeps the exact coordinate, pre-action
layout, raw ordinary item/meat deltas, and an independent `sand_castle_action`
special event. Native demolition response text is distinguished from a
command that returned without confirmatory text: neither is silently
promoted into a verified rare reward. Castle sightings and actions do **not**
enter the six reward-tier samples, rare-reward cooldown or proven-respawn
calculations. Demolishing a castle gives only ordinary frequent-tile loot
and grains of sand when successful, not a special castle inventory item;
the run footer cannot establish the castle's existence.

The beach's castle distribution and sandcastle-minute Morse puzzle are
research priors. For interpreting the puzzle, use distinct **beach minutes**
rather than treating repeated sightings or multiple tiles at one minute as
multiple Morse letters. The known 512-castle population is not taken as
complete local observational coverage; no coordinates or cooldown times
are invented.

### Message in a bottle: pool-unassigned beach encounter (2026-10-28)

The user-provided 2023 Ascension Speed Society beach spading discussion,
cross-checked against Veracity's KoLmafia BeachComber notes (Apr 27–30 2025),
reveals one **critical non-inventory rare**: a beach-combed `message in a
bottle` does NOT produce a normal positive acquired-item delta. Since
KoLmafia r28508 the session log emits a standalone
`You found a message in a bottle!` message. This is **not** an Ocean
City `cryptic message in a bottle` or `mysterious message in a bottle`
inventory item.

Every actual native comb path (whale, intended rare, incidental twinkle,
rough fallback, exhausted fallback) now captures its own
`cliExecuteOutput("beach comb ...")` and passes it once into the
same `recordBeachObservation` JSONL path as the usual item deltas.
The event records `special_events` with the exact recognized success
message and `action_output_capture` status, alongside actual tile
minute/row/column, UTC capture time, prior layout, pre-action prediction,
item deltas, and run identity. **No fake item acquisition is produced.**
This includes ordinary `combo N`, `combo watersheep-free`,
`combo watersheep-N`, and `shadow11`.

**Pool remains UNASSIGNED.** One bottle produces one event, not one
Pool 1 reward plus one Pool 2 reward. The per-target input includes a
symmetric **weak context coefficient of 0.10 for each pool** (heuristic
feature, _not_ a posterior pool probability or fitted rarity). The
fixed policy exploration bonus is capped at **+0.004** for a coordinate
with at least one bottle observation, independently of how many bottles
were seen. The known Pool 1/2 tier counts, tier intervals and assumed
cooldowns are **not** populated by bottles. ML Lab shows the separate
unknown-pool count, actual coordinates, source and route mode.

**Historical limitation:** the native reader can recover bottles from
existing `don_combo_ml_events.jsonl` only if a prior record contains a
structured `special_events` observation. Older log lines were not
retrospectively imported: Veracity reports that some historical bottle
messages were not in the standard session-log position. Never interpret
missing pre-2025 bottle records as negative evidence or assert the old
catalogue implies dated bottle observations.

The August 3, 2023 discussion separately proposes common tile resets
of 2, 3 or 4 hours, rare tile cooldowns of roughly 15 days or more, and
rarer categories perhaps taking longer. These are **community spading
claims**, not hardcoded clocks, tier probabilities, or authorization for
extra observations/actions. Same-tile and cross-coordinate timing
hypotheses remain explicitly unvalidated. In particular, repeated
per-day **scratch** observations do not establish exact rare-tile
respawn times.

References:

- https://kolmafia.us/threads/beachcomber-fast-and-efficient-beach-combing.23993/page-8
- https://kolmafia.us/threads/r28508-whats-changed-log-message-when-beach-comb-a-message-in-a-bottle-by-veracity0-in-2897-full-changelog-r28507-r28508.30555/
- User-supplied 2023 Discord export, The Ascension Speed Society `#kol-🗡🍸` (observation-only external source; not a database of individual game events).

### Two-pool rare observer and dated historical baseline (experimental)

Normal `combo N`, `combo watersheep-free` and `combo watersheep-N`
already share the native per-comb observation path. The dual-pool observer
now annotates **each** resulting `data/don_combo_ml_events.jsonl` record
with `pool_observations` while preserving the original pre-action layout,
actual comb coordinate, item deltas, UTC timestamp, pre-action model trace,
and route/run ID. Daily shadow cohorts tally these pool observations as well.

The **user-proposed** three-tier, two-pool working hypothesis is:

| Proposed tier | Pool 1        | Pool 2                                                         |
| ------------- | ------------- | -------------------------------------------------------------- |
| common/rare   | Sand castle   | Piece of driftwood                                             |
| uncommon/rare | Beached whale | Cursed tricorn hat, cursed swash buckle, cursed pirate cutlass |
| rare/rare     | Rainbow pearl | Meteorite fragment                                             |

Sand castle (`C`) and beached whale (`W`) symbols are **layout
sightings**. A whale comb is also recorded as an action if the actual
coordinate was a visible `W`; repeated whale sightings are not counted as
multiple whale harvests. Named items must have **positive inventory deltas**.
Driftwood hats, driftwood pants, ordinary sand, and other unrelated beach
loot are not promoted to rare-pool findings. Exact item spelling is used
to avoid reclassifying non-pool equipment. Any unclassified item deltas
remain available for manual follow-up.

The observer rebuilds a read-only **historical rare baseline curve** from
the **entire local recorded ML event log** and `raretiles.json`,
including old unbound events and newer run-bound free/paid WaterSheep
observations. Every known coordinate remains in the catalogue, but
undated catalogue entries **are not fake zeros or dated attempts**.
A historical event enters the empirical curve only when its **planned
and actual exact coordinate match**, the coordinate exists in the known
rare catalogue, and its result was `rare_target`.

The baseline groups the **elapsed time between recorded attempts at
the same rare coordinate** into 0–1, 1–3, 3–7, 7–14, and 14+ day bins.
Each bin separately counts later-observed Pool 1/Pool 2 rewards and the
three proposed tiers. Intervals between successive positive reward
observations at the same exact coordinate are retained as
**censored reward-to-reward intervals**, including an intervening
combed-state observation if present. Neither measurement is a verified
respawn timer: other players may have combed between our visits, and
no known coordinate comes with a true spawn timestamp.

The WaterSheep shadow and routed **pre-action** requests now include
`pool_cooldown`, `pool_front_observations`, and
`historical_rare_curve` evidence alongside the pre-existing tile
recovery, historical rare history and scratch density. The model may
consider those data but **cannot spend turns, change a frozen route,
fit a cooldown probability, or retrain itself**. ML Lab shows the
historical bins, both pool totals, observation certainty and the most
recent pool-labelled events.

**Research question (not a game fact):** does a longer latent cooldown
lead to a higher chance of an uncommon/rare or rare/rare tier? A
positive correlation between the observed attempt-gap bins and
reward tiers would still need bias checks for tide accessibility,
visit schedule and unknown interventions before supporting that theory.
No respawn law has been assumed and no automatic tier-based targeting
has been enabled.

### Historical rare baseline (read-only; all existing local records)

WaterSheep now receives a **per-coordinate historical evidence summary** for
every ranked candidate and every pre-action prediction, including
`combo watersheep-N`. The compiler scans **all** locally recorded
`data/don_combo_ml_events.jsonl` entries, not merely the last 500 entries
shown in the UI, and cross-indexes them against `data/raretiles.json`.
False-rare coordinates are excluded. It does **not** mutate these original
files or overwrite the existing native recovery ledger.

Three evidence grades remain separate:

- **Historical rare-coordinate catalogue**: known locations in
  `raretiles.json`; these records often lack discovery/harvest dates and are
  **not retroactively dated events**.
- **Legacy / unbound recorded observations**: past ML-event rows, with real
  timestamps, planned and actual coordinates, pre-action layout, and outcome.
  They keep `legacy-unbound` provenance; no run IDs or old predictions are
  invented.
- **Run-bound observations**: modern ordinary Combo and WaterSheep-routed
  free/paid actions. Each records the actual result and optional or automatic
  pre-action prediction, attached to an exact run ID, game day, and route mode.

For each recorded rare coordinate the read-only baseline exposes observation
counts, old versus run-bound evidence, previously-combed and visible-twinkle
observations _at that coordinate_, rare-target attempt counts, dated first/last
observation, and elapsed time between distinct rare-target attempts where
observed. The WaterSheep **model input** includes that summary. It does not
expose the full rare-coordinate catalogue, Combo's route order or baseline
membership; per-target historical evidence is now an intentional input.

**This is baseline evidence for a future cooldown curve, not fitted model
weights.** A rare-target action with driftwood is an observed target attempt,
not proof of a rare-item harvest. An interval between target attempts is not
a verified respawn interval. No missing dates are fabricated; no unobserved
negative samples, probabilities, or training labels are synthesized.
The ML Lab shows catalogue coverage and historical/run-bound counts separately.

Run `combo watersheep-20` to execute a human-authorized frozen WaterSheep
route of 20 attempts (free first, then adventures if required). This mode already
automatically records each attempt with its pre-action WaterSheep trace and
outcome, as well as a daily learning cohort; `don_combo_ml_trace=true` is
**not necessary** for WaterSheep-routed runs. A failed model inference is
recorded as an error and cannot authorize a different route.

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

**gCLI progress while pre-scoring:** `combo watersheep-50` immediately
prints a "please wait" estimate based on `50 × 2 seconds = 100 seconds`,
rounded to the **nearest 30-second interval** (`~1 min 30 sec`).
As WaterSheep actually completes candidate scores, the CLI updates
`completed / total` approximately every 10 scored candidates or whenever
the rounded remaining estimate changes. The candidate pool may include an
additional blinded baseline candidate, so `total` can differ slightly from
the number of comb attempts requested. Tiny positive remainders display
`under 30 sec` rather than `0 sec`. These are **work-based estimates**,
not a background timer or a guarantee that the HTTP model will respond
in two seconds. The "complete" message is emitted only after the fully
scored snapshot is validated and written. Errors still stop the routed
run before any beach action.

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
