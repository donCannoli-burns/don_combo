// Sand castles are visible as uppercase C in KoLmafia's PRE-ACTION
// _beachLayout. Lowercase c means already-combed sand. Do not infer castles
// from grains of sand, ordinary items or the run footer.
export interface SandCastleCoordinate {
  minute: number;
  row: number;
  column: number; // zero-indexed KoLmafia column
}

export interface SandCastleAction {
  kind: "sand_castle_action";
  coordinate: string;
  source: "pre-action-layout-and-native-comb";
  verification: "native-demolition-text" | "pre-action-castle-command-returned";
  evidence_text: string | null;
  // Frequent-tile loot and sand, if any, belong to the ordinary item delta.
  classification: "CASTLE_ACTION_NOT_RARE_REWARD_OR_COOLDOWN";
}

export function visibleSandCastles(layout: string, minute: number): SandCastleCoordinate[] {
  if (!Number.isInteger(minute) || minute < 1 || minute > 10000) return [];
  const result: SandCastleCoordinate[] = [];
  const visited = new Set<number>();
  for (const raw of String(layout || "").split(",")) {
    const match = /^(\d+):([A-Za-z?]{10})$/.exec(raw.trim());
    if (!match) continue;
    const row = Number(match[1]);
    if (!Number.isInteger(row) || row < 1 || row > 10 || visited.has(row)) continue;
    visited.add(row);
    for (let column = 0; column < 10; column++) {
      if (match[2].charAt(column) === "C") result.push({ minute, row, column });
    }
  }
  return result;
}

export function castleAt(
  layout: string,
  minute: number,
  row: number,
  column: number,
): boolean {
  return visibleSandCastles(layout, minute).some(
    (spot) => spot.row === row && spot.column === column,
  );
}

// Deterministic first visible castle, tide-safe: only rows present in layout.
export function firstVisibleSandCastle(
  layout: string,
  minute: number,
): SandCastleCoordinate | null {
  return visibleSandCastles(layout, minute)[0] || null;
}

export function sandCastleAction(
  layout: string,
  minute: number,
  row: number,
  column: number,
  outcome: string,
  actionOutput: string,
): SandCastleAction | null {
  if (
    !["sand_castle_target", "sand_castle_fallback"].includes(outcome) ||
    !castleAt(layout, minute, row, column)
  ) return null;
  const line = String(actionOutput || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .find((s) =>
      /^(?:>\s*)?You carefully demolish the sand castle and comb the area into a nice flat sand parking lot\.?$/i.test(
        s,
      ),
    );
  return {
    kind: "sand_castle_action",
    coordinate: `${minute},${row},${column}`,
    source: "pre-action-layout-and-native-comb",
    verification: line ? "native-demolition-text" : "pre-action-castle-command-returned",
    evidence_text: line || null,
    classification: "CASTLE_ACTION_NOT_RARE_REWARD_OR_COOLDOWN",
  };
}
