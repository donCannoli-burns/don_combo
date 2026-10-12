# don_combo

> Experimental downstream fork of [loathers/combo](https://github.com/loathers/combo). The normal Combo execution path and rare-tile data are preserved; the WaterSheep/Hilbert matrix is shadow-only and does not execute KoL actions.

## Introduction

Combo is an automated [beach combing](https://kol.coldfront.net/thekolwiki/index.php/Comb_the_Beach) script that harvests known rare tiles. This downstream copy currently preserves the upstream data set of 1,001 rare-tile records.

## Setup

Install this downstream release from the KoLmafia CLI:

```text
git checkout https://github.com/donCannoli-burns/don_combo.git release
```

If the upstream Combo project is already installed, remove that project first so both projects do not claim the same `scripts/combo/combo.js` and `data/raretiles.json` files.

## Usage

Normal Combo behavior is unchanged. Run `combo N` in the KoLmafia CLI, where `N` is the number of combs you wish to perform. Combo does not differentiate between free and non-free combs, so `combo 11` performs eleven combs.

## WaterSheep matrix prototype

The downstream release adds a relay-browser entry named `DonComboMatrix`. It displays the complete 1,000,000-tile beach address space inside a 1024 x 1024 order-10 Hilbert matrix, overlays known rare positions and the currently observed beach front, and shows WaterSheep score-mass reports for a small mixed candidate frontier drawn from current, observed, and deterministic exploration fronts.

WaterSheep remains advisory only. Known rare coordinates and Combo's route are withheld from model input, and its score mass is explicitly uncalibrated for KoL beach outcomes. The bridge reads local Combo/KoLmafia files, maintains a deduplicated local observation ledger, and writes visualization data; it never sends a KoL request and never executes a KoLmafia command.

Start a local WaterSheep server, then run the installed bridge from your KoLmafia root:

```bash
watersheep --model samratduttaofficial/WaterSheep --serve
python3 scripts/don_combo/watersheep_combo_bridge.py
```

For a deterministic UI smoke test without a model:

```bash
python3 scripts/don_combo/watersheep_combo_bridge.py --mock
```

For periodic shadow reassessment:

```bash
python3 scripts/don_combo/watersheep_combo_bridge.py --watch 30
```

Then open the KoLmafia relay browser and choose `DonComboMatrix` from the `-run script-` dropdown.

See [docs/WATERSHEEP_MATRIX_PROTOTYPE.md](docs/WATERSHEEP_MATRIX_PROTOTYPE.md) for the prototype boundary and data flow.

## Rare tile data

The rare-tile list is in [mafia/data/raretiles.json](mafia/data/raretiles.json). The formatting follows KoLmafia's beach coordinates: rows are 1-indexed and columns are 0-indexed.

## How does Combo work?

In order to avoid having all users combing the same tiles in sequence, whenever Combo is called it shuffles the order of the rare tiles using your user ID as a seed. This gives each player a persistent rare-tile order until the data changes. Combo walks that sequence, skips inaccessible submerged tiles, and records progress in `combo_lastTileCombed`.

### Frequently Asked Questions

> COMBO printed out "Our rare tile is combed, but we found a twinkle!" -- what does that mean?

The scarce beach-comb tile Combo targeted has already been combed, so rather than taking an already-combed tile it found a twinkly spot. Twinkly spots yield uncommon items rather than the common pool.

### Credits

The downstream prototype preserves the original Combo project and its credits. Thank you to the players who provided the rare-tile data:

- Tadpoleloop
- SSBBHax
- DanceCommander6
- Disco Stew
- Grushvak
- Veracity
- The Dictator
- Playultm8
