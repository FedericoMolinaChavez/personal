# CTO + AI — Personal site

A [Next.js](https://nextjs.org) (App Router + TypeScript + Tailwind) portfolio for a
fractional CTO / AI developer. Earth-tone design with a working **Stripe** checkout
("Hire Me") and a **Cal.com** booking widget ("Book a Consultation").

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v3 (custom Material-3 earth-tone theme in `tailwind.config.ts`)
- Stripe Checkout (server route at `app/api/checkout/route.ts`)
- Cal.com inline embed (`@calcom/embed-react`)

## Local development

```bash
npm install
cp .env.local.example .env.local   # then edit values (see below)
npm run dev                        # http://localhost:3000
```

The site runs without any keys ("placeholder mode"): the Hire Me button shows a friendly
"not configured yet" note and the booking widget shows a placeholder calendar. Fill in the
env vars to make them live.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | Stripe secret key (test: `sk_test_…`). Enables checkout. |
| `SERVICE_NAME` | Product name shown at checkout (default: "Build Plan & MVP Sprint"). |
| `SERVICE_PRICE_USD` | Price in USD for the single service (default: `500`). |
| `NEXT_PUBLIC_BASE_URL` | Base URL for Stripe success/cancel redirects. |
| `NEXT_PUBLIC_CALCOM_LINK` | Cal.com event link, e.g. `yourhandle/consultation`. |

See `.env.local.example` for the full template.

### Stripe test checkout
Set `STRIPE_SECRET_KEY` to a test key, run the app, click **Hire Me**, and pay with the test
card `4242 4242 4242 4242` (any future expiry, any CVC). You'll land on `/success`.

### Cal.com
Create a free account at [cal.com](https://cal.com), add an event type, and set
`NEXT_PUBLIC_CALCOM_LINK` to `username/event-slug`.

## Deploy to Vercel
1. Push this repo to GitHub (already at `FedericoMolinaChavez/personal`).
2. In [Vercel](https://vercel.com/new), import the repo — Next.js is auto-detected.
3. Add the environment variables above in **Project → Settings → Environment Variables**
   (set `NEXT_PUBLIC_BASE_URL` to your production domain).
4. Deploy. Every push to `master` triggers a new deployment.

## Production build (local)
```bash
npm run build
npm start
```

## Consulting pages and conversion checks

- `/`: homepage, service selection, entry build plan, custom enquiry and booking.
- `/ai-systems-audit`: focused engineering-leader landing page.
- `/fractional-cto`: founder-focused technical leadership page.
- `/scorecard`: free 30-check self-assessment; optional selected-risk email draft.
- `/success` and `/cancel`: verified payment status and recovery, distinct from calendar booking.

The entry-offer price is shared by the offer component and checkout through
`lib/marketing/offers.ts`. Audit and CTO fees are scoped on the initial call;
adding a landing page does not create another purchasable Stripe service.
When Cal.com is unconfigured, the booking section offers email instead.

On Node 24, run the marketing and payment checks:

```powershell
node --test tests/marketing.test.mjs tests/payment.test.mjs tests/payment-webhook.test.mjs
```

With a local preview and Playwright available, run
`node scripts/verify-marketing.mjs` (or pass an installed Playwright `index.mjs`
path as the first argument). This checks desktop/mobile behavior with external
provider requests blocked. See `docs/qa/website-implementation.md` for scope,
screenshots, analytics semantics and remaining live acceptance checks.
