// Pure guards for the Beach Comb choice/action boundary.
// Tested offline; no KoL I/O or model inference lives in this module.
export function beachChoiceReady(
  handlingChoice: boolean,
  beachCombing: boolean,
  currentMinute: number,
  expectedMinute: number,
  activeChoice: number,
): boolean {
  return (
    handlingChoice &&
    activeChoice === 1388 &&
    beachCombing &&
    Number.isInteger(expectedMinute) &&
    expectedMinute >= 1 &&
    expectedMinute <= 10000 &&
    currentMinute === expectedMinute
  );
}

type NativeCombEvidence = {
  beforeLayout: string;
  afterLayout: string;
  beforeMinute: number;
  afterMinute: number;
  expectedMinute: number;
  row: number;
  column: number;
  freeBefore: number;
  freeAfter: number;
  adventuresBefore: number;
  adventuresAfter: number;
  freeOnly: boolean;
};

export type VerifiedCombTransition = {
  verified: boolean;
  reason: string;
  spend: "free" | "paid" | null;
  tileFlipped: boolean;
};

// KoLmafia BeachManager.parseCombUsage updates a non-combed tile to 'c'
// only on a successful COMB server response. Already-combed tiles cannot
// flip again, so a single verifiable resource debit is also required.
// This accepts no positive evidence from untrusted console/model text.
export function verifyBeachCombTransition(e: NativeCombEvidence): VerifiedCombTransition {
  const failed = (reason: string): VerifiedCombTransition => ({
    verified: false,
    reason,
    spend: null,
    tileFlipped: false,
  });
  if (
    !Number.isInteger(e.row) ||
    e.row < 1 ||
    e.row > 10 ||
    !Number.isInteger(e.column) ||
    e.column < 0 ||
    e.column > 9 ||
    !Number.isInteger(e.expectedMinute) ||
    e.expectedMinute < 1 ||
    e.expectedMinute > 10000 ||
    e.beforeMinute !== e.expectedMinute ||
    e.afterMinute !== e.expectedMinute
  )
    return failed("coordinate-or-minute-mismatch");
  if (
    !Number.isInteger(e.freeBefore) ||
    !Number.isInteger(e.freeAfter) ||
    e.freeBefore < 0 ||
    e.freeAfter < 0 ||
    e.freeBefore > 11 ||
    e.freeAfter > 11 ||
    !Number.isInteger(e.adventuresBefore) ||
    !Number.isInteger(e.adventuresAfter) ||
    e.adventuresBefore < 0 ||
    e.adventuresAfter < 0
  )
    return failed("invalid-resource-counters");

  const freeSpent =
    e.freeAfter === e.freeBefore + 1 && e.adventuresAfter === e.adventuresBefore;
  const paidSpent =
    e.freeAfter === e.freeBefore && e.adventuresAfter === e.adventuresBefore - 1;
  if (e.freeOnly ? !freeSpent : !freeSpent && !paidSpent)
    return failed("no-exactly-one-verified-spend");

  const tileAt = (layout: string): string | null => {
    for (const part of layout.split(",")) {
      const match = /^(\d+):([A-Za-z?]{10})$/.exec(part);
      if (match && Number(match[1]) === e.row) return match[2].charAt(e.column);
    }
    return null;
  };
  const before = tileAt(e.beforeLayout);
  const after = tileAt(e.afterLayout);
  if (before === null || after !== "c") return failed("no-target-tile-confirmation");
  return {
    verified: true,
    reason: before === "c" ? "single-spend-already-combed" : "single-spend-tile-flipped",
    spend: freeSpent ? "free" : "paid",
    tileFlipped: before !== "c",
  };
}
