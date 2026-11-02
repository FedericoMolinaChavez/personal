import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";

// Pass a Playwright module path when using an external/cached installation.
const { chromium } = await import(process.argv[2] ? pathToFileURL(process.argv[2]).href : "playwright");
const base = process.env.MARKETING_TEST_URL || "http://127.0.0.1:3002";
const output = process.env.MARKETING_SCREENSHOTS || "docs/qa/website";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const errors = [];
const page = await context.newPage();
if (process.env.MARKETING_MOCK_TURNSTILE === "1") {
  await page.addInitScript(() => {
    const widgets = new Map();
    window.turnstileTest = { renders: 0, removes: 0 };
    window.turnstile = {
      render(element, options) {
        const id = `local-mock-${++window.turnstileTest.renders}`;
        widgets.set(id, options);
        element.textContent = "Local verification mock";
        queueMicrotask(() => options.callback("local-mocked-token"));
        return id;
      },
      reset(id) { const options = widgets.get(id); if (options) queueMicrotask(() => options.callback("local-mocked-token")); },
      remove(id) { widgets.delete(id); window.turnstileTest.removes++; },
    };
  });
}
await page.emulateMedia({ reducedMotion: "reduce" });
page.on("pageerror", (error) => errors.push(error.message));
// Provider requests stay local to the test. No bookings, payments or emails are sent.
await context.route("https://**", (route) => route.abort());

try {
  for (const [path, name, title] of [
    ["/", "home", "AI ambition"],
    ["/ai-systems-audit", "audit", "Your AI works in a demo"],
    ["/fractional-cto", "cto", "Make the next technical decision"],
    ["/scorecard", "scorecard", "What have you checked"],
  ]) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    const response = await page.goto(base + path);
    assert.equal(response.status(), 200, path);
    await page.getByRole("heading", { level: 1 }).filter({ hasText: title }).waitFor();
    assert.equal(await page.locator("h1").count(), 1);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    assert.equal(new URL(canonical).pathname, path);
    assert.equal(new URL(await page.locator('meta[property="og:url"]').getAttribute("content")).pathname, path);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${path}: desktop overflow`);
    await page.screenshot({ path: `${output}/${name}-desktop.png` });
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${path}: mobile overflow`);
    await page.screenshot({ path: `${output}/${name}-mobile.png` });
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page.getByRole("link", { name: "Book a free 15-minute call", exact: true }).first().waitFor();
    await page.getByRole("button", { name: "Close", exact: true }).click();
    if (path === "/ai-systems-audit" || path === "/fractional-cto") {
      await page.getByRole("link", { name: "Book a 15-minute scoping call", exact: true }).click();
      await page.waitForURL(/#booking$/);
      assert.equal(new URL(page.url()).hash, "#booking");
      assert.equal(await page.evaluate(() => sessionStorage.getItem("consulting-booking-service")), path.slice(1));
      await page.locator("details summary").first().click();
      assert.equal(await page.locator("details").first().getAttribute("open"), "");
    }
  }

  await page.goto(base + "/scorecard");
  const fieldsets = page.locator("fieldset");
  await fieldsets.nth(0).getByLabel("Confirmed", { exact: true }).check();
  for (let index = 1; index <= 4; index++) await fieldsets.nth(index).getByLabel("Needs attention", { exact: true }).check();
  await page.getByRole("status").filter({ hasText: "1 of 30" }).waitFor();
  const risks = page.locator('aside input[type="checkbox"]');
  for (let index = 0; index < 3; index++) await risks.nth(index).check();
  assert.equal(await risks.nth(3).isDisabled(), true);
  const emailLink = await page.getByRole("link", { name: "Email my selected risks" }).getAttribute("href");
  assert.equal((new URL(emailLink).searchParams.get("body").match(/^- /gm) || []).length, 3);
  await page.getByRole("button", { name: "Reset my answers" }).click();
  await page.getByRole("status").filter({ hasText: "0 of 30" }).waitFor();

  await page.goto(base + "/?utm_source=qa&utm_campaign=website-check");
  await page.route("**/api/checkout", async (route) => {
    const payload = route.request().postDataJSON();
    assert.equal(payload.service, "build-plan");
    assert.equal(payload.attribution.utm_source, "qa");
    await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "Checkout unavailable for this test." }) });
  });
  await page.getByRole("button", { name: /Start the .* build plan/ }).click();
  await page.getByRole("alert").filter({ hasText: "Checkout unavailable for this test." }).waitFor();
  assert.equal(await page.getByRole("button", { name: /Start the .* build plan/ }).isEnabled(), true);

  await page.route("**/api/reverse-pitch", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true }) }));
  await page.getByLabel("Your name", { exact: false }).fill("Website QA");
  await page.getByLabel("Email", { exact: false }).fill("qa@example.invalid");
  await page.getByLabel("What do you need?", { exact: false }).fill("Local test only; no message should be delivered.");
  await page.getByLabel("Estimated budget range", { exact: false }).fill("Still deciding");
  // A configured challenge is not solved or bypassed; skip form success in that case.
  const challengeConfigured = await page.evaluate(() => !!document.querySelector('script[src*="challenges.cloudflare.com"]'));
  if (!challengeConfigured) {
    await page.getByRole("button", { name: "Request a custom engagement" }).click();
    await page.getByRole("heading", { name: "Enquiry received." }).waitFor();
    await page.getByRole("button", { name: "Send another" }).click();
    await page.getByLabel("Your name", { exact: false }).fill("Second local QA");
    await page.getByLabel("Email", { exact: false }).fill("qa@example.invalid");
    await page.getByLabel("What do you need?", { exact: false }).fill("Second local test; no message is delivered.");
    await page.getByLabel("Estimated budget range", { exact: false }).fill("Still deciding");
    await page.getByRole("button", { name: "Request a custom engagement" }).click();
    await page.getByRole("heading", { name: "Enquiry received." }).waitFor();
    if (process.env.MARKETING_MOCK_TURNSTILE === "1") {
      const lifecycle = await page.evaluate(() => window.turnstileTest);
      assert.ok(lifecycle.renders >= 2, "Verification widget remounted for the second form");
      assert.ok(lifecycle.removes >= 1, "Verification widget cleaned up after success");
    }
  }

  for (const [width, height, size] of [[1440, 1000, "desktop"], [390, 844, "mobile"]]) {
    await page.setViewportSize({ width, height });
    await page.goto(base + "/");
    for (const section of ["offer", "pitch", "booking"]) {
      await page.goto(base + "/#" + section);
      await page.waitForFunction(() => Math.abs(document.querySelector("header").getBoundingClientRect().top) < 2);
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.screenshot({ path: `${output}/${section}-${size}.png` });
      if (await page.locator(`#${section}`).evaluate((element) => element.offsetHeight > innerHeight - 100)) {
        await page.evaluate(() => window.scrollBy(0, innerHeight - 160));
        await page.screenshot({ path: `${output}/${section}-${size}-continued.png` });
      }
    }
    for (const route of ["success", "cancel"]) {
      await page.goto(base + "/" + route);
      await page.screenshot({ path: `${output}/${route}-${size}.png` });
    }
    await page.goto(base + "/scorecard");
    await page.locator("fieldset").nth(0).getByLabel("Needs attention", { exact: true }).check();
    await page.locator('aside input[type="checkbox"]').first().check();
    await page.locator("aside").evaluate((element) => element.scrollIntoView({ block: "start", behavior: "instant" }));
    await page.screenshot({ path: `${output}/scorecard-results-${size}.png` });
    if (!challengeConfigured) {
      await page.goto(base + "/#pitch");
      await page.getByLabel("Your name", { exact: false }).fill("Website QA");
      await page.getByLabel("Email", { exact: false }).fill("qa@example.invalid");
      await page.getByLabel("What do you need?", { exact: false }).fill("Local screenshot check only.");
      await page.getByLabel("Estimated budget range", { exact: false }).fill("Still deciding");
      await page.getByRole("button", { name: "Request a custom engagement" }).click();
      await page.getByRole("heading", { name: "Enquiry received." }).waitFor();
      assert.equal(await page.locator('[role="status"][tabindex="-1"]').evaluate((element) => element === document.activeElement), true);
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.screenshot({ path: `${output}/enquiry-success-${size}.png` });
    }
  }

  await page.goto(base + "/success");
  await page.getByRole("heading", { name: "Let's check your payment status." }).waitFor();
  assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
  await page.goto(base + "/cancel");
  await page.getByRole("link", { name: "Review the build plan" }).waitFor();

  const invalidCheckout = await context.request.post(base + "/api/checkout", { data: { service: "ai-systems-audit" } });
  assert.equal(invalidCheckout.status(), 400);
  const invalidEnquiry = await context.request.post(base + "/api/reverse-pitch", { data: null });
  assert.equal(invalidEnquiry.status(), 400);
  const missingFields = await context.request.post(base + "/api/reverse-pitch", { data: {} });
  assert.equal(missingFields.status(), 400);
  const sitemap = await context.request.get(base + "/sitemap.xml");
  for (const route of ["ai-systems-audit", "fractional-cto", "scorecard"]) assert.match(await sitemap.text(), new RegExp(route));
  assert.deepEqual(errors, []);
  console.log("PASS: 4 routes at desktop/mobile widths, navigation, metadata, checklist, checkout recovery, enquiry validation, payment status and sitemap.");
  if (challengeConfigured) console.log("Enquiry success UI skipped: live anti-bot challenge configured. No challenge was solved.");
} finally {
  await browser.close();
}
