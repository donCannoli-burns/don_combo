import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  poolForItem, buildPoolCooldownIndex, buildHistoricalRareCurve,
  recordPoolLabels, cooldownForTarget,
} from "../src/runtime/two-pool-cooldown.ts";

const id=(minute,row,column)=>({minute,row,column});
const DAY=86400000;
const start=Date.parse("2026-10-01T00:00:00.000Z");
const iso=days=>new Date(start+days*DAY).toISOString();
const run=(id,mode="watersheep-paid")=>({player_id:42,run_id:id,route_mode:mode});
function event(name,day,minute,row,col,items={},outcome="rare_target",ctx=null,layout="10:rrrrrrrrrr"){
  return {
    schema:"don-combo-ml-event/v0.1",event_id:name,
    observed_at:iso(day),minute,layout,outcome,
    planned_target:id(minute,row,col),actual_comb:id(minute,row,col),
    items,run_context:ctx,
  };
}
const catalogue=[
  {...id(1216,10,7),false_rare:false},
  {...id(5447,10,3),false_rare:false},
  {...id(5000,10,2),false_rare:false}, // never dated, cannot count as a cooldown
  {...id(7700,10,4),false_rare:true},
];
assert.equal(poolForItem("piece of driftwood",1)?.kind,"piece_of_driftwood");
assert.equal(poolForItem("meteorite fragment",1)?.tier,"rare_rare");
assert.equal(poolForItem("rainbow pearl",1)?.pool,"pool_1");
for(const pirate of ["cursed tricorn hat","cursed swash buckle","cursed pirate cutlass"])
  assert.equal(poolForItem(pirate,1)?.kind,"cursed_pirate_gear",pirate);
for(const notRare of ["driftwood hat","cursed pearl","cutlass","sand dollar","grain of sand"])
  assert.equal(poolForItem(notRare,1),null,notRare);
assert.equal(poolForItem("piece of driftwood",-1),null);

const events=[
  event("older-drift",0,1216,10,7,{"piece of driftwood":1}),
  event("older-drift",0,1216,10,7,{"piece of driftwood":1}), // duplicate ID
  event("layout-combed",1,1216,10,7,{},"rough_fallback",null,"10:rrrrrrrcrr"),
  event("second-reward",2,1216,10,7,{"cursed swash buckle":1},"rare_target",run("two")),
  event("last-rare",8,1216,10,7,{"meteorite fragment":1},"rare_target",run("three")),
  event("other-pool",0,5447,10,3,{"rainbow pearl":1},"rare_target",null,"10:rrrCrrWrrr"),
  event("whale-action",5,5447,10,6,{},"whale",run("whale"),"10:rrrCrrWrrr"),
  event("false-rare",4,7700,10,4,{"meteorite fragment":1}),
  event("foreign",3,1216,10,7,{"meteorite fragment":1},"rare_target",run("other","watersheep-free")),
  event("future",90,1216,10,7,{"meteorite fragment":1}),
];
events[8].run_context.player_id=99;
const index=buildPoolCooldownIndex(events,start+10*DAY,42);
assert.equal(index.summary.pool_2.piece_of_driftwood,1);
assert.equal(index.summary.pool_2.cursed_pirate_gear,1);
assert.equal(index.summary.pool_2.meteorite_fragment,2); // 1216 + false-rare; not a false "cooldown" sample
assert.equal(index.summary.pool_1.rainbow_pearl,1);
assert.equal(index.summary.pool_1.sand_castle,2); // original layout + whale action revisit
assert.equal(index.summary.pool_1.beached_whale,3); // two sightings and one ACTION, never conflated
assert.equal(index.summary.layout_sightings,4);
assert.equal(index.summary.action_recorded,1);
assert.equal(index.summary.censored_intervals,2); // drift -> buckle -> meteorite at 1216
const tile=cooldownForTarget(index,1216,10,7);
assert.equal(tile.rewarded_pool_2,3);
assert.equal(tile.interval_samples.length,2);
assert.equal(tile.interval_samples[0].lower_days,1);
assert.equal(tile.interval_samples[0].upper_days,2);
assert.equal(tile.interval_samples[0].rewarded_tier,"uncommon_rare");
assert.equal(tile.interval_samples[1].upper_days,6);
assert.equal(tile.interval_samples[1].rewarded_tier,"rare_rare");
assert.equal(tile.uncertainty,"CENSORED_REWARD_INTERVALS_ONLY");
const two=recordPoolLabels(events[3],42);
assert.equal(two.length,1);
assert.equal(two[0].kind,"cursed_pirate_gear");
assert.equal(two[0].route_mode,"watersheep-paid");

const curve=buildHistoricalRareCurve(catalogue,events,index,start+10*DAY,42);
assert.equal(curve.known_rare_coordinates,3);
assert.equal(curve.known_rare_undated_coordinates,1);
assert.equal(curve.false_rare_excluded,1);
assert.equal(curve.exact_rare_target_attempts,4); // drift, buckle, meteorite, pearl
assert.equal(curve.repeated_attempt_intervals,2);
assert.equal(curve.bins.find(b=>b.key==="1_to_3_days")?.repeat_attempt_intervals,1);
assert.equal(curve.bins.find(b=>b.key==="1_to_3_days")?.current_reward_tiers.uncommon_rare,1);
assert.equal(curve.bins.find(b=>b.key==="3_to_7_days")?.repeat_attempt_intervals,1);
assert.equal(curve.bins.find(b=>b.key==="3_to_7_days")?.current_reward_tiers.rare_rare,1);
assert.equal(curve.historical_unbound_rare_attempts,2);
assert.equal(curve.run_bound_rare_attempts,2);
assert.equal(curve.censored_same_coordinate_reward_intervals,2);
assert.equal(curve.verified_respawn_intervals,null);
assert.equal(curve.inference_kind,"OBSERVED_ATTEMPT_GAPS_NOT_RESPAWN_PROBABILITY");

// Preservation of the real run execution path: every normal or WaterSheep
// routed action records delta, source and pool labels before cohort archival.
const obs=readFileSync(new URL("../src/runtime/observations.ts",import.meta.url),"utf8");
const runtime=readFileSync(new URL("../src/don_combo_runtime.ts",import.meta.url),"utf8");
const main=readFileSync(new URL("../src/main.ts",import.meta.url),"utf8");
const cohorts=readFileSync(new URL("../src/runtime/shadow-learning.ts",import.meta.url),"utf8");
assert.match(obs,/recordPoolLabels\(event, Number\(myId\(\)\)\)/);
assert.match(obs,/appendBufferToFile\(/);
assert.match(main,/pre_action_prediction: preActionPrediction/);
assert.match(main,/run_context: activeShadowRun/);
assert.match(main,/autoTraceWaterSheepRun = shadow11 \|\| wsFree \|\| wsPaid/);
assert.match(runtime,/buildHistoricalRareCurve\(points, fullHistory\.events, poolIndex/);
assert.match(runtime,/historical_rare_curve: evidence\.historical_rare_curve/);
assert.match(runtime,/pool_front_observations: evidence\.pool_front_observations/);
assert.match(cohorts,/two_pool_observation_counts: poolCounts/);
console.log("dual rare pools, historical baseline attempt curve, item tiers and routed/ordinary trace linkage PASS");
