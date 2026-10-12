export const WATERSHEEP_EVIDENCE_CONTRACT = "don-combo-watersheep-evidence/v1" as const;

export type Truth = true | false | null;

export type EvidenceKind = "FACT" | "MODEL" | "POLICY";
export type EvidenceState = "known" | "unknown" | "withheld";

export interface EvidenceFact<T> {
  kind: EvidenceKind;
  name: string;
  state: EvidenceState;
  value: T | null;
  source: string;
}

export interface EvidenceRelation {
  relation: string;
  left: string;
  right: string;
  truth: Truth;
  basis: string;
}

export interface RuntimeRequestV1 {
  schema: "kol-runtime-request/v1";
  id: string;
  capability: "don-combo-matrix" | "excavator-smoke";
  action: "refresh" | "smoke";
  reason: string;
  authority: "none";
  event?: string;
  meta?: string;
  page?: string;
}

export interface RuntimeResponseV1 {
  schema: "kol-runtime-response/v1";
  id: string;
  status: "ok" | "offline" | "invalid";
  capability: RuntimeRequestV1["capability"];
  detail: string;
  generated_at: string;
  runtime_schema?: string;
  shadow_top_minute?: number | null;
  baseline_rank?: number | null;
}

export interface BeachTile {
  minute: number;
  row: number;
  column: number;
}

export interface RarePoint extends BeachTile {
  d: number;
  x: number;
  y: number;
  false_rare: boolean;
}

export interface ObservationEntry {
  layout_snapshots?: number;
  session_events?: number;
  symbols?: Record<string, number>;
  outcomes?: Record<string, number>;
  items?: Record<string, number>;
  last_seen_epoch?: number | null;
  last_seen_turn?: number | null;
  sources?: string[];
  last_layout?: string | null;
}

export interface ObservationLedger {
  schema: string;
  fronts: Record<string, ObservationEntry>;
  updated_at?: string | null;
}

export interface CandidateEvidence {
  minute_fraction: number;
  hilbert_bucket_256: number;
  distance_from_current: number | null;
  layout_snapshots: number;
  session_events: number;
  observation_count: number;
  last_seen_age_hours: number | null;
  last_seen_turn: number | null;
  observed_symbol_rates: Record<string, number>;
  observed_outcome_rates: Record<string, number>;
  sand_per_event: number;
  representative: { d: number; x: number; y: number; row: number; column: number };
}

export interface Candidate {
  minute: number;
  source: "combo-baseline" | "current" | "observed" | "explore";
  is_combo_baseline: boolean;
  evidence: CandidateEvidence;
  representative: { d: number; x: number; y: number; row: number; column: number };
  utility: number | null;
  utility_components: { model: number; exploration: number; observed: number } | null;
  watersheep: {
    score_mass: Record<string, number>;
    ms: number;
    calibration: "UNVALIDATED_FOR_KOL_BEACH";
  } | null;
}

export interface WaterSheepRequest {
  state: Record<string, unknown>;
  questions: {
    tile_class: {
      type: "choice";
      instructions: string;
      criteria: Record<string, string>;
    };
  };
}

export interface WaterSheepResponse {
  answers?: {
    tile_class?: {
      probabilities?: Record<string, number>;
    };
  };
  error?: string;
}

export function fact<T>(
  kind: EvidenceKind,
  name: string,
  state: EvidenceState,
  value: T | null,
  source: string,
): EvidenceFact<T> {
  return { kind, name, state, value, source };
}

export function relation(
  relationName: string,
  left: string,
  right: string,
  truth: Truth,
  basis: string,
): EvidenceRelation {
  return { relation: relationName, left, right, truth, basis };
}

export function decodeRuntimeRequest(raw: Record<string, string>): RuntimeRequestV1 {
  if (raw.schema !== "kol-runtime-request/v1")
    throw new Error("unsupported runtime request schema");
  if (!raw.id) throw new Error("runtime request id is required");
  if (raw.capability !== "don-combo-matrix" && raw.capability !== "excavator-smoke") {
    throw new Error("unsupported runtime capability");
  }
  if (raw.action !== "refresh" && raw.action !== "smoke") {
    throw new Error("unsupported runtime action");
  }
  if ((raw.authority || "none") !== "none") throw new Error("runtime request must be advisory");
  return {
    schema: "kol-runtime-request/v1",
    id: raw.id,
    capability: raw.capability,
    action: raw.action,
    reason: raw.reason || "manual",
    authority: "none",
    event: raw.event,
    meta: raw.meta,
    page: raw.page,
  };
}
