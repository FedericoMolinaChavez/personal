import assert from "node:assert/strict";
import { test, afterEach } from "node:test";
import { sanitizeAttribution, getAttribution } from "../lib/marketing/attribution.ts";
import { getBuildPlanOffer } from "../lib/marketing/offers.ts";
import { summarizeScorecard, scorecardGroups } from "../lib/marketing/scorecard.ts";

const originalPrice = process.env.SERVICE_PRICE_USD;
const originalName = process.env.SERVICE_NAME;
afterEach(() => {
  if (originalPrice === undefined) delete process.env.SERVICE_PRICE_USD;
  else process.env.SERVICE_PRICE_USD = originalPrice;
  if (originalName === undefined) delete process.env.SERVICE_NAME;
  else process.env.SERVICE_NAME = originalName;
  delete globalThis.window;
  delete globalThis.sessionStorage;
});

test("campaign events discard arbitrary queries, personal fields and unknown routes", () => {
  assert.deepEqual(sanitizeAttribution({
    utm_source: "search", utm_campaign: "audit-2026", source_page: "/ai-systems-audit",
    email: "private@example.com", utm_medium: "private@example.com", session_id: "secret", project: "confidential",
  }), { utm_source: "search", utm_campaign: "audit-2026", source_page: "/ai-systems-audit" });
  assert.deepEqual(sanitizeAttribution({ source_page: "/tools/fields/private-id", utm_content: "x".repeat(81) }), {});
  assert.deepEqual(sanitizeAttribution(null), {});
});

test("first-touch attribution survives service navigation and new campaigns replace it", () => {
  const storage = new Map();
  globalThis.sessionStorage = { getItem: (key) => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) };
  globalThis.window = { location: { pathname: "/", search: "?utm_source=search&utm_campaign=audit" } };
  const first = getAttribution();
  window.location = { pathname: "/ai-systems-audit", search: "" };
  assert.deepEqual(getAttribution(), first);
  window.location = { pathname: "/fractional-cto", search: "?utm_source=referral" };
  assert.deepEqual(getAttribution(), { utm_source: "referral", source_page: "/fractional-cto" });
});

test("blocked or corrupt browser storage does not prevent attribution", () => {
  globalThis.window = { location: { pathname: "/fractional-cto", search: "?utm_source=referral" } };
  globalThis.sessionStorage = { getItem: () => { throw new Error("blocked"); } };
  assert.deepEqual(getAttribution(), { utm_source: "referral", source_page: "/fractional-cto" });
  globalThis.sessionStorage = { getItem: () => "invalid JSON" };
  assert.equal(getAttribution().source_page, "/fractional-cto");
});

test("entry price uses the same rounded cents for display and checkout", () => {
  delete process.env.SERVICE_PRICE_USD;
  delete process.env.SERVICE_NAME;
  assert.equal(getBuildPlanOffer().formattedPrice, "$500");
  process.env.SERVICE_PRICE_USD = "650.456";
  const offer = getBuildPlanOffer();
  assert.equal(offer.cents, 65046);
  assert.equal(offer.price, 650.46);
  assert.equal(offer.formattedPrice, "$650.46");
  for (const value of ["NaN", "-1", "0", "Infinity", "0.001", "1e30"]) {
    process.env.SERVICE_PRICE_USD = value;
    assert.throws(getBuildPlanOffer);
  }
});

test("scorecard counts unknowns separately without treating missing evidence as a pass", () => {
  assert.equal(scorecardGroups.flatMap((group) => group.checks).length, 30);
  assert.deepEqual(summarizeScorecard({}), { total: 30, confirmed: 0, gaps: [], unknown: 30 });
  const result = summarizeScorecard({ "0-0": "yes", "0-1": "no", "0-2": "unknown", "fake": "yes" });
  assert.equal(result.confirmed, 1);
  assert.equal(result.gaps.length, 1);
  assert.equal(result.unknown, 28);
});
