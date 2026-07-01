import type { SprayRecordDraft } from "./schema";

/**
 * Validation thresholds. Code constants for the MVP; make these per-farm /
 * per-jurisdiction configurable in a later pass (architecture §P2).
 */
export const RULES = {
  /** Conservative drift limit; many labels cap around 10–15 mph. */
  maxWindMph: 10,
  /** Below this extraction confidence, route to human review. */
  minConfidence: 0.6,
  /** Sanity ceiling on a per-acre rate (any unit) to catch obvious misreads. */
  maxRate: 1000,
} as const;

export type Validation = { ok: boolean; issues: string[] };

/**
 * Check a draft against rules. Anything missing, out of range, or low-confidence
 * produces an issue — and any issue routes the submission to the review queue.
 */
export function validateRecord(draft: SprayRecordDraft): Validation {
  const issues: string[] = [];

  // Required for a compliant record.
  if (!draft.product) issues.push("Missing product name.");
  if (draft.rate == null) issues.push("Missing application rate.");
  if (!draft.field_block) issues.push("Missing field / block.");
  if (!draft.applied_at) issues.push("Missing application date.");

  // Range checks.
  if (draft.wind_speed != null && draft.wind_speed > RULES.maxWindMph) {
    issues.push(
      `Wind speed ${draft.wind_speed} mph exceeds the ${RULES.maxWindMph} mph limit.`,
    );
  }
  if (draft.rate != null && (draft.rate <= 0 || draft.rate > RULES.maxRate)) {
    issues.push(`Application rate ${draft.rate} is outside the expected range.`);
  }

  // REI/PHI window checks are placeholders until label data is wired in.

  // Low confidence always forces review.
  if (draft.confidence < RULES.minConfidence) {
    issues.push(
      `Low extraction confidence (${Math.round(draft.confidence * 100)}%).`,
    );
  }

  return { ok: issues.length === 0, issues };
}
