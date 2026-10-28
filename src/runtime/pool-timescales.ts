// Three proposed category timescales, not three pre-fitted peaks.
// This reader is deliberately pure: no KoL calls, no writes, no action authority.
// Separate physical *reward events* from beach-layout sightings and item quantities.
import type {
  PoolIndex,
  PoolKind,
  PoolName,
  RewardTier,
  PoolObservation,
} from "./two-pool-cooldown";

export type TimeBucket =
  | "under_1_day"
  | "1_to_3_days"
  | "3_to_7_days"
  | "7_to_14_days"
  | "14_to_30_days"
  | "30_to_90_days"
  | "90_to_180_days"
  | "180_to_365_days"
  | "365_to_730_days"
  | "730_plus_days";
export const TIME_BUCKETS: ReadonlyArray<{
  key: TimeBucket;
  min_days: number;
  max_days: number | null;
}> = [
  { key: "under_1_day", min_days: 0, max_days: 1 },
  { key: "1_to_3_days", min_days: 1, max_days: 3 },
  { key: "3_to_7_days", min_days: 3, max_days: 7 },
  { key: "7_to_14_days", min_days: 7, max_days: 14 },
  { key: "14_to_30_days", min_days: 14, max_days: 30 },
  { key: "30_to_90_days", min_days: 30, max_days: 90 },
  { key: "90_to_180_days", min_days: 90, max_days: 180 },
  { key: "180_to_365_days", min_days: 180, max_days: 365 },
  { key: "365_to_730_days", min_days: 365, max_days: 730 },
  { key: "730_plus_days", min_days: 730, max_days: null },
];
const findBucket = (days: number): TimeBucket =>
  TIME_BUCKETS.find((b) => days >= b.min_days && (b.max_days === null || days < b.max_days))!.key;
export interface PoolTimingEvent {
  observed_at: string;
  minute: number;
  coordinate: string;
  pool: PoolName;
  kind: PoolKind;
  tier: RewardTier;
  observation_kind: "item-delta" | "action-recorded";
  item_quantity: number;
  route_mode: string;
  event_id: string | null;
}
export interface TimingGap {
  pool: PoolName;
  tier: RewardTier;
  kind: PoolKind;
  previous_at: string;
  current_at: string;
  previous_coordinate: string;
  current_coordinate: string;
  gap_days: number;
  bucket: TimeBucket;
  moved_coordinate: boolean;
  interpretation: "INTER_REWARD_OBSERVATION_GAP_NOT_PROVEN_TRANSFER_OR_COOLDOWN";
}
export interface TimePeakHypothesis {
  pool: PoolName;
  tier: RewardTier;
  conceptual_peak: "short" | "middle" | "long";
  event_count: number;
  category_interval_count: number;
  cross_coordinate_interval_count: number;
  median_observed_gap_days: number | null;
  modal_gap_bucket: TimeBucket | null;
  detected_peak_days: number | null;
  peak_status: "INSUFFICIENT_DATED_EVENTS" | "OBSERVATIONAL_MODE_ONLY_NOT_COOLDOWN_PEAK";
  observation_count_by_bucket: Record<TimeBucket, number>;
}
export interface PoolTimeScaleAudit {
  schema: "don-combo-pool-timescales/v0.1";
  total_layout_sightings: number;
  raw_item_delta_quantity: number;
  distinct_reward_events: number;
  collapsed_simultaneous_gear_items: number;
  global_interreward_intervals: number;
  same_coordinate_intervals: number;
  cross_coordinate_intervals: number;
  events: PoolTimingEvent[];
  gaps: TimingGap[];
  tier_hypotheses: TimePeakHypothesis[];
  prior: "THREE_PROPOSED_TIMESCALES_NOT_THREE_MEASURED_PEAKS";
  transport_hypothesis: "POSSIBLE_CROSS_COORDINATE_CATEGORY_TRANSFER_UNVALIDATED";
  note: string;
}
function cleanEventId(o: PoolObservation): string {
  return o.event_id || [o.observed_at, o.coordinate, o.pool, o.kind].join("|");
}
function compareTime(a: PoolTimingEvent, b: PoolTimingEvent): number {
  return (
    Date.parse(a.observed_at) - Date.parse(b.observed_at) ||
    a.coordinate.localeCompare(b.coordinate) ||
    a.kind.localeCompare(b.kind)
  );
}
function blankBins(): Record<TimeBucket, number> {
  return Object.fromEntries(TIME_BUCKETS.map((b) => [b.key, 0])) as Record<TimeBucket, number>;
}
export function buildPoolTimeScaleAudit(index: PoolIndex): PoolTimeScaleAudit {
  // The same comb may award all three cursed equipment pieces. That is one
  // pirate-hoard reward event, not three independent respawn/cooldown samples.
  const byEvent = new Map<string, PoolTimingEvent>();
  let collapsed = 0,
    layout = 0,
    rawQty = 0;
  for (const o of index.observations) {
    if (o.certainty === "layout-sighting") {
      layout += o.quantity;
      continue;
    }
    if (o.certainty !== "item-delta" && o.certainty !== "action-recorded") continue;
    if (o.certainty === "item-delta") rawQty += o.quantity;
    if (!o.coordinate || !Number.isFinite(Date.parse(o.observed_at))) continue;
    const identity = `${cleanEventId(o)}|${o.pool}|${o.kind}|${o.coordinate}`;
    const prior = byEvent.get(identity);
    if (prior) {
      prior.item_quantity += o.quantity;
      collapsed++;
      continue;
    }
    byEvent.set(identity, {
      observed_at: o.observed_at,
      minute: o.minute,
      coordinate: o.coordinate,
      pool: o.pool,
      kind: o.kind,
      tier: o.tier,
      observation_kind: o.certainty,
      item_quantity: o.quantity,
      route_mode: o.route_mode,
      event_id: o.event_id,
    });
  }
  const events = [...byEvent.values()].sort(compareTime);
  const gaps: TimingGap[] = [];
  // Calculate both within-category and across-coordinate sequences. A moved
  // observation is not evidence of transferring a hidden timer between tiles.
  const groups = new Map<PoolKind, PoolTimingEvent[]>();
  for (const e of events)
    (groups.get(e.kind) || (groups.set(e.kind, []), groups.get(e.kind)!)).push(e);
  for (const stream of groups.values()) {
    stream.sort(compareTime);
    for (let j = 1; j < stream.length; j++) {
      const prev = stream[j - 1],
        cur = stream[j];
      const delta = Date.parse(cur.observed_at) - Date.parse(prev.observed_at);
      if (delta <= 0) continue;
      const days = delta / 86400000;
      gaps.push({
        pool: cur.pool,
        tier: cur.tier,
        kind: cur.kind,
        previous_at: prev.observed_at,
        current_at: cur.observed_at,
        previous_coordinate: prev.coordinate,
        current_coordinate: cur.coordinate,
        gap_days: days,
        bucket: findBucket(days),
        moved_coordinate: prev.coordinate !== cur.coordinate,
        interpretation: "INTER_REWARD_OBSERVATION_GAP_NOT_PROVEN_TRANSFER_OR_COOLDOWN",
      });
    }
  }
  const tiers: Array<[RewardTier, "short" | "middle" | "long"]> = [
    ["common_rare", "short"],
    ["uncommon_rare", "middle"],
    ["rare_rare", "long"],
  ];
  // Each pool gets three independent hypothesis lanes. Pool 1 whale actions
  // and Pool 2 item drops must never be merged into one fitted cooldown.
  const tier_hypotheses = (["pool_1", "pool_2"] as PoolName[]).flatMap((pool) =>
    tiers.map(([tier, conceptual_peak]): TimePeakHypothesis => {
      const e = events.filter((q) => q.pool === pool && q.tier === tier);
      const g = gaps.filter((q) => q.pool === pool && q.tier === tier);
      const bins = blankBins();
      for (const v of g) bins[v.bucket]++;
      const ordered = g.map((v) => v.gap_days).sort((a, b) => a - b);
      const median = ordered.length
        ? (ordered[Math.floor((ordered.length - 1) / 2)] +
            ordered[Math.floor(ordered.length / 2)]) /
          2
        : null;
      const modal = TIME_BUCKETS.slice().sort((a, b) => bins[b.key] - bins[a.key])[0];
      const credible =
        g.length >= 5 &&
        new Set(e.map((v) => v.observed_at.slice(0, 10))).size >= 3 &&
        new Set(e.map((v) => v.coordinate)).size >= 3;
      return {
        pool,
        tier,
        conceptual_peak,
        event_count: e.length,
        category_interval_count: g.length,
        cross_coordinate_interval_count: g.filter((v) => v.moved_coordinate).length,
        median_observed_gap_days: median,
        modal_gap_bucket: g.length ? modal.key : null,
        // A sample median cannot itself establish a real cooldown mode.
        detected_peak_days: null,
        peak_status: credible
          ? "OBSERVATIONAL_MODE_ONLY_NOT_COOLDOWN_PEAK"
          : "INSUFFICIENT_DATED_EVENTS",
        observation_count_by_bucket: bins,
      };
    }),
  );
  return {
    schema: "don-combo-pool-timescales/v0.1",
    total_layout_sightings: layout,
    raw_item_delta_quantity: rawQty,
    distinct_reward_events: events.length,
    collapsed_simultaneous_gear_items: collapsed,
    global_interreward_intervals: gaps.length,
    same_coordinate_intervals: gaps.filter((v) => !v.moved_coordinate).length,
    cross_coordinate_intervals: gaps.filter((v) => v.moved_coordinate).length,
    events,
    gaps,
    tier_hypotheses,
    prior: "THREE_PROPOSED_TIMESCALES_NOT_THREE_MEASURED_PEAKS",
    transport_hypothesis: "POSSIBLE_CROSS_COORDINATE_CATEGORY_TRANSFER_UNVALIDATED",
    note: "Chronological category inter-reward gaps, not observed spawn timers. Sightings are excluded from reward intervals. Multiple pirate items from one comb form one reward event. Short/middle/long are hypotheses; empirical modes are withheld when sample support is weak. Cross-coordinate gaps do not prove timer transport.",
  };
}

export type PoolTimeScaleSummary = Omit<PoolTimeScaleAudit, "events" | "gaps">;
export function compactPoolTimeScales(index: PoolTimeScaleAudit): PoolTimeScaleSummary {
  return {
    schema: index.schema,
    total_layout_sightings: index.total_layout_sightings,
    raw_item_delta_quantity: index.raw_item_delta_quantity,
    distinct_reward_events: index.distinct_reward_events,
    collapsed_simultaneous_gear_items: index.collapsed_simultaneous_gear_items,
    global_interreward_intervals: index.global_interreward_intervals,
    same_coordinate_intervals: index.same_coordinate_intervals,
    cross_coordinate_intervals: index.cross_coordinate_intervals,
    tier_hypotheses: index.tier_hypotheses,
    prior: index.prior,
    transport_hypothesis: index.transport_hypothesis,
    note: index.note,
  };
}
