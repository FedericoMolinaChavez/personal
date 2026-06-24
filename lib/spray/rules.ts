/**
 * P2 — validation layer: rate within label max, wind within limits, REI/PHI
 * windows. Out-of-range/uncertain results route to the review queue. Stub.
 */
export async function validateRecord(): Promise<{
  ok: boolean;
  issues: string[];
}> {
  throw new Error("spray.validateRecord not implemented");
}
