/** Restricted DonCombo model transport: no DNS, public IPs, or arbitrary paths. */
export const DEFAULT_WATERSHEEP_ENDPOINT = "http://127.0.0.1:8768/v1/kolmafia";
export const WATERSHEEP_ENDPOINT_PREF = "don_combo_watersheep_endpoint";

export function resolveWaterSheepEndpoint(value: string): string {
  if (value === "") return DEFAULT_WATERSHEEP_ENDPOINT;
  const match = /^http:\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):8768\/v1\/kolmafia$/.exec(value);
  if (!match)
    throw new Error(
      "Invalid WaterSheep endpoint: literal private IPv4, port 8768 and /v1/kolmafia required",
    );
  const parts = match[1].split(".");
  const bytes = parts.map(Number);
  if (parts.some((part, index) => String(bytes[index]) !== part || bytes[index] > 255))
    throw new Error("Invalid WaterSheep endpoint IPv4 octets");
  const [a, b, c, d] = bytes;
  const permitted =
    (a === 127 && b === 0 && c === 0 && d === 1) ||
    a === 10 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168);
  if (!permitted) throw new Error("WaterSheep endpoint must be loopback or RFC1918 private IPv4");
  return value;
}
