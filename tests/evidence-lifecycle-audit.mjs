import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildPoolCooldownIndex, buildHistoricalRareCurve } from "../src/runtime/two-pool-cooldown.ts";
import { buildPoolTimeScaleAudit, compactPoolTimeScales } from "../src/runtime/pool-timescales.ts";

const base=Date.parse("2024-01-01T00:00:00Z"),date=(d)=>new Date(base+d*86400000).toISOString();
const coord=(minute,column)=>({minute,row:10,column});
const make=(id,day,minute,column,items={},outcome="rare_target",layout="10:rrrrrrrrrr")=>({
  schema:"don-combo-ml-event/v0.1",event_id:id,
  observed_at:date(day),minute,layout,outcome,
  planned_target:coord(minute,column),actual_comb:coord(minute,column),
  items,run_context:{run_id:"test-"+id,player_id:42,route_mode:"watersheep-paid"},
});
const events=[
  make("d0",0,1216,7,{"piece of driftwood":1}),
  make("d1",2,5447,3,{"piece of driftwood":1},"twinkle_fallback"),
  make("pirate-set",3,5000,4,{"cursed swash buckle":1,"cursed tricorn hat":1,"cursed pirate cutlass":1}),
  make("meteor-1",0,6000,2,{"meteorite fragment":1}),
  make("meteor-2",731,7000,4,{"meteorite fragment":1}),
  make("whale-sighting",3,8000,6,{},"rough_fallback","10:rrrrrrWrrr"),
  make("whale-action",4,8000,6,{},"whale","10:rrrrrrWrrr"),
  make("castle",5,9000,3,{},"rough_fallback","10:rrrCrrrrrr"),
];
const pool=buildPoolCooldownIndex(events,base+800*86400000,42);
const a=buildPoolTimeScaleAudit(pool),summary=compactPoolTimeScales(a);
assert.equal(a.distinct_reward_events,6,"2 driftwood + 1 pirate hoard + 2 meteorites + 1 whale action");
assert.equal(a.collapsed_simultaneous_gear_items,2,"three items from one comb count as ONE pirate reward event");
assert.equal(a.raw_item_delta_quantity,7,"raw item quantities remain available independently");
assert.equal(a.total_layout_sightings,3,"whale seen twice + castle seen once; no sightings become reward intervals");
assert.equal(a.global_interreward_intervals,2);
assert.equal(a.cross_coordinate_intervals,2,"driftwood and meteorite next observed at different coordinates");
assert.equal(a.same_coordinate_intervals,0);
assert.equal(a.gaps.find(x=>x.kind==="piece_of_driftwood")?.bucket,"1_to_3_days");
assert.equal(a.gaps.find(x=>x.kind==="meteorite_fragment")?.bucket,"730_plus_days");
assert.equal(a.gaps.every(x=>x.interpretation.includes("NOT_PROVEN_TRANSFER_OR_COOLDOWN")),true);
assert.equal(summary.tier_hypotheses.length,6,"three proposed timing lanes PER pool");
for(const hypothesis of summary.tier_hypotheses){
  assert.equal(hypothesis.detected_peak_days,null,"never claim a peak with sparse synthetic observations");
  assert.equal(hypothesis.peak_status,"INSUFFICIENT_DATED_EVENTS");
}
assert.equal(summary.tier_hypotheses.find(x=>x.pool==="pool_2"&&x.tier==="rare_rare")?.modal_gap_bucket,"730_plus_days");
assert.equal("events" in summary,false,"full event log must NOT go into model request");
assert.equal("gaps" in summary,false,"full global gap stream must NOT bloat model input");
assert.equal(summary.prior,"THREE_PROPOSED_TIMESCALES_NOT_THREE_MEASURED_PEAKS");

const known=[{...coord(1216,7),false_rare:false},{...coord(6000,2),false_rare:false}];
const longEvents=[
  make("first",0,1216,7,{"piece of driftwood":1}),
  make("second",731,1216,7,{"meteorite fragment":1}),
];
const longIndex=buildPoolCooldownIndex(longEvents,base+800*86400000,42);
const curve=buildHistoricalRareCurve(known,longEvents,longIndex,base+800*86400000,42);
assert.equal(curve.bins.find(x=>x.key==="730_plus_days")?.repeat_attempt_intervals,1);
assert.equal(curve.bins.find(x=>x.key==="730_plus_days")?.current_reward_tiers.rare_rare,1);
assert.equal(curve.bins.find(x=>x.key==="14_to_30_days")?.repeat_attempt_intervals,0);
assert.equal(curve.verified_respawn_intervals,null,"2-year attempt separation is not a confirmed cooldown");

// Static path checks complement pure tests: active KoL and both WaterSheep
// modes must share one event writer, and snapshot readback has a freshness gate.
const main=readFileSync(new URL("../src/main.ts",import.meta.url),"utf8");
const obs=readFileSync(new URL("../src/runtime/observations.ts",import.meta.url),"utf8");
const runtime=readFileSync(new URL("../src/don_combo_runtime.ts",import.meta.url),"utf8");
const html=readFileSync(new URL("../mafia/relay/don_combo_matrix.html",import.meta.url),"utf8");
assert.match(main,/function finishObservation|const finishObservation/);
assert.match(main,/recordBeachObservation\(minute, layoutString, outcome/);
assert.match(main,/autoTraceWaterSheepRun = shadow11 \|\| wsFree \|\| wsPaid/);
assert.match(obs,/appendBufferToFile\(\`\$\{JSON\.stringify\(event\)\}\\n\`, ML_EVENT_FILE\)/);
assert.match(obs,/recordPoolLabels\(event, Number\(myId\(\)\)\)/);
assert.match(runtime,/buildPoolTimeScaleAudit\(poolIndex\)/);
assert.match(runtime,/pool_timescales: evidence\.pool_timescales/);
assert.match(runtime,/pool_timescales: compactPoolTimeScales\(timescales\)/);
assert.match(runtime,/loadMlTraceEvents\(Number\.MAX_SAFE_INTEGER\)/);
assert.match(html,/don-combo-refresh-verified/);
console.log("E2E evidence contract: chronological cross-coordinate tiers + 2-year bins + routed persistence PASS");
