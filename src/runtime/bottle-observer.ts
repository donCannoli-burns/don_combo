// Beach scarce-tile message is a NON-INVENTORY encounter, not a
// KoL item delta. Keep it pool-unassigned pending empirical identification.
// r28508 logs: "> You found a message in a bottle!"
export const BOTTLE_SCHEMA = "don-combo-beach-bottle/v0.1" as const;
export interface BottleObservation {
  schema: typeof BOTTLE_SCHEMA;
  kind: "message_in_a_bottle";
  source: "native-cli-command-output";
  evidence_text: "You found a message in a bottle!";
  pool: "unassigned";
  tier: "unassigned";
  attribution: "actual-comb-coordinate";
  // A small, symmetric feature weight, NOT probability or two reward events.
  weak_pool_context: { pool_1: 0.1; pool_2: 0.1 };
}
export function parseBottleOutput(output: string): BottleObservation[] {
  // Match the standalone observed success line, not a string describing a
  // failure or the command used. Do not confuse Ocean City fishing items.
  const found = String(output || "")
    .split(/\r?\n/)
    .some((line) => /^\s*(?:>\s*)?You found a message in a bottle!\s*$/i.test(line.trim()));
  return found
    ? [
        {
          schema: BOTTLE_SCHEMA,
          kind: "message_in_a_bottle",
          source: "native-cli-command-output",
          evidence_text: "You found a message in a bottle!",
          pool: "unassigned",
          tier: "unassigned",
          attribution: "actual-comb-coordinate",
          weak_pool_context: { pool_1: 0.1, pool_2: 0.1 },
        },
      ]
    : [];
}
