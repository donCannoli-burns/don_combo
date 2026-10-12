# WaterSheep × Combo matrix prototype

This downstream prototype keeps Combo's current rare-tile data and normal Combo script intact while adding a read-only/shadow assessment surface.

## Boundary

- **Dense address space:** all 1,000,000 KoL beach tiles have a deterministic address `d = (minute - 1) * 100 + (row - 1) * 10 + column` inside a 1024×1024 order-10 Hilbert matrix.
- **Sparse inference:** WaterSheep only receives a small deterministic candidate frontier (default 6 beachfronts per refresh).
- **Dense memory/UI:** the relay page retains the million-cell coordinate system and overlays known rare points, the current beach layout, and WaterSheep candidate scores.
- **No authority:** the bridge never makes a KoL request and never executes a KoLmafia command. It reads local files and writes local runtime visualization data only.
- **Combo remains authoritative:** `scripts/combo/combo.js` and `data/raretiles.json` remain the upstream-compatible execution/data path.

## Runtime flow

```text
Combo raretiles + local KoLmafia prefs
                |
                v
      deterministic frontier
                |
                v
       WaterSheep localhost
       /v1/systemone :8766
                |
                v
 probabilities + fixed weights
                |
                v
 relay/don_combo_matrix_runtime.js
                |
                v
 KoLmafia relay dropdown -> DonComboMatrix
```

## Run

Start WaterSheep locally, then run the installed bridge:

```bash
watersheep --model samratduttaofficial/WaterSheep --serve
python3 /path/to/kolmafia/scripts/don_combo/watersheep_combo_bridge.py
```

For a deterministic UI smoke test with no model:

```bash
python3 /path/to/kolmafia/scripts/don_combo/watersheep_combo_bridge.py --mock
```

For periodic reassessment:

```bash
python3 /path/to/kolmafia/scripts/don_combo/watersheep_combo_bridge.py --watch 30
```

The model probabilities are experimental priors, not calibrated KoL tile probabilities. Real KoL observations and known Combo rare data should always outrank them in any future execution policy.
