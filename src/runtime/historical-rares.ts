// Read-only historical baseline assembled from the full *local* event log and
// raretiles.json. This does not change the game, model weights, or source files.
// The historic corpus is a location catalogue, NOT a dated harvest record.
import type { RarePoint } from "./contracts";
import type { MlTraceEvent } from "./observations";

export interface HistoricalRareTileEvidence {
  recorded_in_rare_catalogue: boolean;
  prior_target_observations: number;
  legacy_unbound_observations: number;
  run_bound_observations: number;
  rare_target_attempts: number;
  confirmed_combed_preactions: number;
  visible_twinkles_at_target: number;
  first_target_observed_at: string | null;
  last_target_observed_at: string | null;
  last_rare_attempt_at: string | null;
  days_since_last_rare_attempt: number | null;
  elapsed_days_between_target_attempts: number[];
  verified_rare_harvests: null;
  observed_respawn_intervals: null;
  provenance: "historical-coordinate-catalogue-and-ml-events";
}

export interface HistoricalRareBaseline {
  schema: "don-combo-historical-rare-baseline/v0.1";
  catalogue_coordinates: number;
  catalogue_false_rare_excluded: number;
  events_scanned: number;
  distinct_events_considered: number;
  historical_observations_matched: number;
  legacy_unbound_observations: number;
  run_bound_observations: number;
  rare_target_attempts: number;
  coordinates_with_observations: number;
  coordinates_with_rare_attempts: number;
  verified_rare_harvests: null;
  completed_respawn_intervals: null;
  note: string;
}
export interface HistoricalRareIndex {
  baseline: HistoricalRareBaseline;
  byTile: Record<string, HistoricalRareTileEvidence>;
}

const key = (minute: number, row: number, column: number): string =>
  `${minute},${row},${column}`;
const empty = (): HistoricalRareTileEvidence => ({
  recorded_in_rare_catalogue: true,
  prior_target_observations: 0,
  legacy_unbound_observations: 0,
  run_bound_observations: 0,
  rare_target_attempts: 0,
  confirmed_combed_preactions: 0,
  visible_twinkles_at_target: 0,
  first_target_observed_at: null,
  last_target_observed_at: null,
  last_rare_attempt_at: null,
  days_since_last_rare_attempt: null,
  elapsed_days_between_target_attempts: [],
  verified_rare_harvests: null,
  observed_respawn_intervals: null,
  provenance: "historical-coordinate-catalogue-and-ml-events",
});
function symbolAt(layout: string, row: number, column: number): string | null {
  for (const part of String(layout || "").split(",")) {
    const colon = part.indexOf(":");
    if (colon < 0 || Number(part.slice(0, colon)) !== row) continue;
    return part.slice(colon + 1).charAt(column) || null;
  }
  return null;
}
function validEpoch(value: string): number | null {
  const n = Date.parse(value);
  return Number.isFinite(n) ? n : null;
}

export function buildHistoricalRareIndex(
  points: ReadonlyArray<Pick<RarePoint, "minute" | "row" | "column" | "false_rare">>,
  events: ReadonlyArray<MlTraceEvent>,
  nowMs: number,
): HistoricalRareIndex {
  const byTile: Record<string, HistoricalRareTileEvidence> = {};
  let excluded = 0;
  for (const point of points) {
    if (point.false_rare) {
      excluded++;
      continue;
    }
    const coord = key(point.minute, point.row, point.column);
    byTile[coord] ??= empty();
  }
  const seenIds = new Set<string>();
  const hits: Record<string, number[]> = {};
  let considered = 0;
  let matched = 0;
  let legacy = 0;
  let bound = 0;
  let attempts = 0;
  for (const event of events) {
    if (event.event_id && seenIds.has(event.event_id)) continue;
    if (event.event_id) seenIds.add(event.event_id);
    considered++;
    const planned = event.planned_target;
    if (!planned || planned.minute !== event.minute) continue;
    const coord = key(planned.minute, planned.row, planned.column);
    const evidence = byTile[coord];
    if (!evidence) continue;
    const when = validEpoch(event.observed_at);
    // Ignore future events and bad timestamps, never manufacture a date.
    if (when !== null && when > nowMs) continue;
    matched++;
    evidence.prior_target_observations++;
    const isBound = !!event.run_context?.run_id;
    if (isBound) {
      bound++;
      evidence.run_bound_observations++;
    } else {
      legacy++;
      evidence.legacy_unbound_observations++;
    }
    if (when !== null) {
      const stamp = new Date(when).toISOString();
      if (!evidence.first_target_observed_at || stamp < evidence.first_target_observed_at)
        evidence.first_target_observed_at = stamp;
      if (!evidence.last_target_observed_at || stamp > evidence.last_target_observed_at)
        evidence.last_target_observed_at = stamp;
    }
    const symbol = symbolAt(event.layout, planned.row, planned.column);
    if (symbol === "c") evidence.confirmed_combed_preactions++;
    if (symbol === "t") evidence.visible_twinkles_at_target++;
    const actual = event.actual_comb;
    if (
      event.outcome === "rare_target" &&
      actual?.minute === planned.minute &&
      actual.row === planned.row &&
      actual.column === planned.column
    ) {
      attempts++;
      evidence.rare_target_attempts++;
      if (when !== null) {
        (hits[coord] ??= []).push(when);
        const stamp = new Date(when).toISOString();
        if (!evidence.last_rare_attempt_at || stamp > evidence.last_rare_attempt_at)
          evidence.last_rare_attempt_at = stamp;
      }
    }
  }
  for (const [coord, entry] of Object.entries(byTile)) {
    const timestamps = [...new Set(hits[coord] || [])].sort((a, b) => a - b);
    for (let i = 1; i < timestamps.length; i++)
      entry.elapsed_days_between_target_attempts.push(
        Math.round(((timestamps[i] - timestamps[i - 1]) / 86400000) * 1000) / 1000,
      );
    entry.days_since_last_rare_attempt = entry.last_rare_attempt_at
      ? Math.max(
          0,
          Math.round(
            ((nowMs - Date.parse(entry.last_rare_attempt_at)) / 86400000) * 1000,
          ) / 1000,
        )
      : null;
  }
  const entries = Object.values(byTile);
  return {
    baseline: {
      schema: "don-combo-historical-rare-baseline/v0.1",
      catalogue_coordinates: entries.length,
      catalogue_false_rare_excluded: excluded,
      events_scanned: events.length,
      distinct_events_considered: considered,
      historical_observations_matched: matched,
      legacy_unbound_observations: legacy,
      run_bound_observations: bound,
      rare_target_attempts: attempts,
      coordinates_with_observations: entries.filter((x) => x.prior_target_observations > 0).length,
      coordinates_with_rare_attempts: entries.filter((x) => x.rare_target_attempts > 0).length,
      verified_rare_harvests: null,
      completed_respawn_intervals: null,
      note:
        "All locally recorded ML events are scanned. Historical catalogue locations have no dates. Rare-target actions are not confirmed rare-item harvests; repeated attempts are not verified respawn intervals. No synthetic training samples or cooldown probabilities.",
    },
    byTile,
  };
}

export function historicalRareForTile(
  index: HistoricalRareIndex,
  minute: number,
  row: number,
  column: number,
): HistoricalRareTileEvidence | null {
  return index.byTile[key(minute, row, column)] || null;
}
