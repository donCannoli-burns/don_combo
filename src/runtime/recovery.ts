/* eslint-disable eqeqeq */
// Evidence is per coordinate, not per beachfront. Unknown is not a successful harvest.
export type TileState = "combed" | "twinkle" | "rough" | "whale" | "unknown";
export interface RecoveryInterval {
  last_combed_epoch: number;
  first_available_epoch: number;
  lower_days: number;
  upper_days: number;
}
export interface TileRecovery {
  observations: number;
  harvests: number;
  last_seen_epoch: number | null;
  last_state: TileState;
  last_combed_epoch: number | null;
  last_harvest_epoch: number | null;
  last_harvest_item: string | null;
  last_harvest_provenance: "loot-inferred" | null;
  last_available_epoch: number | null;
  recovery_intervals: RecoveryInterval[];
}
export interface TileRecoveryLedger {
  schema: "don-combo-tile-recovery/v0.1";
  tiles: Record<string, TileRecovery>;
  updated_at: string | null;
}
export function tileKey(minute: number, row: number, column: number): string {
  return `${minute},${row},${column}`;
}
export function emptyTileRecovery(): TileRecovery {
  return {
    observations: 0,
    harvests: 0,
    last_seen_epoch: null,
    last_state: "unknown",
    last_combed_epoch: null,
    last_harvest_epoch: null,
    last_harvest_item: null,
    last_harvest_provenance: null,
    last_available_epoch: null,
    recovery_intervals: [],
  };
}
export function emptyRecoveryLedger(): TileRecoveryLedger {
  return { schema: "don-combo-tile-recovery/v0.1", tiles: {}, updated_at: null };
}
// KoLmafia's _beachLayout is pre-action. An 'r' without TwinkleVision
// is ambiguous: do not call it a confirmed rare or a confirmed cooldown.
export function stateAt(
  layout: string,
  row: number,
  column: number,
  twinkleVision: boolean,
): TileState {
  if (
    !Number.isInteger(row) ||
    row < 1 ||
    row > 10 ||
    !Number.isInteger(column) ||
    column < 0 ||
    column > 9
  )
    return "unknown";
  for (const part of layout.split(",")) {
    const colon = part.indexOf(":");
    if (colon < 0 || Number(part.slice(0, colon)) !== row) continue;
    const symbol = part.slice(colon + 1).charAt(column);
    if (symbol === "c") return "combed";
    if (symbol === "t") return "twinkle";
    if (symbol === "W") return "whale";
    if (symbol === "r" && twinkleVision) return "rough";
    return "unknown";
  }
  return "unknown";
}
export function observeTile(
  existing: TileRecovery | undefined,
  atEpoch: number,
  state: TileState,
  harvestedItem: string | null,
): TileRecovery {
  const entry: TileRecovery = existing
    ? {
        ...existing,
        recovery_intervals: (existing.recovery_intervals || []).slice(-40),
      }
    : emptyTileRecovery();
  if (!Number.isFinite(atEpoch) || atEpoch <= 0) return entry;
  // Do not overwrite a newer observation with an older, imported one.
  if (entry.last_seen_epoch != null && atEpoch < entry.last_seen_epoch) return entry;
  const previousCombed = entry.last_combed_epoch;
  const previousHarvest = entry.last_harvest_epoch;
  entry.observations++;
  entry.last_seen_epoch = atEpoch;
  entry.last_state = state;
  if (state === "combed") entry.last_combed_epoch = atEpoch;
  if (state === "twinkle") {
    entry.last_available_epoch = atEpoch;
    if (
      previousHarvest != null &&
      previousCombed != null &&
      previousCombed >= previousHarvest &&
      atEpoch > previousCombed
    ) {
      const last = entry.recovery_intervals[entry.recovery_intervals.length - 1];
      // Record one interval per harvest, rather than recounting every twinkle.
      if (!last || last.first_available_epoch < previousHarvest) {
        entry.recovery_intervals.push({
          last_combed_epoch: previousCombed,
          first_available_epoch: atEpoch,
          lower_days: Math.max(0, (previousCombed - previousHarvest) / 86400),
          upper_days: (atEpoch - previousHarvest) / 86400,
        });
      }
    }
  }
  if (harvestedItem) {
    entry.harvests++;
    entry.last_harvest_epoch = atEpoch;
    entry.last_harvest_item = harvestedItem;
    entry.last_harvest_provenance = "loot-inferred";
    // A verified positive item delta is stronger than a 'rare_target' attempt,
    // but not an independently game-verified spawn timestamp.
    entry.last_combed_epoch = atEpoch;
    entry.last_state = "combed";
  }
  entry.recovery_intervals = entry.recovery_intervals.slice(-40);
  return entry;
}
export interface RecoveryFeatures {
  observations: number;
  harvests: number;
  last_state: TileState;
  days_since_harvest: number | null;
  days_since_observed: number | null;
  last_harvest_item: string | null;
  harvest_evidence: "loot-inferred" | "unknown";
  still_combed_after_harvest: boolean;
  respawn_observed_after_harvest: boolean;
  completed_intervals: number;
  cooldown_lower_days: number | null;
  cooldown_upper_days: number | null;
  revisit_signal: number | null;
  revisit_signal_kind: "12_DAY_EXPLORATION_HEURISTIC_NOT_PROBABILITY" | "UNKNOWN";
}
export function recoveryFeatures(
  entry: TileRecovery | undefined,
  nowEpoch: number,
): RecoveryFeatures {
  const age = (epoch: number | null | undefined) =>
    epoch == null || epoch > nowEpoch ? null : Math.round((nowEpoch - epoch) / 8640) / 10;
  const days = entry ? age(entry.last_harvest_epoch) : null;
  const intervals = entry?.recovery_intervals || [];
  const lastInterval = intervals.length ? intervals[intervals.length - 1] : null;
  const observedRespawn =
    !!entry?.last_harvest_epoch &&
    !!lastInterval &&
    lastInterval.first_available_epoch >= entry.last_harvest_epoch;
  const stillCombed =
    !!entry?.last_harvest_epoch &&
    !!entry.last_combed_epoch &&
    entry.last_combed_epoch >= entry.last_harvest_epoch &&
    entry.last_state === "combed";
  return {
    observations: entry?.observations || 0,
    harvests: entry?.harvests || 0,
    last_state: entry?.last_state || "unknown",
    days_since_harvest: days,
    days_since_observed: entry ? age(entry.last_seen_epoch) : null,
    last_harvest_item: entry?.last_harvest_item || null,
    harvest_evidence: entry?.last_harvest_provenance || "unknown",
    still_combed_after_harvest: stillCombed,
    respawn_observed_after_harvest: observedRespawn,
    completed_intervals: intervals.length,
    cooldown_lower_days: lastInterval?.lower_days ?? null,
    cooldown_upper_days: lastInterval?.upper_days ?? null,
    // Explicitly a policy heuristic, NOT a fitted chance of respawn.
    revisit_signal: days == null ? null : Math.min(1, Math.max(0, days / 12)),
    revisit_signal_kind: days == null ? "UNKNOWN" : "12_DAY_EXPLORATION_HEURISTIC_NOT_PROBABILITY",
  };
}
