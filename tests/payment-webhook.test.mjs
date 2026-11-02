import assert from "node:assert/strict";
import { test, afterEach } from "node:test";
import { registerHooks, createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const moduleUrl = (source) => `data:text/javascript,${encodeURIComponent(source)}`;
globalThis.webhookTest = { event: null, emails: [], deliveryError: null, signatureError: false };
registerHooks({ resolve(specifier, context, nextResolve) {
  if (context.parentURL?.endsWith("/app/api/webhook/route.ts")) {
    if (specifier === "@/lib/stripe") return { url: moduleUrl(`export function getStripe() { return { webhooks: { constructEvent() { if (globalThis.webhookTest.signatureError) throw new Error("Invalid signature"); return globalThis.webhookTest.event; } } }; }`), shortCircuit: true };
    if (specifier === "resend") return { url: moduleUrl(`export class Resend { emails = { send: async (...args) => { globalThis.webhookTest.emails.push(args); return { error: globalThis.webhookTest.deliveryError }; } }; }`), shortCircuit: true };
    if (specifier === "next/server") return { url: pathToFileURL(require.resolve("next/server")).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
} });
const { POST } = await import("../app/api/webhook/route.ts");
const originalSecret = process.env.STRIPE_WEBHOOK_SECRET;
const originalResend = process.env.RESEND_API_KEY;
afterEach(() => {
  if (originalSecret === undefined) delete process.env.STRIPE_WEBHOOK_SECRET; else process.env.STRIPE_WEBHOOK_SECRET = originalSecret;
  if (originalResend === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = originalResend;
});

function setup(type, paymentStatus) {
  process.env.STRIPE_WEBHOOK_SECRET = "local-test-only";
  process.env.RESEND_API_KEY = "local-test-only";
  globalThis.webhookTest = {
    event: { type, data: { object: {
      id: "cs_local_test", payment_status: paymentStatus, amount_total: 50000,
      payment_intent: "pi_local_test", customer_details: { name: "<b>QA</b>", email: "qa@example.invalid" },
    } } }, emails: [], deliveryError: null, signatureError: false,
  };
  return new Request("http://localhost/api/webhook", { method: "POST", headers: { "stripe-signature": "local-mocked-signature" }, body: "local test" });
}

test("completed but unpaid checkout sends no payment receipt", async () => {
  const response = await POST(setup("checkout.session.completed", "unpaid"));
  assert.equal(response.status, 200);
  assert.equal(globalThis.webhookTest.emails.length, 0);
});

test("paid checkout and delayed-payment success use the same receipt deduplication key", async () => {
  for (const type of ["checkout.session.completed", "checkout.session.async_payment_succeeded"]) {
    const response = await POST(setup(type, "paid"));
    assert.equal(response.status, 200);
    assert.equal(globalThis.webhookTest.emails.length, 1);
    assert.equal(globalThis.webhookTest.emails[0][1].idempotencyKey, "payment-receipt:cs_local_test");
    assert.match(globalThis.webhookTest.emails[0][0].html, /&lt;b&gt;QA&lt;\/b&gt;/);
  }
});

test("unaccepted delivery requests a provider retry instead of acknowledging a receipt", async () => {
  const request = setup("checkout.session.completed", "paid");
  globalThis.webhookTest.deliveryError = { message: "Local rejection" };
  assert.equal((await POST(request)).status, 502);
});

test("invalid signatures cannot trigger a payment notification", async () => {
  const request = setup("checkout.session.completed", "paid");
  globalThis.webhookTest.signatureError = true;
  assert.equal((await POST(request)).status, 400);
  assert.equal(globalThis.webhookTest.emails.length, 0);
});
