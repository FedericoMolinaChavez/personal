# Consulting website implementation

Date: 2026-11-02. Scope: approved `website-change-plan.md` implementation in the local repository. No deployment, real payment, calendar booking or external email was performed.

## Repository provenance discovered before push

The implementation used the existing local checkout at `74e602f`. Fetching before push revealed that remote `master` had advanced to `2b320e8`, including an underwater marketing design, blog, four-offer pricing and an existing scorecard. Those remote changes were absent from the checkout inspected during implementation. The resulting local changes are being preserved on `codex/website-service-pages`, not applied over remote `master`. Reconcile the intended improvements with that newer implementation before merging; this branch's design, pricing and missing-evidence observations describe its older local base, not the current remote site.

## Shipped locally

- Homepage outcome, hero booking action, near-top existing project links and two service paths.
- `/ai-systems-audit` and `/fractional-cto`, with audience, scope, process, deliverables, FAQs and focused scoping actions. Fees and schedules are agreed before work; no unconfirmed audit or retainer prices are published.
- A free `/scorecard` with 30 authored checks across six areas. Confirmed checks, gaps and unknowns are counted separately. There is no readiness threshold or certification claim. Visitors can optionally select up to three gaps for an email draft; no email gate or automatic transmission is introduced. Answers reset on reload, as stated in the interface.
- Clearer entry-offer boundaries, with one price source shared by the page and Stripe checkout. Existing configured/default $500 price retained.
- Custom engagement wording, budget-range field, native form validation, provider acceptance checks, separate attempt/success analytics, legible placeholders and focused/announced confirmation.
- Verification widget cleanup and remount after success, including the Send another path.
- Responsive navigation, cross-route destinations, page-specific canonical/social metadata and sitemap entries.
- Lazy calendar loading, optional email fallback and client-side accepted/requested booking event handling.
- Provider-verified payment confirmation, separate pending/expired/unverified states and checkout recovery. Paid staff notifications exclude pending payments and use a stable provider idempotency key.

The unsupported Cosmo result and role-specific case-study claims were not added. Existing project descriptions remain the evidence available in the source.

## Validation

- Production build succeeded, including static generation of the new routes. A final build is recorded below after review corrections.
- Twelve Node tests passed: campaign-data filtering, attribution persistence/storage failures, consistent entry pricing, scorecard unknowns, paid/pending/expired/unrelated/unavailable payment states, malformed session parameters, signed-event failure, pending-payment notification exclusion, delayed-payment notification identity, HTML escaping and rejected notification delivery.
- Headless Chrome checks passed at 1440×1000 and 390×844 for all four public pages. Checks include horizontal overflow, one main heading, canonical/social URLs, responsive menus, scoping anchors, FAQ behavior, checklist interactions/three-risk limit, mocked checkout failure recovery, mocked enquiry completion, invalid API inputs, no-session payment handling and sitemap entries.
- A second browser run used a temporary process-only fake verification key and an in-page Turnstile mock. Two consecutive mocked enquiries passed, with widget cleanup and remount asserted. No real challenge was solved and no message was sent.
- TypeScript and targeted lint checks passed. The shared layout retains two pre-existing external-font lint warnings; the targeted changed-flow check has no errors.
- Impeccable detector returned `[]` (exit 0). Later review corrections were checked by the reviewer and regression tests; the detector was not rerun under the skill's single-pass rule.

Reproduce the unit checks with Node 24:

```powershell
node --test tests/marketing.test.mjs tests/payment.test.mjs tests/payment-webhook.test.mjs
```

Browser checks use `scripts/verify-marketing.mjs`. With Playwright available, run `node scripts/verify-marketing.mjs`; alternatively pass an absolute path to an installed Playwright `index.mjs`. `MARKETING_TEST_URL` changes the local target. External provider requests are blocked by the test. For the optional verification regression, run a local preview with a fake `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, set `MARKETING_MOCK_TURNSTILE=1` for the test process, and direct `MARKETING_SCREENSHOTS` to a separate, clearly labeled mock-capture folder. Do not change production configuration for that test.

## Visual evidence and review

- Normal desktop/mobile screenshots: `docs/qa/website/`.
- Explicitly mocked verification screenshots: `docs/qa/website-turnstile-mock/`.
- Below-fold checkpoints are viewport captures, with continued views where needed. Reduced-motion preference prevents scroll animation during captures; navigation is not hidden or restyled.
- The finish reviewer requested valid recaptures and then identified the verification remount issue. The resulting correction was tested as described above. Final reviewer disposition is recorded below.
- No image comp or new identity was introduced. This extends the established implementation and approved page structure. Existing portrait and project assets were preserved; screenshots are QA evidence rather than production imagery.

## Measurement and live acceptance limits

- `schedule_call_click` and `hire_me_click` are actions, not completions.
- `booking_completed` is emitted for an accepted Cal.com callback without an outstanding payment requirement; `booking_requested` records other successful-request callbacks. Full booking payloads, contact fields, meeting links and booking IDs are not sent to analytics. Browser storage provides per-session deduplication when available.
- Booking callbacks are client signals, not server-authoritative reconciliation. Live event receipt in Cal.com/Vercel and completed booking behavior require provider acceptance checks. External-calendar completions do not return an embedded callback.
- `custom_engagement_attempt` and `custom_engagement_submitted` distinguish attempted and accepted submissions. Form success tests mock delivery; actual inbox receipt is unverified.
- `build_plan_paid` renders only after server verification and is deduplicated per browser session. It is not a replacement for Stripe's payment records and can be missed if the buyer does not return from checkout.
- Qualified bookings remain a separate manual decision; no qualification definition or qualified-conversion count is invented.
- The published domain could not be retrieved from this environment during the initial assessment. Local implementation/build validation does not establish deployment or live site acceptance.

Turnstile lifecycle methods were checked against [Cloudflare's client rendering documentation](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/). Local Next.js 16 guides and installed Cal.com types informed implementation.

## Final checks

- Final production build: passed after all review corrections; all 32 generated pages completed, with the payment-status route rendered dynamically.
- Final TypeScript and targeted lint checks: passed.
- Finish review: the full review reached the quality level of the inherited direction and requested the verification lifecycle fix. The subsequent verdict scored that fix resolved and returned `ship`; that final verdict is scoped to the scored fix.
- Normal local preview restored after the temporary verification mock; no fake key was written to project configuration.
- Deployment and real provider acceptance remain unperformed, as described above.
