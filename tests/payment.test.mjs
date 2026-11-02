import assert from "node:assert/strict";
import { test } from "node:test";
import { registerHooks } from "node:module";

// The app resolves extensionless TS imports through its bundler. Teach Node's
// native test loader that one local dependency without changing app config.
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier === "./attribution" && context.parentURL?.endsWith("/lib/marketing/payment.ts")) {
    return { url: new URL("../lib/marketing/attribution.ts", import.meta.url).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
} });
const { verifyBuildPlanPayment } = await import("../lib/marketing/payment.ts");

const sessionId = "cs_test_1234567890abcdefghij";
const paid = { id: sessionId, mode: "payment", status: "complete", payment_status: "paid", amount_total: 50000, currency: "usd", metadata: { service: "build-plan", source_page: "/ai-systems-audit", utm_source: "search", email: "private@example.invalid" } };

test("payment confirmation requires provider evidence and exposes no customer fields", async () => {
  assert.deepEqual(await verifyBuildPlanPayment(sessionId, async () => paid), {
    status: "paid", id: sessionId, amount: 500, currency: "usd",
    attribution: { source_page: "/ai-systems-audit", utm_source: "search" },
  });
});

test("pending, expired, unrelated and unavailable sessions never display paid confirmation", async () => {
  assert.deepEqual(await verifyBuildPlanPayment(sessionId, async () => ({ ...paid, payment_status: "unpaid" })), { status: "pending" });
  assert.deepEqual(await verifyBuildPlanPayment(sessionId, async () => ({ ...paid, payment_status: "unpaid", status: "expired" })), { status: "expired" });
  assert.deepEqual(await verifyBuildPlanPayment(sessionId, async () => ({ ...paid, metadata: { service: "another-service" } })), { status: "unverified" });
  assert.deepEqual(await verifyBuildPlanPayment(sessionId, async () => ({ ...paid, mode: "subscription" })), { status: "unverified" });
  assert.deepEqual(await verifyBuildPlanPayment(sessionId, async () => { throw new Error("provider unavailable"); }), { status: "unverified" });
  assert.deepEqual(await verifyBuildPlanPayment(sessionId, null), { status: "unverified" });
});

test("missing, malformed and repeated session parameters do not trigger provider calls", async () => {
  let calls = 0;
  for (const value of [undefined, null, "", "not-a-session", [sessionId, sessionId], { id: sessionId }]) {
    assert.deepEqual(await verifyBuildPlanPayment(value, async () => { calls++; return paid; }), { status: "unverified" });
  }
  assert.equal(calls, 0);
});
