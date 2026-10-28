// Deliberately independent of the exploratory pool classifier: expanding
// model labels must never silently expand this opt-in data-sharing policy.
// The exact native bottle match mirrors bottle-observer.ts.
const SHAREABLE_SCARCE_ITEMS = new Set([
  "piece of driftwood",
  "rainbow pearl",
  "meteorite fragment",
  "cursed pirate cutlass",
  "cursed swash buckle",
  "cursed tricorn hat",
]);

function nativeBottleSeen(output: string): boolean {
  return String(output || "")
    .split(/\\r?\\n/)
    .some((line) => /^\\s*(?:>\\s*)?You found a message in a bottle!\\s*$/i.test(line.trim()));
}

// The only data leaving the character via Kmail: timestamp + beach coordinate.
// Sender identity is still visible in KoL Kmail transport metadata.
export const LIVE_RARE_SHARE_RECIPIENT = "3773192";
export const LIVE_RARE_SHARE_PREF = "don_combo_share_data";
export const LIVE_RARE_SHARE_HEADER = "don_combo_live_rare_v1\ntimestamp_utc,minute,row,column";
const MAX_KMAIL_CHARS = 1200;

export interface LiveRareShareRow {
  timestamp_utc: string;
  minute: number;
  row: number;
  column: number;
}

export interface LiveRareActionEvidence {
  minute: number;
  row: number;
  column: number;
  pre_action_layout: string;
  outcome: string;
  items: Readonly<Record<string, number>>;
  action_output: string;
  observed_at_utc: string;
}

// Only freshly executed COMB results are admitted. Never read or replay
// the persistent ML event file, saved rare catalogue or session history.
// A twinkle alone can be infrequent: it is NOT enough to claim a scarce tile.
export function liveRareFromAction(e: LiveRareActionEvidence): LiveRareShareRow | null {
  const { minute, row, column } = e;
  if (!Number.isInteger(minute) || minute < 1 || minute > 10000) return null;
  if (!Number.isInteger(row) || row < 1 || row > 10) return null;
  if (!Number.isInteger(column) || column < 0 || column > 9) return null;
  const parsedTime = Date.parse(e.observed_at_utc);
  if (!Number.isFinite(parsedTime) || new Date(parsedTime).toISOString() !== e.observed_at_utc)
    return null;
  const pieces = String(e.pre_action_layout).split(",");
  const line = pieces.find((x) => x.startsWith(`${row}:`));
  const grid = line?.split(":")[1] || "";
  if (!/^[A-Za-z?]{10}$/.test(grid)) return null;
  const tile = grid.charAt(column);
  // No already-combed sand, castle or whale overlays. A genuine positive
  // scarce-only item delta is allowed on r when twinkle vision is missing.
  if (tile !== "r" && tile !== "t") return null;
  if (e.outcome === "whale" || e.outcome.startsWith("sand_castle")) return null;
  const scarceItemFound = Object.entries(e.items).some(
    ([name, count]) =>
      count > 0 &&
      SHAREABLE_SCARCE_ITEMS.has(name.trim().toLowerCase().replace(/\\s+/g, " ")),
  );
  const bottleFound = nativeBottleSeen(e.action_output);
  if (!scarceItemFound && !bottleFound) return null;
  return { timestamp_utc: e.observed_at_utc, minute, row, column };
}

// Kmail lines contain ONLY four fixed fields; no player/run IDs, item
// names, inventory, exact layout, native output or session source.
export function liveRareKmailBatches(rows: ReadonlyArray<LiveRareShareRow>): string[] {
  const seen = new Set<string>();
  const messages: string[] = [];
  let batch = LIVE_RARE_SHARE_HEADER;
  for (const r of rows) {
    if (
      !Number.isInteger(r.minute) || r.minute < 1 || r.minute > 10000 ||
      !Number.isInteger(r.row) || r.row < 1 || r.row > 10 ||
      !Number.isInteger(r.column) || r.column < 0 || r.column > 9 ||
      !Number.isFinite(Date.parse(r.timestamp_utc)) ||
      new Date(Date.parse(r.timestamp_utc)).toISOString() !== r.timestamp_utc
    ) continue;
    const key = `${r.minute},${r.row},${r.column}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const line = `${r.timestamp_utc},${r.minute},${r.row},${r.column}`;
    if (batch.length + 1 + line.length > MAX_KMAIL_CHARS) {
      if (batch === LIVE_RARE_SHARE_HEADER) throw new Error("Share row too large.");
      messages.push(batch);
      batch = LIVE_RARE_SHARE_HEADER;
    }
    batch += `\n${line}`;
  }
  if (batch !== LIVE_RARE_SHARE_HEADER) messages.push(batch);
  return messages;
}
