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

// KoLmafia's BeachManager parses a successful comb from the native
// "You comb" response. No HTTP/model text or guessed item delta is proof.
export function nativeBeachCombReceipt(output: string): boolean {
  return /\bYou comb\b/i.test(output);
}
