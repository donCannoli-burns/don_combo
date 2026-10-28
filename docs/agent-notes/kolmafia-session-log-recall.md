# Future-agent note: KoLmafia session-log recall for Combo evidence

**Status:** documentation / future implementation idea only. **No runtime behavior, routing,
readback, import, recovery-ledger schema, scoring, permissions, or live KoL actions are
changed by this note.**

**Recorded:** 2026-10-28, from owner-supplied KoLmafia session output.

## Purpose

The regular KoLmafia session documents are an additional historical source for
recovering Combo run boundaries, beachfront layouts, selected coordinates, comb
outputs, inventory deltas, preferences, and final run receipts. This can be valuable
when `don_combo_ml_events.jsonl` did not yet exist, a special result (e.g. a
non-inventory message in a bottle) was not recognized in a prior version, or a
derived ledger needs a read-only audit. Do **not** assume that old session logs
contain every non-inventory event, or that they supersede a verified native receipt.

## Session document lookup

Owner-described path convention:

```text
/sessions/<player_name>_<YYYYMMDD>
/sessions/doncannoli_20261028
```

The second path is the example for the **2026-10-28 live session**. For historical
recall, select the appropriate player/date document and search within it; a future
read-only Python parser may be preferable for bulk historical queries.

**Search heuristic (not a contract):** if an ordinary `combo 1` block typically
occupies `x` lines, inspecting approximately the last `y * x` lines after
`combo y` or `combo p(y)` may provide a cheap first pass over the current
session. This is **only an initial window estimate**: beaches have different
numbers of visible rows and outputs, whales and fallbacks take different branches,
commands can abort, and unrelated log lines or refreshes can appear. Never
declare an exact run recovered or complete using line count alone. Instead
search backward from the newest authoritative marker, expand the window as
needed, and verify boundaries. Do not assume `combo p(y)` and
`combo watersheep-y` have identical runtime semantics.

## Run delimiters and structure

**Run-opening marker (owner-provided):**

```text
> combo 50
Preference don_combo_running changed from false to true
Preference don_combo_last_run_status changed from interrupted to running
Preference don_combo_last_run_combs changed from 12 to 0
Preference don_combo_last_run_end_reason changed from user_cooperative_interrupt to running
Preference don_combo_last_run_interrupt_consumed changed from true to false
```

Treat the exact `don_combo_running: false -> true` preference transition as
a start candidate, and capture the preceding `> combo 50` CLI invocation
and surrounding preference transitions for context. **Old preference values
will vary** by previous run; do not hardcode the above previous status,
counter, or reason values.

**Per-comb body example (owner-provided):**

```text
[494] Wandering 5469 minutes down the beach
Preference lastEncounter changed from Comb the Beach (5466 minutes down the beach) to Comb the Beach (5469 minutes down the beach)
Encounter: Comb the Beach (5469 minutes down the beach)
Beach at 5469

10: rcrrrrrrrr
9: rrrrrrrrrr
8: rrrrrrrcrr
7: rrrrrrrrrc
6: rrrrrrrcrr
5: rrrrcrrrrc
4: rrrrcrrrrr
3: rcrcrrrrrr
2: rrcrrrrrrr
DON_COMBO_OBSERVATION minute=5469 layout=2:rrcrrrrrrr,3:rcrcrrrrrr,4:rrrrcrrrrr,5:rrrrcrrrrc,6:rrrrrrrcrr,7:rrrrrrrrrc,8:rrrrrrrcrr,9:rrrrrrrrrr,10:rcrrrrrrrr
Our rare tile is combed, but we found some rough sand. So I guess there's that.
Combing square 2,1 (5469 minutes down the beach)
You acquire an item: yellow seashell
You acquire grain of sand (2)
Preference relayCounters changed from 400:Club 'Em Into Next Week Monster loc=* type=wander:watch.gif to 493:Club 'Em Into Next Week Monster loc=* type=wander:watch.gif
Preference _concoctionDatabaseRefreshes changed from 177 to 178
```

The beachfront state is visible **before** the actual `Combing square`
result. Extract `minute`, row, column, `DON_COMBO_OBSERVATION` layout,
the executed square, action response and item deltas **separately**.
Here `2,1` is the actual comb, not a claim that the originally planned
rare target was `2,1`. Do not turn `You acquire` lines into presumed
rare reward or respawn events without explicit classification.

**Run-ending marker and receipt:**

```text
Preference don_combo_running changed from true to false
```

Use that reverse preference transition as an end candidate; pair it
with the most recent unmatched opening marker for the **same session and
player**. The owner-provided footer excerpt shows an adjacent
`=== RESULTS ===` block and subsequent refresh telemetry:

```text
=== RESULTS ===
-Found 0 meat
-Found 135 grain of sand
-Found 4 sea cucumber
...
-Found 1 taco shell
Preference kolGoblinDocsLastRefresh changed from 2026-10-28T02:07:11 to 2026-10-28T03:42:23
Preference kolGoblinDocsLastRefreshReason changed from combo-matrix-manual to combo-finished
kol-goblin-docs: refreshed runtime snapshot (combo-finished).
Preference don_combo_matrix_refresh_generation changed from 2026-10-28T07:07:42.602Z to 2026-10-28T08:43:44.752Z
Preference don_combo_matrix_refresh_events changed from 3129 to 3179
Preference don_combo_matrix_refresh_run_status changed from interrupted to completed
don_combo TS runtime: ready | pool 17 | baseline rank 4 | shadow top 2506
```

The displayed footer excerpt **does not itself contain** the reverse
`don_combo_running` transition. Do not invent its position or equate a
refresh receipt with successful run completion. Search for the reverse
transition; when missing (truncated output, crash, interrupted session,
different script version), mark the run **OPEN_OR_INCOMPLETE** rather than
silently treating the results block as an authoritative closure.

## Future read-only parser design

1. Discover/read the selected session document, preserving player identity,
   full path, file modification/creation metadata if available, source hash,
   byte/line offsets, and any native timestamps. Some session lines have no
   absolute timestamp: preserve **UNKNOWN** instead of assigning the file
   date as the exact action time.
2. Use an explicit finite-state parser:
   `outside_run -> running -> ended`, with an `incomplete` state for
   orphaned starts/ends or truncation. Match run header/footer transitions,
   tolerate changing preference values, and record intervening CLI invocations
   and refreshes. Include file offsets so each assertion can be independently
   rechecked.
3. Group `[turn] Wandering ...`, `Beach at ...`, grid rows,
   `DON_COMBO_OBSERVATION minute=... layout=...`,
   `Combing square <row>,<column> (<minute> ...)`, exact message text,
   `You acquire ...`, and result receipts **in temporal order**. Distinguish
   intended target from actual comb, observation from action, and
   `command-output seen` from `reward verified`.
4. Reconcile those groups to native `don_combo_ml_events.jsonl` by run ID
   where possible; otherwise use **candidate matching** (same player,
   minute, actual row/column, sequence, timestamp window, and inventory
   deltas) with explicit confidence and ambiguity. Avoid double counting
   repeated logs and archived/copy duplicates; preserve original records
   rather than rewriting them.
5. Mark missing output/uncertain action confirmations as unobservable, not
   a confirmed negative. Specifically, `You found a message in a bottle!`
   may be a **non-inventory** result; log position varies across KoLmafia
   revisions. Replay such lines as separately sourced **pool-unknown**
   observations only if they can be bound to a specific comb, never
   fabricate a bottle item or force either rarity pool.
6. Only after independent offline tests, explicit source-provenance checks,
   and owner approval should a future agent propose an **optional**
   session-history importer or model feature. Prefer a read-only Python
   historical indexing/search tool for bulk file processing and bounded
   on-demand lookups for the active session. Do not cause additional beach
   combs, advance an account, spend turns, alter old logs, or grant the
   model new execution authority.

### Evidence and privacy safeguards

Session documents are **player-local records**. The path convention and
sample log are examples, not proof that a corresponding file can be read
in an agent's environment. If unavailable, report that clearly instead
of manufacturing data. Historical datasets may contain credentials,
session-specific URLs, hashes, account identifiers and chat or other
player data; minimize access, redact sensitive fields in exported
diagnostics, and don't automatically upload the full session to public
GitHub. Keep raw session text and inferred observations in distinct
trust zones. For rare-tile cooldown research, a visit gap or a same-tile
reward gap is **not** an experimentally verified respawn timer.

## Future acceptance tests

- Two `combo` invocations in one document are separated cleanly even
  if log/refresh lines occur between them.
- An unfinished run is flagged; a footer-only trace is not assigned to
  an arbitrary preceding run.
- Different `combo 1`, `combo 50` and `combo p50` output lengths
  cannot silently truncate the requested run.
- Row/column order, visible-only layouts, and pre-action vs. post-action
  timing survive replay.
- Item quantities and non-inventory special messages are preserved with
  their original evidence classification.
- Cross-file/day and native-event duplication are detected without
  destroying the original source.

**This note is a discovery and data-architecture breadcrumb for future
agents, not an instruction to activate a session scanner.**
