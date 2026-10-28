// Experimental dual-pool cooldown observation. The rarity ladder is a
// user-supplied HYPOTHESIS, not a discovered KoL rule or learned probability.
// Evidence comes solely from recorded layouts, exact item deltas and actions.
export type PoolName = "pool_1" | "pool_2";
export type RewardTier = "common_rare" | "uncommon_rare" | "rare_rare";
export type PoolKind =
  | "sand_castle"
  | "beached_whale"
  | "rainbow_pearl"
  | "piece_of_driftwood"
  | "cursed_pirate_gear"
  | "meteorite_fragment";
export type ObservationCertainty = "layout-sighting" | "action-recorded" | "item-delta";
export interface PoolSignal {
  pool: PoolName;
  kind: PoolKind;
  tier: RewardTier;
  certainty: ObservationCertainty;
  quantity: number;
  item_name: string | null;
}
export interface PoolTraceEvent {
  schema?: string;
  event_id?: string;
  observed_at: string;
  minute: number;
  layout: string;
  outcome: string;
  planned_target?: { minute: number; row: number; column: number } | null;
  actual_comb?: { minute: number; row: number; column: number } | null;
  items?: Record<string, number>;
  run_context?: { player_id?: number; run_id?: string; route_mode?: string } | null;
}
export interface PoolObservation {
  observed_at: string;
  event_id: string | null;
  coordinate: string | null;
  pool: PoolName;
  kind: PoolKind;
  tier: RewardTier;
  certainty: ObservationCertainty;
  item_name: string | null;
  quantity: number;
  route_mode: string;
  // The pre-action tile state is NOT proof of spawn time.
  target_preaction_state: "combed" | "twinkle" | "unknown";
}
export interface PoolCooldownInterval {
  coordinate: string;
  pool: PoolName;
  rewarded_kind: PoolKind;
  rewarded_tier: RewardTier;
  previous_reward_at: string;
  new_reward_at: string;
  last_known_combed_at: string | null;
  lower_days: number;
  upper_days: number;
  semantics: "CENSORED_BETWEEN_SAME_COORDINATE_REWARD_EVENTS_NOT_PROVEN_RESPAWN_TIME";
}
export interface PoolCooldownEvidence {
  schema: "don-combo-two-pool-cooldown/v0.1";
  coordinate: string;
  observations: number;
  rewarded_pool_1: number;
  rewarded_pool_2: number;
  last_reward_kind: PoolKind | null;
  last_reward_at: string | null;
  interval_samples: PoolCooldownInterval[];
  uncertainty: "NO_VERIFIED_COOLDOWN" | "CENSORED_REWARD_INTERVALS_ONLY";
  hypothesis: "LONGER_RECOVERY_MAY_MEAN_RARER_REWARD_UNVALIDATED";
}
export interface PoolSummary {
  schema: "don-combo-two-pool-summary/v0.1";
  scanned_events: number;
  matched_events: number;
  pool_1: Record<PoolKind, number>;
  pool_2: Record<PoolKind, number>;
  by_tier: Record<RewardTier, number>;
  layout_sightings: number;
  item_delta_rewards: number;
  action_recorded: number;
  censored_intervals: number;
  distinct_reward_coordinates: number;
  historical_unbound_events: number;
  run_bound_events: number;
  unclassified_item_deltas: Record<string, number>;
  hypothesis: string;
}
export interface PoolIndex {
  summary: PoolSummary;
  by_coordinate: Record<string, PoolCooldownEvidence>;
  observations: PoolObservation[];
}
const tier = (pool: PoolName, kind: PoolKind, grade: RewardTier, certainty: ObservationCertainty, quantity: number, item_name: string | null): PoolSignal =>
  ({ pool, kind, tier: grade, certainty, quantity, item_name });
const key = (c: { minute: number; row: number; column: number }) =>
  `${c.minute},${c.row},${c.column}`;
export function poolForItem(item: string, quantity: number): PoolSignal | null {
  if (!Number.isFinite(quantity) || quantity <= 0) return null;
  const n = item.toLowerCase().replace(/\s+/g, " ").trim();
  if (n === "rainbow pearl") return tier("pool_1", "rainbow_pearl", "rare_rare", "item-delta", quantity, item);
  if (n === "piece of driftwood") return tier("pool_2", "piece_of_driftwood", "common_rare", "item-delta", quantity, item);
  if (n === "meteorite fragment") return tier("pool_2", "meteorite_fragment", "rare_rare", "item-delta", quantity, item);
  // Exact restricted equipment family; excludes ordinary swashbuckling loot.
  if (/^cursed pirate (tricorn|swashbuckle|swashbuckler|cutlass)(?:\b.*)?$/.test(n))
    return tier("pool_2", "cursed_pirate_gear", "uncommon_rare", "item-delta", quantity, item);
  return null;
}
function layoutSymbols(layout: string, symbol: string): Array<{row:number; column:number}> {
  const out: Array<{row:number;column:number}> = [];
  const seen = new Set<number>();
  for (const part of String(layout || "").split(",")) {
    const match = /^(\d+):([A-Za-z?]{10})$/.exec(part.trim());
    if (!match) continue;
    const row = Number(match[1]);
    if (!Number.isInteger(row) || row < 1 || row > 10 || seen.has(row)) continue;
    seen.add(row);
    for (let column = 0; column < 10; column++)
      if (match[2].charAt(column) === symbol) out.push({row,column});
  }
  return out;
}
function symbolAt(layout:string, row:number, column:number):string {
  const p = layout.split(",").find(x => x.startsWith(`${row}:`));
  return p?.split(":")[1]?.charAt(column) || "?";
}
const emptyCounts = (): Record<PoolKind,number> => ({
  sand_castle:0, beached_whale:0, rainbow_pearl:0,
  piece_of_driftwood:0, cursed_pirate_gear:0, meteorite_fragment:0,
});
const blank = (coordinate:string):PoolCooldownEvidence => ({
  schema:"don-combo-two-pool-cooldown/v0.1", coordinate, observations:0,
  rewarded_pool_1:0,rewarded_pool_2:0,last_reward_kind:null,last_reward_at:null,
  interval_samples:[],uncertainty:"NO_VERIFIED_COOLDOWN",
  hypothesis:"LONGER_RECOVERY_MAY_MEAN_RARER_REWARD_UNVALIDATED",
});
// Pool 1 sand castles are sightings, not automatic item rewards. Pool 1
// whale gets a separate action record only when the whale square was combed.
// Pool 2 rewards and pool 1 pearls require positive item deltas.
export function buildPoolCooldownIndex(
  events: ReadonlyArray<PoolTraceEvent>,
  nowMs: number,
  playerId: number,
): PoolIndex {
  const byCoordinate: Record<string,PoolCooldownEvidence> = {};
  const observations:PoolObservation[] = [];
  const p1=emptyCounts(),p2=emptyCounts();
  const byTier:Record<RewardTier,number>={common_rare:0,uncommon_rare:0,rare_rare:0};
  const unclassified:Record<string,number>={};
  const seen = new Set<string>();
  const prior = new Map<string,{when:number;kind:PoolKind}>();
  const lastCombed = new Map<string,number>();
  const rewardedCoords = new Set<string>();
  let matched=0,layoutSightings=0,itemRewards=0,actionRecorded=0,legacy=0,bound=0;
  // Strict chronological replay preserves valid intervals without depending on
  // file order and prevents an older event overwriting a more recent reward.
  const ordered = events.filter(e => {
    if (!Number.isFinite(Date.parse(e.observed_at)) || Date.parse(e.observed_at)>nowMs) return false;
    return e.run_context?.player_id == null || e.run_context.player_id===playerId;
  }).slice().sort((a,b)=>Date.parse(a.observed_at)-Date.parse(b.observed_at));
  const enrich = (e:PoolTraceEvent, c:string|null, signal:PoolSignal, state:"combed"|"twinkle"|"unknown") => {
    const o:PoolObservation={
      observed_at:e.observed_at,event_id:e.event_id||null,coordinate:c,
      pool:signal.pool,kind:signal.kind,tier:signal.tier,certainty:signal.certainty,
      item_name:signal.item_name,quantity:signal.quantity,
      route_mode:e.run_context?.route_mode||"legacy-unbound",
      target_preaction_state:state,
    };
    observations.push(o);
    if(signal.pool==="pool_1")p1[signal.kind]+=signal.quantity;
    else p2[signal.kind]+=signal.quantity;
    byTier[signal.tier]+=signal.quantity;
    if(signal.certainty==="layout-sighting")layoutSightings+=signal.quantity;
    else if(signal.certainty==="action-recorded")actionRecorded+=signal.quantity;
    else itemRewards+=signal.quantity;
    if(c && signal.certainty!=="layout-sighting"){
      const cur=byCoordinate[c]??(byCoordinate[c]=blank(c));
      cur.observations++;
      const timestamp=Date.parse(e.observed_at);
      // Only positive item deltas plus a whale action on the corresponding W
      // are reward observations; do not infer any sandcastle harvest.
      if(signal.pool==="pool_1")cur.rewarded_pool_1+=signal.quantity;
      else cur.rewarded_pool_2+=signal.quantity;
      cur.last_reward_kind=signal.kind;
      cur.last_reward_at=e.observed_at;
      rewardedCoords.add(c);
      const previous=prior.get(c);
      if(previous && timestamp>previous.when){
        const checked=lastCombed.get(c);
        const afterPrevious=checked != null && checked>=previous.when && checked<timestamp ? checked : null;
        const interval:PoolCooldownInterval={
          coordinate:c,pool:signal.pool,rewarded_kind:signal.kind,rewarded_tier:signal.tier,
          previous_reward_at:new Date(previous.when).toISOString(),
          new_reward_at:new Date(timestamp).toISOString(),
          last_known_combed_at:afterPrevious==null?null:new Date(afterPrevious).toISOString(),
          lower_days:afterPrevious==null?0:(afterPrevious-previous.when)/86400000,
          upper_days:(timestamp-previous.when)/86400000,
          semantics:"CENSORED_BETWEEN_SAME_COORDINATE_REWARD_EVENTS_NOT_PROVEN_RESPAWN_TIME",
        };
        cur.interval_samples.push(interval);
        cur.uncertainty="CENSORED_REWARD_INTERVALS_ONLY";
      }
      prior.set(c,{when:timestamp,kind:signal.kind});
      lastCombed.delete(c);
    }
  };
  for(const e of ordered){
    if(e.event_id && seen.has(e.event_id))continue;
    if(e.event_id)seen.add(e.event_id);
    matched++;
    if(e.run_context?.run_id)bound++;else legacy++;
    const plan=e.planned_target;
    if(plan?.minute===e.minute && symbolAt(e.layout,plan.row,plan.column)==="c"){
      const c=key(plan);lastCombed.set(c,Date.parse(e.observed_at));
    }
    // Record sandcastle and whale sightings only once per event/location.
    for(const pos of layoutSymbols(e.layout,"C")){
      enrich(e,key({minute:e.minute,...pos}),tier("pool_1","sand_castle","common_rare","layout-sighting",1,null),"unknown");
    }
    for(const pos of layoutSymbols(e.layout,"W")){
      enrich(e,key({minute:e.minute,...pos}),tier("pool_1","beached_whale","uncommon_rare","layout-sighting",1,null),"unknown");
    }
    const actual=e.actual_comb;
    const actualKey=actual?.minute===e.minute?key(actual):null;
    if(e.outcome==="whale" && actualKey && symbolAt(e.layout,actual!.row,actual!.column)==="W"){
      enrich(e,actualKey,tier("pool_1","beached_whale","uncommon_rare","action-recorded",1,null),"unknown");
    }
    for(const [name,qty] of Object.entries(e.items||{})){
      if(qty<=0)continue;
      const signal=poolForItem(name,qty);
      if(!signal){unclassified[name]=(unclassified[name]||0)+qty;continue;}
      // Item delta attributed to a known real comb only, no action means
      // unbound item evidence (not a cooldown interval for a guessed tile).
      const state=actual ? symbolAt(e.layout,actual.row,actual.column) : "?";
      enrich(e,actualKey,signal,state==="c"?"combed":state==="t"?"twinkle":"unknown");
    }
  }
  const summary:PoolSummary={
    schema:"don-combo-two-pool-summary/v0.1",scanned_events:events.length,matched_events:matched,
    pool_1:p1,pool_2:p2,by_tier:byTier,layout_sightings:layoutSightings,
    item_delta_rewards:itemRewards,action_recorded:actionRecorded,
    censored_intervals:Object.values(byCoordinate).reduce((n,v)=>n+v.interval_samples.length,0),
    distinct_reward_coordinates:rewardedCoords.size,
    historical_unbound_events:legacy,run_bound_events:bound,unclassified_item_deltas:unclassified,
    hypothesis:"User-proposed two-pool rarity ladder: shorter cooldown may correspond to common/rare, longer to uncommon/rare, longest to rare/rare. NOT CALIBRATED. Recorded deltas and sightings are observations, not a demonstrated cooldown-to-loot relationship.",
  };
  return {summary,by_coordinate:byCoordinate,observations};
}
export function cooldownForTarget(index:PoolIndex,minute:number,row:number,column:number):PoolCooldownEvidence {
  return index.by_coordinate[`${minute},${row},${column}`] || blank(`${minute},${row},${column}`);
}
