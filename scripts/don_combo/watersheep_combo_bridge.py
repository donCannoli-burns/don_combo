#!/usr/bin/env python3
"""Shadow-only Combo -> WaterSheep -> relay snapshot bridge. No KoL actions."""
import argparse, json, math, os, time, urllib.request
from collections import defaultdict
from pathlib import Path

ORDER=10; GRID=1024; REAL=1_000_000
LABELS=("rare","whale","sandcastle","twinkle","regular","scratched")
WEIGHT={"rare":1.0,"whale":.9,"sandcastle":.7,"twinkle":.45,"regular":.1,"scratched":.03}

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

def prefs(root):
    files=sorted((root/"settings").glob("*_prefs.txt"),key=lambda p:p.stat().st_mtime,reverse=True) if (root/"settings").is_dir() else []
    for p in files:
        out={}
        for line in p.read_text(errors="replace").splitlines():
            if "\t" in line:
                k,v=line.split("\t",1); out[k]=v
        if any(k in out for k in ("_beachLayout","_beachMinutes","combo_lastTileCombed")): return p,out
    return (files[0],{}) if files else (None,{})

def false_rares(raw):
    out=set()
    for s in (raw or "").split(";"):
        try:
            if s: out.add(tuple(map(int,s.split(","))))
        except ValueError: pass
    return out

def layout_cells(minute,raw):
    out=[]
    if not minute: return out
    for part in (raw or "").split(","):
        if ":" not in part: continue
        rs,symbols=part.split(":",1)
        try: row=int(rs)
        except ValueError: continue
        for col,symbol in enumerate(symbols[:10]):
            if 1<=row<=10:
                d=d_for(minute,row,col); x,y=xy_for(d)
                out.append({"d":d,"x":x,"y":y,"row":row,"column":col,"symbol":symbol})
    return out

def load_rares(root):
    for p in (root/"data"/"raretiles.json",root/"data"/"combo"/"raretiles.json"):
        try:
            v=json.loads(p.read_text())
            if isinstance(v,list): return v
        except (OSError,json.JSONDecodeError): pass
    raise FileNotFoundError("raretiles.json not found in KoLmafia data directory")

def frontier(rares,p,count):
    bad=false_rares(p.get("combo_false_rares","")); groups=defaultdict(list); points=[]
    for t in rares:
        try: m,r,c=int(t["minute"]),int(t["row"]),int(t["column"])
        except (KeyError,TypeError,ValueError): continue
        if not (1<=m<=10000 and 1<=r<=10 and 0<=c<=9): continue
        d=d_for(m,r,c); x,y=xy_for(d); is_bad=(m,r,c) in bad
        points.append({"d":d,"x":x,"y":y,"minute":m,"row":r,"column":c,"false_rare":is_bad})
        if not is_bad: groups[m].append((r,c))
    mins=sorted(groups); current=int(p.get("_beachMinutes","0") or 0)
    candidates=[]
    for i,m in enumerate(mins):
        local=sum(1 for q in mins[max(0,i-8):i+9] if abs(q-m)<=25)
        coords=sorted(groups[m]); r,c=coords[0]; d=d_for(m,r,c); x,y=xy_for(d)
        distance=abs(m-current) if current else 0
        structural=len(coords)*10+local*.2-math.log1p(distance)*.05
        candidates.append({"minute":m,"known_rare_count":len(coords),"known_rare_tiles":[{"row":r0,"column":c0} for r0,c0 in coords],"rare_fronts_within_25_minutes":local,"distance_from_current":distance if current else None,"representative":{"d":d,"x":x,"y":y,"row":r,"column":c},"structural_score":round(structural,6)})
    candidates.sort(key=lambda c:(-c["structural_score"],c["minute"]))
    return candidates[:max(1,count)],points

def mock_probs(minute):
    vals=[]; s=(minute*1103515245+12345)&0x7fffffff
    for i in range(6): s=(s*1103515245+12345+i*7919)&0x7fffffff; vals.append(1+(s%1000)/1000)
    z=sum(vals); return {k:round(v/z,6) for k,v in zip(LABELS,vals)}

def ask(endpoint,c,p,timeout):
    state={"mode":"shadow-only; no action authorized","beach_minute":c["minute"],"known_rare_count":c["known_rare_count"],"known_rare_tiles":c["known_rare_tiles"],"rare_fronts_within_25_minutes":c["rare_fronts_within_25_minutes"],"distance_from_current":c["distance_from_current"],"current_layout_if_observed":p.get("_beachLayout","") if str(c["minute"])==p.get("_beachMinutes") else "not observed"}
    payload={"state":state,"questions":{"tile_class":{"type":"choice","instructions":"For experimental beach routing, which signal class best characterizes this beachfront? Return probabilities only; do not choose an action.","criteria":{"rare":"rare tile opportunity","whale":"whale opportunity","sandcastle":"sandcastle opportunity","twinkle":"twinkle or uncommon opportunity","regular":"ordinary beach opportunity","scratched":"exhausted, combed, or low-value opportunity"}}}}
    req=urllib.request.Request(endpoint,data=json.dumps(payload).encode(),headers={"Content-Type":"application/json"},method="POST")
    t=time.perf_counter()
    with urllib.request.urlopen(req,timeout=timeout) as r: raw=json.loads(r.read())
    probs=((raw.get("answers") or {}).get("tile_class") or {}).get("probabilities") or {}
    out={k:float(probs.get(k,0)) for k in LABELS}
    if sum(out.values())<=0: raise ValueError("WaterSheep returned no tile_class probabilities")
    return out,round((time.perf_counter()-t)*1000,1)

def write_atomic(path,text):
    path.parent.mkdir(parents=True,exist_ok=True); tmp=path.with_suffix(path.suffix+".tmp"); tmp.write_text(text); os.replace(tmp,path)

def snapshot(root,endpoint,count,timeout,mock):
    rare=load_rares(root); pref_file,p=prefs(root); candidates,points=frontier(rare,p,count)
    status="mock" if mock else "ready"; error=None
    for c in candidates:
        probs={}; ms=0
        if mock: probs=mock_probs(c["minute"])
        elif error is None:
            try: probs,ms=ask(endpoint,c,p,timeout)
            except Exception as e: status="offline"; error=f"{type(e).__name__}: {e}"
        c["watersheep"]={"probabilities":probs,"ms":ms} if probs else None
        c["utility"]=round(sum(probs.get(k,0)*WEIGHT[k] for k in LABELS)+.25*min(c["known_rare_count"],3),6) if probs else None
    candidates.sort(key=lambda c:(-(c["utility"] if c["utility"] is not None else -1),-c["structural_score"],c["minute"]))
    try: minute=int(p.get("_beachMinutes","0") or 0)
    except ValueError: minute=0
    return {"schema":"don-combo-matrix-runtime/v0.1","generated_at":time.strftime("%Y-%m-%dT%H:%M:%SZ",time.gmtime()),"mode":"shadow-only","authority":"none","note":"WaterSheep estimates only. No KoL request or KoLmafia command is executed by this bridge.","matrix":{"order":10,"width":1024,"height":1024,"total_cells":1048576,"real_tile_cells":1000000,"unused_cells":48576,"address_rule":"d=(minute-1)*100+(row-1)*10+column; (x,y)=HilbertPoint(d,10)"},"combo":{"rare_tile_records":len(points),"unique_rare_fronts":len({x["minute"] for x in points if not x["false_rare"]}),"prefs_file":str(pref_file) if pref_file else None,"current_minute":minute or None,"current_layout":p.get("_beachLayout","")},"watersheep":{"endpoint":endpoint,"status":status,"error":error,"options":list(LABELS),"weights":WEIGHT},"known_rare_points":points,"current_front_cells":layout_cells(minute or None,p.get("_beachLayout","")),"candidates":candidates}

def main():
    a=argparse.ArgumentParser(); a.add_argument("--mafia-root"); a.add_argument("--endpoint",default="http://127.0.0.1:8766/v1/systemone"); a.add_argument("--candidate-count",type=int,default=6); a.add_argument("--timeout",type=float,default=15); a.add_argument("--watch",type=float,default=0); a.add_argument("--mock",action="store_true"); args=a.parse_args(); root=root_of(args.mafia_root)
    while True:
        s=snapshot(root,args.endpoint,args.candidate_count,args.timeout,args.mock); encoded=json.dumps(s,separators=(",",":"))
        write_atomic(root/"data"/"don_combo_matrix_runtime.json",json.dumps(s,indent=2)+"\n"); write_atomic(root/"relay"/"don_combo_matrix_runtime.js","window.DON_COMBO_MATRIX_RUNTIME="+encoded+";\n")
        print(f"don_combo matrix: {s['watersheep']['status']} | {len(s['candidates'])} candidates | {root}")
        if s["watersheep"]["error"]: print("WaterSheep:",s["watersheep"]["error"])
        if args.watch<=0: return 0
        time.sleep(max(1,args.watch))
if __name__=="__main__": raise SystemExit(main())
