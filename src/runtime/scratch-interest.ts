// Scratch density is a count of PRE-ACTION "c" (already-combed) beach
// squares in the visible KoLmafia _beachLayout, not a discovered rare drop.
// Day buckets use UTC calendar dates, consistently for old and new events,
// to avoid inventing KoL game-day identity for legacy unbound observations.
export const SCRATCH_LEDGER_SCHEMA = "don-combo-scratch-observations/v0.1" as const;
export const SCRATCH_HIGH_THRESHOLD = 6;
export const SCRATCH_VERY_INTERESTING_THRESHOLD = 11;

export interface ScratchDay {
  max_scratches: number;
  visible_cells_at_max: number;
  last_observed_at: string;
  provenance: "live" | "historical" | "both";
}
export interface ScratchFront {
  days: Record<string, ScratchDay>;
}
export interface ScratchLedger {
  schema: typeof SCRATCH_LEDGER_SCHEMA;
  player_id: number;
  fronts: Record<string, ScratchFront>;
  updated_at: string | null;
}
export interface ScratchEvidence {
  schema: "don-combo-scratch-interest/v0.1";
  unit: "visible-pre-action-combed-squares";
  day_basis: "UTC-calendar-date";
  front_minute: number;
  observed_days: number;
  high_scratch_days: number;
  very_interesting_days: number;
  repeat_high_days: number;
  max_scratch_count: number;
  last_high_day: string | null;
  interest_score: number;
  interest_kind: "BOUNDED_EXPLORATION_HEURISTIC_NOT_RARE_PROBABILITY";
  evidence_source: "historical-and-live-layout-observations";
}
export interface ScratchSummary {
  schema: "don-combo-scratch-summary/v0.1";
  fronts_observed: number;
  fronts_high: number;
  fronts_very_interesting: number;
  fronts_repeated_high: number;
  recorded_utc_days: number;
  imported_historical_events: number;
  note: string;
}
export interface ScratchEvent {
  event_id?: string;
  minute: number;
  layout: string;
  observed_at: string;
  run_context?: { player_id?: number } | null;
}

export function emptyScratchLedger(player: number): ScratchLedger {
  return { schema: SCRATCH_LEDGER_SCHEMA, player_id: player, fronts: {}, updated_at: null };
}

// Strictly parse the rows we were able to see. Hidden tidal rows are absent
// and never assumed to be zero scratches. Invalid/duplicate rows are rejected.
export function scratchCount(layout: string): { scratches: number; visible: number } | null {
  const rows = new Set<number>();
  let scratches = 0;
  let visible = 0;
  for (const part of String(layout || "").split(",")) {
    const match = /^(\d+):([A-Za-z?]{10})$/.exec(part.trim());
    if (!match) return null;
    const row = Number(match[1]);
    if (row < 1 || row > 10 || rows.has(row)) return null;
    rows.add(row);
    visible += 10;
    scratches += (match[2].match(/[cC]/g) || []).length;
  }
  return rows.size > 0 ? { scratches, visible } : null;
}

function normalizeTime(value: string): string | null {
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}

export function addScratchVisit(
  ledger: ScratchLedger,
  minute: number,
  layout: string,
  observedAt: string,
  provenance: "live" | "historical",
): boolean {
  const observation = scratchCount(layout);
  const timestamp = normalizeTime(observedAt);
  if (!Number.isInteger(minute) || minute < 1 || minute > 10000 || !observation || !timestamp)
    return false;
  const day = timestamp.slice(0, 10);
  const front = (ledger.fronts[String(minute)] ??= { days: {} });
  const existing = front.days[day];
  const source = existing
    ? existing.provenance === provenance
      ? provenance
      : "both"
    : provenance;
  front.days[day] = {
    max_scratches: Math.max(existing?.max_scratches ?? 0, observation.scratches),
    visible_cells_at_max:
      !existing || observation.scratches >= existing.max_scratches
        ? observation.visible
        : existing.visible_cells_at_max,
    last_observed_at:
      !existing || timestamp > existing.last_observed_at
        ? timestamp
        : existing.last_observed_at,
    provenance: source,
  };
  if (!ledger.updated_at || timestamp > ledger.updated_at) ledger.updated_at = timestamp;
  return true;
}

export function evidenceForScratchFront(ledger: ScratchLedger, minute: number): ScratchEvidence {
  const days = ledger.fronts[String(minute)]?.days || {};
  const dates = Object.keys(days).sort();
  const high = dates.filter((day) => days[day].max_scratches >= SCRATCH_HIGH_THRESHOLD);
  const very = dates.filter(
    (day) => days[day].max_scratches >= SCRATCH_VERY_INTERESTING_THRESHOLD,
  );
  const max = dates.reduce((v, day) => Math.max(v, days[day].max_scratches), 0);
  // A single observation matters; repeated distinct-day evidence compounds
  // interest but can never become an unbounded positive-feedback loop.
  const base = max >= 11 ? 0.7 : max >= 6 ? 0.35 : 0;
  const repeatBonus = Math.min(0.2, Math.max(0, high.length - 1) * 0.08);
  const veryRepeatBonus = Math.min(0.1, Math.max(0, very.length - 1) * 0.05);
  const interest = Math.min(1, Math.round((base + repeatBonus + veryRepeatBonus) * 1000) / 1000);
  return {
    schema: "don-combo-scratch-interest/v0.1",
    unit: "visible-pre-action-combed-squares",
    day_basis: "UTC-calendar-date",
    front_minute: minute,
    observed_days: dates.length,
    high_scratch_days: high.length,
    very_interesting_days: very.length,
    repeat_high_days: Math.max(0, high.length - 1),
    max_scratch_count: max,
    last_high_day: high[high.length - 1] || null,
    interest_score: interest,
    interest_kind: "BOUNDED_EXPLORATION_HEURISTIC_NOT_RARE_PROBABILITY",
    evidence_source: "historical-and-live-layout-observations",
  };
}

// Merge the persistent live ledger and the FULL ML-event history. Daily maxima
// ensure a visited beach cannot earn extra interest simply by being revisited
// repeatedly during one day. IDs are de-duplicated where available.
export function backfillScratchHistory(
  persisted: ScratchLedger,
  events: ReadonlyArray<ScratchEvent>,
  nowMs: number,
): { ledger: ScratchLedger; imported: number } {
  const ledger: ScratchLedger = {
    schema: SCRATCH_LEDGER_SCHEMA,
    player_id: persisted.player_id,
    updated_at: persisted.updated_at,
    fronts: JSON.parse(JSON.stringify(persisted.fronts || {})) as Record<string, ScratchFront>,
  };
  const seen = new Set<string>();
  let imported = 0;
  for (const event of events) {
    if (event.run_context?.player_id !== null &&
        event.run_context.player_id !== persisted.player_id) continue;
    if (event.event_id && seen.has(event.event_id)) continue;
    if (event.event_id) seen.add(event.event_id);
    const date = Date.parse(event.observed_at);
    if (!Number.isFinite(date) || date > nowMs) continue;
    if (addScratchVisit(ledger, event.minute, event.layout, event.observed_at, "historical"))
      imported++;
  }
  return { ledger, imported };
}

export function summarizeScratchLedger(
  ledger: ScratchLedger,
  importedHistoricalEvents: number,
): ScratchSummary {
  const minutes = Object.keys(ledger.fronts);
  const fronts = minutes.map((minute) => evidenceForScratchFront(ledger, Number(minute)));
  const days = new Set<string>();
  for (const front of Object.values(ledger.fronts))
    for (const day of Object.keys(front.days)) days.add(day);
  return {
    schema: "don-combo-scratch-summary/v0.1",
    fronts_observed: fronts.length,
    fronts_high: fronts.filter((x) => x.high_scratch_days > 0).length,
    fronts_very_interesting: fronts.filter((x) => x.very_interesting_days > 0).length,
    fronts_repeated_high: fronts.filter((x) => x.high_scratch_days > 1).length,
    recorded_utc_days: days.size,
    imported_historical_events: importedHistoricalEvents,
    note: "Scratch count = pre-action c/combed squares in visible rows. >5 high, >=11 very interesting. Per-UTC-day maxima and bounded repeat-day interest; not a rare or respawn probability.",
  };
}
