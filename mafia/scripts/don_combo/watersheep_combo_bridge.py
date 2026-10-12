#!/usr/bin/env python3
"""Shadow-only Combo -> WaterSheep beach matrix. Reads local state; performs no KoL actions."""
from __future__ import annotations
import argparse, hashlib, json, math, os, time, urllib.request
from pathlib import Path

GRID=1024
REAL=1_000_000
LABELS=("rare","whale","sandcastle","twinkle","regular","scratched")
MODEL_KEYS={"A":"rare","B":"whale","C":"sandcastle","D":"twinkle","E":"regular","F":"scratched"}
WEIGHTS={"rare":1.0,"whale":.86,"sandcastle":.66,"twinkle":.38,"regular":.10,"scratched":0.0}
DESIGN_REFERENCE={
    "repository":"es-3581100/math-by-design",
    "commit":"4f3cfebc0bc8f2f243080d9c758290323eeaf595",
    "use":"hierarchy, evidence/provenance separation, semantic handoff; reference not template",
}

def d_for(m,r,c): return (m-1)*100+(r-1)*10+c

def xy_for(d):
    x=y=0; t=d; s=1
    while s<GRID:
        rx=(t>>1)&1; ry=(t^rx)&1
        if ry==0:
            if rx==1: x,y=s-1-x,s-1-y
            x,y=y,x
        x+=s*rx; y+=s*ry; t>>=2; s<<=1
    return x,y

def root_of(value):
    if value: return Path(value).expanduser().resolve()
    p=Path(__file__).resolve()
    for parent in p.parents:
        if parent.name=="scripts": return parent.parent
    return (Path.home()/".kolmafia").resolve()

def safe_int(value,default=0):
    try: return int(value or default)
    except (TypeError,ValueError): return default

def prefs(root):
    settings=root/"settings"
    files=sorted(settings.glob("*_prefs.txt"),key=lambda p:p.stat().st_mtime,reverse=True) if settings.is_dir() else []
    for path in files:
        out={}
        for line in path.read_text(errors="replace").splitlines():
            if "\t" in line:
                key,value=line.split("\t",1); out[key]=value
        if any(k in out for k in ("_beachLayout","_beachMinutes","combo_lastTileCombed")):
            return path,out
    return (files[0],{}) if files else (None,{})

def false_rares(raw):
    out=set()
    for value in (raw or "").split(";"):
        try:
            if value: out.add(tuple(map(int,value.split(","))))
        except ValueError: pass
    return out

def load_rares(root):
    candidates=[root/"data"/"raretiles.json",root/"data"/"combo"/"raretiles.json"]
    git_root=root/"git"
    if git_root.is_dir():
        candidates.extend(sorted(git_root.glob("*/data/raretiles.json"),key=lambda p:("don_combo" not in str(p).lower(),str(p))))
    seen=set()
    for path in candidates:
        if str(path) in seen: continue
        seen.add(str(path))
        try:
            value=json.loads(path.read_text())
            if isinstance(value,list): return value,path
        except (OSError,json.JSONDecodeError): pass
    raise FileNotFoundError("raretiles.json not found in KoLmafia data or installed git projects")

def rare_points(rares,pref):
    bad=false_rares(pref.get("combo_false_rares",""))
    out=[]
    for tile in rares:
        try: m,r,c=int(tile["minute"]),int(tile["row"]),int(tile["column"])
        except (KeyError,TypeError,ValueError): continue
        if not (1<=m<=10000 and 1<=r<=10 and 0<=c<=9): continue
        d=d_for(m,r,c); x,y=xy_for(d)
        out.append({"d":d,"x":x,"y":y,"minute":m,"row":r,"column":c,"false_rare":(m,r,c) in bad})
    return out

def layout_cells(minute,raw):
    out=[]
    if not minute: return out
    for part in (raw or "").split(","):
        if ":" not in part: continue
        row_text,symbols=part.split(":",1)
        try: row=int(row_text)
        except ValueError: continue
        if not 1<=row<=10: continue
        for column,symbol in enumerate(symbols[:10]):
            d=d_for(minute,row,column); x,y=xy_for(d)
            out.append({"d":d,"x":x,"y":y,"row":row,"column":column,"symbol":symbol})
    return out

def layout_counts(raw):
    counts={"whale":0,"twinkle":0,"rough":0,"combed":0,"other":0,"visible":0}
    for part in (raw or "").split(","):
        if ":" not in part: continue
        _,symbols=part.split(":",1)
        for symbol in symbols[:10]:
            counts["visible"]+=1
            if symbol=="W": counts["whale"]+=1
            elif symbol=="t": counts["twinkle"]+=1
            elif symbol=="r": counts["rough"]+=1
            elif symbol=="c": counts["combed"]+=1
            else: counts["other"]+=1
    return counts

def write_atomic(path,text):
    path.parent.mkdir(parents=True,exist_ok=True)
    tmp=path.with_suffix(path.suffix+".tmp")
    tmp.write_text(text); os.replace(tmp,path)

def load_ledger(path):
    try:
        value=json.loads(path.read_text())
        if value.get("schema")=="don-combo-observation-ledger/v0.2": return value
    except (OSError,json.JSONDecodeError,AttributeError): pass
    return {"schema":"don-combo-observation-ledger/v0.2","fronts":{},"updated_at":None}

def update_ledger(root,pref):
    path=root/"data"/"don_combo_matrix_ledger.json"
    ledger=load_ledger(path)
    minute=safe_int(pref.get("_beachMinutes"),0); layout=pref.get("_beachLayout","")
    changed=False
    if 1<=minute<=10000 and layout:
        key=hashlib.sha256(f"{minute}|{layout}".encode()).hexdigest()[:20]
        fronts=ledger.setdefault("fronts",{})
        entry=fronts.setdefault(str(minute),{
            "layout_snapshots":0,
            "symbols":{"whale":0,"twinkle":0,"rough":0,"combed":0,"other":0,"visible":0},
            "seen_layout_keys":[],"last_layout_key":None,"last_seen_epoch":None,
        })
        seen=set(entry.get("seen_layout_keys") or [])
        if entry.get("last_layout_key"): seen.add(entry["last_layout_key"])
        if key not in seen:
            counts=layout_counts(layout)
            entry["layout_snapshots"]=safe_int(entry.get("layout_snapshots"))+1
            for name,value in counts.items():
                entry.setdefault("symbols",{})[name]=safe_int(entry["symbols"].get(name))+value
            seen.add(key)
            entry["seen_layout_keys"]=sorted(seen)
            entry["last_layout_key"]=key
            entry["last_seen_epoch"]=int(time.time())
            ledger["updated_at"]=time.strftime("%Y-%m-%dT%H:%M:%SZ",time.gmtime())
            changed=True
            write_atomic(path,json.dumps(ledger,indent=2)+"\n")
    return ledger,path,changed

def evidence_for(minute,current,ledger):
    entry=(ledger.get("fronts") or {}).get(str(minute)) or {}
    symbols=entry.get("symbols") or {}
    visible=max(1,safe_int(symbols.get("visible"),0))
    rates={name:round(safe_int(symbols.get(name),0)/visible,6) for name in ("whale","twinkle","rough","combed","other")}
    seen=entry.get("last_seen_epoch")
    age=round(max(0,time.time()-float(seen))/3600,3) if seen else None
    d=d_for(minute,1,0); x,y=xy_for(d)
    return {
        "minute_fraction":round((minute-1)/9999,6),
        "hilbert_bucket_256":d//4096,
        "distance_from_current":abs(minute-current) if current else None,
        "layout_snapshots":safe_int(entry.get("layout_snapshots"),0),
        "last_seen_age_hours":age,
        "observed_symbol_rates":rates,
        "representative":{"d":d,"x":x,"y":y,"row":1,"column":0},
    }

def sample_minutes(pref,ledger,count):
    count=max(1,count); current=safe_int(pref.get("_beachMinutes"),0)
    selected=[]; sources={}
    def add(m,source):
        if 1<=m<=10000 and m not in sources:
            selected.append(m); sources[m]=source
    if current: add(current,"current")
    observed=[]
    for text,entry in (ledger.get("fronts") or {}).items():
        m=safe_int(text)
        s=entry.get("symbols") or {}; visible=max(1,safe_int(s.get("visible"),0))
        signal=(safe_int(s.get("whale"))*4+safe_int(s.get("twinkle"))*2+safe_int(s.get("rough")))/visible
        observed.append((-signal,-safe_int(entry.get("layout_snapshots")),m))
    for _,__,m in sorted(observed):
        if len(selected)>=max(1,count//3)+(1 if current else 0): break
        add(m,"observed")
    seed=(safe_int(pref.get("combo_lastTileCombed"),0)*2654435761 + current*2246822519 + len(ledger.get("fronts") or {})*3266489917 + count) & 0xffffffff
    while len(selected)<count:
        seed=(1664525*seed+1013904223)&0xffffffff
        add(1+(seed%10000),"explore")
    return [(m,sources[m]) for m in selected[:count]]

def candidate_frontier(pref,ledger,count):
    current=safe_int(pref.get("_beachMinutes"),0)
    out=[]
    for minute,source in sample_minutes(pref,ledger,count):
        ev=evidence_for(minute,current,ledger)
        out.append({"minute":minute,"source":source,"evidence":ev,"representative":ev["representative"],"utility":None,"utility_components":None,"watersheep":None})
    return out

def mock_scores(minute):
    vals=[]; seed=(minute*1103515245+12345)&0x7fffffff
    for i in range(6):
        seed=(seed*1103515245+12345+i*7919)&0x7fffffff; vals.append(1+(seed%1000)/1000)
    total=sum(vals)
    return {k:v/total for k,v in zip(LABELS,vals)}

def ask(endpoint,candidate,pref,timeout):
    evidence=candidate["evidence"]
    state={
        "mode":"shadow-only; no action authorized",
        "beach_minute":candidate["minute"],
        "minute_fraction":evidence["minute_fraction"],
        "hilbert_bucket_256":evidence["hilbert_bucket_256"],
        "distance_from_current":evidence["distance_from_current"],
        "layout_snapshots":evidence["layout_snapshots"],
        "last_seen_age_hours":evidence["last_seen_age_hours"],
        "observed_symbol_rates":evidence["observed_symbol_rates"],
        "current_layout_if_same_front":pref.get("_beachLayout","") if str(candidate["minute"])==pref.get("_beachMinutes") else "not observed",
        "withheld":"known rare annotations, Combo target/order, and rare count are intentionally withheld",
    }
    payload={"state":state,"questions":{"tile_class":{
        "type":"choice",
        "instructions":"Experimental shadow scoring only. Assign relative score mass to six neutral outcome classes from the supplied weak evidence. Do not choose an action. The class keys are intentionally neutral.",
        "criteria":{
            "A":"rare tile opportunity",
            "B":"whale opportunity",
            "C":"sandcastle opportunity",
            "D":"twinkle or uncommon opportunity",
            "E":"ordinary regular beach opportunity",
            "F":"already exhausted, combed, or low-value opportunity"
        }
    }}}
    req=urllib.request.Request(endpoint,data=json.dumps(payload).encode(),headers={"Content-Type":"application/json"},method="POST")
    started=time.perf_counter()
    with urllib.request.urlopen(req,timeout=timeout) as response: raw=json.loads(response.read())
    probs=((raw.get("answers") or {}).get("tile_class") or {}).get("probabilities") or {}
    scores={MODEL_KEYS[key]:float(probs.get(key,0.0)) for key in MODEL_KEYS}
    if sum(scores.values())<=0:
        # compatibility with servers that echo semantic keys despite neutral criteria
        scores={label:float(probs.get(label,0.0)) for label in LABELS}
    total=sum(scores.values())
    if total<=0: raise ValueError("WaterSheep returned no tile_class score mass")
    return {k:v/total for k,v in scores.items()},round((time.perf_counter()-started)*1000,1)

def score_candidate(candidate,scores):
    ev=candidate["evidence"]; rates=ev["observed_symbol_rates"]; n=ev["layout_snapshots"]
    model=sum(scores.get(k,0.0)*WEIGHTS[k] for k in LABELS)
    exploration=.08/math.sqrt(1+n)
    observed=rates.get("whale",0)*.16+rates.get("twinkle",0)*.08-rates.get("combed",0)*.05
    return round(model+exploration+observed,6),{"model":round(model,6),"exploration":round(exploration,6),"observed":round(observed,6)}

def snapshot(root,endpoint,count,timeout,mock):
    rares,rare_source=load_rares(root)
    pref_file,pref=prefs(root)
    points=rare_points(rares,pref)
    ledger,ledger_file,ledger_changed=update_ledger(root,pref)
    candidates=candidate_frontier(pref,ledger,count)
    status="mock" if mock else "ready"; error=None
    for c in candidates:
        scores={}; elapsed=0.0
        if mock: scores=mock_scores(c["minute"])
        elif error is None:
            try: scores,elapsed=ask(endpoint,c,pref,timeout)
            except Exception as exc:
                status="offline"; error=f"{type(exc).__name__}: {exc}"
        if scores:
            c["watersheep"]={"score_mass":scores,"ms":elapsed,"calibration":"UNVALIDATED_FOR_KOL_BEACH"}
            c["utility"],c["utility_components"]=score_candidate(c,scores)
    candidates.sort(key=lambda c:(-(c["utility"] if c["utility"] is not None else -1),c["minute"]))
    minute=safe_int(pref.get("_beachMinutes"),0)
    return {
        "schema":"don-combo-matrix-runtime/v0.2",
        "generated_at":time.strftime("%Y-%m-%dT%H:%M:%SZ",time.gmtime()),
        "mode":"shadow-only","authority":"none",
        "claim":"Compare Combo's deterministic next target with a blinded WaterSheep shadow route without changing KoL state.",
        "note":"WaterSheep score mass is experimental and uncalibrated for KoL beach outcomes. Known rare annotations and Combo target/order are withheld from model input. No KoL request or KoLmafia command is executed by this bridge.",
        "matrix":{"order":10,"width":GRID,"height":GRID,"total_cells":GRID*GRID,"real_tile_cells":REAL,"unused_cells":GRID*GRID-REAL,"address_rule":"d=(minute-1)*100+(row-1)*10+column; (x,y)=HilbertPoint(d,10)"},
        "combo":{"rare_tile_records":len(points),"unique_rare_fronts":len({x["minute"] for x in points if not x["false_rare"]}),"false_rare_records":len(false_rares(pref.get("combo_false_rares",""))),"raretiles_file":str(rare_source),"prefs_file":str(pref_file) if pref_file else None,"last_tile_index":safe_int(pref.get("combo_lastTileCombed"),0),"current_minute":minute or None,"current_layout":pref.get("_beachLayout","")},
        "observations":{"ledger_file":str(ledger_file),"fronts_recorded":len(ledger.get("fronts") or {}),"ledger_updated_this_run":ledger_changed,"rule":"Distinct local _beachLayout snapshots only; repeated identical snapshots are deduplicated."},
        "watersheep":{"endpoint":endpoint,"status":status,"error":error,"options":list(LABELS),"weights":WEIGHTS,"input_policy":"Known rare coordinates, Combo target/order and rare count withheld.","calibration":"UNVALIDATED_FOR_KOL_BEACH"},
        "ui":{"design_reference":DESIGN_REFERENCE,"semantic_order":["claim","context","proof","decision","metadata","exit"],"evidence_kinds":["FACT","MODEL","POLICY"]},
        "known_rare_points":points,
        "current_front_cells":layout_cells(minute or None,pref.get("_beachLayout","")),
        "candidates":candidates,
    }

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--mafia-root")
    ap.add_argument("--endpoint",default="http://127.0.0.1:8766/v1/systemone")
    ap.add_argument("--candidate-count",type=int,default=6)
    ap.add_argument("--timeout",type=float,default=15)
    ap.add_argument("--watch",type=float,default=0)
    ap.add_argument("--mock",action="store_true")
    args=ap.parse_args(); root=root_of(args.mafia_root)
    while True:
        result=snapshot(root,args.endpoint,max(1,args.candidate_count),args.timeout,args.mock)
        encoded=json.dumps(result,separators=(",",":"))
        write_atomic(root/"data"/"don_combo_matrix_runtime.json",json.dumps(result,indent=2)+"\n")
        write_atomic(root/"relay"/"don_combo_matrix_runtime.js","window.DON_COMBO_MATRIX_RUNTIME="+encoded+";\n")
        top=result["candidates"][0]["minute"] if result["candidates"] else "none"
        print(f"don_combo matrix v0.2: {result['watersheep']['status']} | {len(result['candidates'])} candidates | shadow top {top} | {root}")
        if result["watersheep"]["error"]: print("WaterSheep:",result["watersheep"]["error"])
        if args.watch<=0: return 0
        time.sleep(max(1.0,args.watch))

if __name__=="__main__":
    raise SystemExit(main())
