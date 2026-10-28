/* eslint-disable eqeqeq */
// Pure offline route compiler. The MODEL contributes rankings, never coordinates
// or direct KoL actions. Only listed, tide-visible corpus tiles can be executed.
export interface RouteTile {
  minute: number;
  row: number;
  column: number;
}
export interface RouteCandidate {
  minute: number;
  utility: number | null;
  // Runtime candidates carry the canonical minute at candidate.minute;
  // representative carries only the row/column (and Hilbert metadata).
  // An optional minute is tolerated for older external fixtures, but if
  // supplied must agree with the canonical candidate minute.
  representative: Pick<RouteTile, "row" | "column"> & { minute?: number };
  watersheep: { score_mass: Record<string, number> } | null;
}
export interface ShadowRouteSnapshot {
  schema: string;
  generated_at: string;
  player_id: number;
  gameday: number;
  watersheep: { status: string };
  candidates: RouteCandidate[];
}
export const MAX_WATERSHEEP_ROUTE_COMBS = 100;

// Compiles an *already-scored* snapshot. Never requests model output or
// executes game actions here. A caller opts into paid combs explicitly.
export function compileWaterSheepRoute(
  snapshot: ShadowRouteSnapshot,
  corpus: RouteTile[],
  falseRares: Set<string>,
  playerId: number,
  gameday: number,
  usedFree: number,
  nowEpoch: number,
  requestedCombs: number,
  freeOnly: boolean,
): RouteTile[] {
  if (
    snapshot.schema !== "don-combo-matrix-runtime/v0.8-ts" ||
    snapshot.player_id !== playerId ||
    snapshot.gameday !== gameday ||
    snapshot.watersheep?.status !== "ready"
  )
    throw new Error("Shadow snapshot identity, day, or WaterSheep status invalid; refresh first.");
  const stamped = Date.parse(snapshot.generated_at) / 1000;
  if (!Number.isFinite(stamped) || stamped > nowEpoch + 30 || nowEpoch - stamped > 1200)
    throw new Error("Shadow snapshot expired (20 minutes); refresh the relay first.");
  if (!Number.isInteger(usedFree) || usedFree < 0)
    throw new Error("Invalid KoLmafia free beach counter.");
  if (
    !Number.isInteger(requestedCombs) ||
    requestedCombs < 1 ||
    requestedCombs > MAX_WATERSHEEP_ROUTE_COMBS
  )
    throw new Error("WaterSheep route count must be an integer from 1 to 100.");
  const remainingFree = Math.max(0, 11 - usedFree);
  if (freeOnly && (remainingFree === 0 || requestedCombs > remainingFree))
    throw new Error("Requested route exceeds available free beach combs.");
  const count = requestedCombs;
  if (!Array.isArray(snapshot.candidates) || snapshot.candidates.length < count)
    throw new Error("Insufficient scored candidate fronts for free-turn route.");
  const day = 1 + (gameday % 8);
  const hidden = 4 - Math.abs(4 - day);
  const known = new Set(
    corpus
      .filter(
        (t) =>
          Number.isInteger(t.minute) &&
          t.minute >= 1 &&
          t.minute <= 10000 &&
          Number.isInteger(t.row) &&
          t.row > hidden &&
          t.row <= 10 &&
          Number.isInteger(t.column) &&
          t.column >= 0 &&
          t.column <= 9 &&
          !falseRares.has(`${t.minute},${t.row},${t.column}`),
      )
      .map((t) => `${t.minute},${t.row},${t.column}`),
  );
  const selected: RouteTile[] = [];
  const seen = new Set<number>();
  let previousUtility = Infinity;
  for (const candidate of snapshot.candidates) {
    if (selected.length === count) break;
    if (
      !Number.isFinite(candidate.utility) ||
      candidate.utility == null ||
      !candidate.watersheep ||
      !candidate.representative
    )
      throw new Error("Unscored or invalid shadow candidate; refresh first.");
    if ((candidate.utility as number) > previousUtility + 1e-9)
      throw new Error("Shadow candidates are not in saved descending rank order.");
    previousUtility = candidate.utility as number;
    const t = candidate.representative;
    // The actual scorer emits { candidate.minute, representative:{d,x,y,row,column} }.
    // Never interpret an absent representative.minute as an invalid tile; bind
    // its row/column to the authoritative candidate.minute instead.
    if (t.minute !== undefined && t.minute !== candidate.minute)
      throw new Error(
        `Shadow rank ${selected.length + 1}: representative minute conflicts with candidate front ${candidate.minute}.`,
      );
    const key = `${candidate.minute},${t.row},${t.column}`;
    if (!known.has(key))
      throw new Error(
        `Shadow rank ${selected.length + 1}: front ${candidate.minute} tile ${t.row},${t.column} is not a tide-accessible, non-false coordinate from raretiles.json.`,
      );
    if (seen.has(candidate.minute))
      throw new Error(`Shadow rank ${selected.length + 1}: duplicate front ${candidate.minute}.`);
    seen.add(candidate.minute);
    selected.push({ minute: candidate.minute, row: t.row, column: t.column });
  }
  if (selected.length !== count) throw new Error("Not enough usable ranked candidates.");
  return selected;
}

// Backward-compatible legacy frozen relay route. It never authorizes paid combs.
export function compileShadowTop11(
  snapshot: ShadowRouteSnapshot,
  corpus: RouteTile[],
  falseRares: Set<string>,
  playerId: number,
  gameday: number,
  usedFree: number,
  nowEpoch: number,
): RouteTile[] {
  if (!Number.isInteger(usedFree) || usedFree < 0 || usedFree >= 11)
    throw new Error("No unused free beach combs remain.");
  return compileWaterSheepRoute(
    snapshot,
    corpus,
    falseRares,
    playerId,
    gameday,
    usedFree,
    nowEpoch,
    11 - usedFree,
    true,
  );
}
