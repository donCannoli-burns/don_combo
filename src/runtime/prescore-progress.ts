// Pure, UI-only estimates for native gCLI WaterSheep pre-scoring.
// A candidate costs an assumed two seconds, rounded to the nearest 30 s.
// These are progress hints, not elapsed-time guarantees or action gates.
export const PRESCORE_ASSUMED_SECONDS_PER_TARGET = 2;
export const PRESCORE_ROUNDING_SECONDS = 30;

export function roundedPrescoreSeconds(remainingTargets: number): number {
  if (!Number.isFinite(remainingTargets) || remainingTargets <= 0) return 0;
  return (
    Math.round(
      (remainingTargets * PRESCORE_ASSUMED_SECONDS_PER_TARGET) / PRESCORE_ROUNDING_SECONDS,
    ) * PRESCORE_ROUNDING_SECONDS
  );
}

export function prescoreWaitPhrase(remainingTargets: number): string {
  if (!Number.isFinite(remainingTargets) || remainingTargets <= 0) return "complete";
  const rounded = roundedPrescoreSeconds(remainingTargets);
  if (rounded === 0) return "under 30 sec";
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded % 60;
  return `~${minutes} min ${seconds} sec`;
}

export interface PrescoreProgressNotice {
  rounded_remaining_seconds: number;
  message: string | null;
}

// A score completion triggers a printed status at a 30-second bucket change,
// or at each 10th completed candidate. The final status comes from the caller
// ONLY after snapshot validation and commit, not before.
export function prescoreProgressNotice(
  completed: number,
  total: number,
  lastPrintedRoundedSeconds: number,
): PrescoreProgressNotice {
  const left = Math.max(0, total - completed);
  const rounded = roundedPrescoreSeconds(left);
  if (
    !Number.isInteger(completed) ||
    !Number.isInteger(total) ||
    completed <= 0 ||
    total <= 0 ||
    completed >= total ||
    (rounded === lastPrintedRoundedSeconds && completed % 10 !== 0)
  ) {
    return { rounded_remaining_seconds: rounded, message: null };
  }
  return {
    rounded_remaining_seconds: rounded,
    message: `WaterSheep: pre-scoring ${completed}/${total} targets · please wait ${prescoreWaitPhrase(left)} remaining...`,
  };
}
