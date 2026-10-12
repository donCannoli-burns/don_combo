# Pre-TypeScript runtime snapshot — 2026-10-12

This checkpoint freezes the last working pre-native-TS runtime boundary before the don_combo matrix producer moved into KoLmafia TypeScript.

| Repository | Snapshot branch | Frozen commit |
| --- | --- | --- |
| donCannoli-burns/don_combo | `snapshot/pre-ts-runtime-20261012` | `fa6515e9d854299625e7342f668a2fa118aebdcc` |
| donCannoli-burns/kolmafia-skills | `snapshot/pre-ts-runtime-20261012` | `6a716b36ab19e0c8a2662ff354a9322e395c9875` |
| donCannoli-burns/kol-goblin-docs | `snapshot/pre-ts-runtime-20261012` | `0a42b31bfb305f1575613ac849ade862facb3ab8` |
| donCannoli-burns/kol-ash-it-down | `snapshot/pre-ts-runtime-20261012` | `80419478d87b97b0d0d418c4ed0fca4159a663a5` |
| donCannoli-burns/KOL-WaterSheep | `snapshot/pre-ts-runtime-20261012` | `2d36af121b763f47deb58f7d9a4b889f6b920236` |

The snapshot preserves the v0.4 Python/session-tail experiment and the first event-driven worker wiring. It is provenance and rollback material, not the preferred runtime after the v0.5 TypeScript cut.

The post-snapshot design keeps:

- Combo/KoLmafia as game authority.
- Goblin Docs as read-only context owner.
- WaterSheep as advisory inference only.
- Native ASH maps as the flat control plane.
- TypeScript/Libram as the semantic/evidence plane.
- Session logs as recovery/audit evidence rather than the hot-path trigger.
