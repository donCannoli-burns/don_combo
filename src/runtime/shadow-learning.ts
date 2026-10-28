// Pure, passive evidence accounting: no model training or KoL actions.
// A run's front-level prediction must not be mistaken for a verified rare
// coordinate respawn when Combo falls back to an unrelated twinkle.
function plannedWasPreviouslyCombed(
  layout: string,
  target: { row: number; column: number },
): boolean {
  for (const part of String(layout || "").split(",")) {
    const colon = part.indexOf(":");
    if (colon < 0 || Number(part.slice(0, colon)) !== target.row) continue;
    return part.slice(colon + 1).charAt(target.column) === "c";
  }
  return false;
}

export interface ShadowRunContext {
  run_id: string;
  gameday: number;
  player_id: number;
  route_mode: string;
  started_at: string;
}
export interface ShadowRunEvent {
  run_context?: ShadowRunContext | null;
  event_id: string;
  minute: number;
  outcome: string;
  layout: string;
  planned_target?: { minute: number; row: number; column: number } | null;
  actual_comb?: { minute: number; row: number; column: number } | null;
  pre_action_prediction?: Record<string, unknown> | null;
  items: Record<string, number>;
}
export interface ShadowDailyRunSummary {
  schema: "don-combo-shadow-learning-run/v0.1";
  context: ShadowRunContext;
  ended_at: string;
  result: "completed" | "interrupted" | "failed";
  requested_combs: number;
  completed_combs: number;
  free_combs_observed: number;
  paid_combs_observed: number;
  recorded_events: number;
  events_match_completed: boolean;
  prediction_ready: number;
  prediction_error: number;
  prediction_untraced: number;
  planned_rare_previously_combed: number;
  incidental_fallback_twinkles: number;
  incidental_fallback_rough: number;
  planned_and_actual_match: number;
  rare_target_attempts: number;
  verified_rare_harvests: null;
  outcome_counts: Record<string, number>;
  item_counts: Record<string, number>;
  distinct_fronts_observed: number;
  note: string;
}
export function summarizeShadowRun(
  source: ShadowRunEvent[],
  context: ShadowRunContext,
  endedAt: string,
  result: "completed" | "interrupted" | "failed",
  requested: number,
  completed: number,
  freeUsed: number,
  paidObserved: number,
): ShadowDailyRunSummary {
  // Exact-run identity avoids accidentally attributing a previous day's
  // final observation to this run after a midnight / rollover transition.
  const events = source.filter((event) =>
    event.run_context?.run_id === context.run_id &&
    event.run_context.gameday === context.gameday &&
    event.run_context.player_id === context.player_id);
  const outcomeCounts: Record<string, number> = {};
  const itemCounts: Record<string, number> = {};
  const fronts = new Set<number>();
  let ready = 0;
  let error = 0;
  let untraced = 0;
  let previouslyCombed = 0;
  let matched = 0;
  for (const event of events) {
    fronts.add(event.minute);
    outcomeCounts[event.outcome] = (outcomeCounts[event.outcome] || 0) + 1;
    for (const [name, quantity] of Object.entries(event.items || {})) {
      itemCounts[name] = (itemCounts[name] || 0) + quantity;
    }
    if (event.pre_action_prediction?.error) error++;
    else if (event.pre_action_prediction?.score_mass) ready++;
    else untraced++;
    const target = event.planned_target;
    const actual = event.actual_comb;
    if (target && plannedWasPreviouslyCombed(event.layout, target))
      previouslyCombed++;
    if (target && actual && target.minute === actual.minute &&
        target.row === actual.row && target.column === actual.column) matched++;
  }
  return {
    schema: "don-combo-shadow-learning-run/v0.1",
    context,
    ended_at: endedAt,
    result,
    requested_combs: requested,
    completed_combs: completed,
    free_combs_observed: Math.max(0, freeUsed),
    paid_combs_observed: Math.max(0, paidObserved),
    recorded_events: events.length,
    events_match_completed: events.length === completed,
    prediction_ready: ready,
    prediction_error: error,
    prediction_untraced: untraced,
    planned_rare_previously_combed: previouslyCombed,
    incidental_fallback_twinkles: outcomeCounts.twinkle_fallback || 0,
    incidental_fallback_rough: outcomeCounts.rough_fallback || 0,
    planned_and_actual_match: matched,
    rare_target_attempts: outcomeCounts.rare_target || 0,
    // A positive inventory change alone is insufficient to certify rare-spawn
    // recovery; see the separate per-coordinate recovery index for provenance.
    verified_rare_harvests: null,
    outcome_counts: outcomeCounts,
    item_counts: itemCounts,
    distinct_fronts_observed: fronts.size,
    note: "Passive daily cohort; fallback twinkles are not confirmed rare-tile respawns. WaterSheep scores are uncalibrated and do not update model weights.",
  };
}
