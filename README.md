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
| `SERVICE_NAME` | Product name shown at checkout (default: "Strategy Consultation"). |
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
