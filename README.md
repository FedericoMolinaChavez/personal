# federicomolina.com — Personal site

A [Next.js](https://nextjs.org) (App Router + TypeScript + Tailwind) site for a fractional
CTO specialising in AI and agent systems. Earth-tone design with a working **Stripe**
checkout for the $300 entry-point session and a **Cal.com** booking widget.

Three services are published on the page; only the cheapest has a public checkout. The
$2,500 audit and $4,000/mo retainer are deliberately scoped on a call and invoiced from
Stripe afterwards — a stranger buying either cold is a refund waiting to happen.

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
| `STRIPE_PRODUCT_ID` | Existing Stripe product the checkout price is attached to (default: `prod_Uy6BWUbniHJ4PF`). Must exist in the same Stripe account/mode as `STRIPE_SECRET_KEY`. |
| `SERVICE_PRICE_USD` | Price in USD for the public checkout (default: `300`). |
| `CONTACT_EMAIL` | Where payment / pitch notifications are sent (default: `federico@federicomolina.com`). |
| `NEXT_PUBLIC_BASE_URL` | Base URL for Stripe success/cancel redirects. |
| `NEXT_PUBLIC_CALCOM_LINK` | Cal.com event link, e.g. `yourhandle/consultation`. |

See `.env.local.example` for the full template.

### Stripe test checkout
Set `STRIPE_SECRET_KEY` to a test key, run the app, click **Book a session**, and pay with
the test card `4242 4242 4242 4242` (any future expiry, any CVC). You'll land on `/success`.

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
