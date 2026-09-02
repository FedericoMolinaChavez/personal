# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two primary buyers, reached by the same page:

1. **Funded startup CTO / VP Eng.** Already runs an LLM or agent system in production with real traffic. It passed the demo and now misbehaves — cost, latency, silent failure, unbounded token spend, or a security surface nobody reviewed. They have budget and authority. They are evaluating a peer, not shopping a vendor, and they will discount anything that reads as marketing rather than engineering.
2. **Non-technical or solo founder.** Shipped fast with Cursor, v0, Replit, Lovable, or Bolt. Suspects the result is fragile or insecure but cannot name what is wrong. Needs the problem translated before they can buy the fix. Arrives anxious, not authoritative.

The page must serve both without condescending to the first or losing the second.

## Product Purpose

A fractional CTO practice, sold as a website. The site is the entire sales surface: it explains the specialism, publishes prices, and converts a stranger into a booked conversation. Success is a booked 15-minute call from a visitor who arrived cold.

## Positioning

Narrow on purpose: LLM and agent systems that shipped fast and can no longer be trusted — orchestration, context and memory, token cost, production failure modes, and the security of the app surrounding the model. Not general full-stack work.

Two claims a neighboring consultancy could not truthfully copy:

- **Prices are published up front.** Three tiers, in USD, no discovery call required to learn a number. The $300 session has a real self-serve checkout.
- **Operator, not just advisor.** Federico built and shipped his own products, including one multi-agent product (The Nomad Hub) taken to market solo and shut down after one paying customer. Killing his own product is proof of judgment, not a gap in the record.

A third differentiator: **Pitch Me** reverses the hiring direction — the visitor describes the work and names their own price.

## Operating Context

- **Arrival is cold.** Most traffic comes from Apollo outbound sequences and LinkedIn content. The visitor has no relationship, little patience, and one click to leave. The page has to establish credibility from close to zero, in the first viewport.
- Evaluated on a laptop between meetings, often skimmed rather than read.
- Booking runs through an inline Cal.com embed on the page; payment runs through Stripe Checkout.
- Apollo's website tracker de-anonymizes company-level visits, so the page is also a signal-generating surface for outbound follow-up.

## Capabilities and Constraints

- Next.js 16 (App Router) + React 19 + TypeScript, Tailwind CSS v3, deployed on Vercel.
- **Primary conversion: the free 15-minute call** (Cal.com). The $300 Stripe checkout is the secondary, self-serve path.
- Three published offers, fixed and factual: Technical Strategy Session $300 / 90 min; AI Systems Architecture Audit $2,500 / two weeks fixed scope; Fractional CTO retainer $4,000 per month, ~20 hrs, cancel with 30 days. Only the $300 tier has a public checkout — the other two are deliberately scoped on a call first.
- Legal disclosure is mandatory and must stay adjacent to prices and checkout: payments processed by Nomad Hub Holdings Inc; federicomolina.com is a trading name of that entity. Registered address and Terms link in the footer.
- Existing functional surfaces the redesign must keep reachable and working: `/scorecard` (ungated production-readiness diagnostic, no email required to see a score), the Pitch Me form (`/api/reverse-pitch`, honeypot + optional Cloudflare Turnstile), the Cal.com embed, Stripe checkout, and `/tools` (a separate dark "Command" themed app with its own visual world — out of scope, but the link stays).
- The `/tools` app's dark theme is scoped by `.command-theme` and must not be affected by any marketing-side change.
- Site runs without API keys in "placeholder mode"; checkout and booking degrade to friendly notices. Those states must stay legible.

## Brand Commitments

- Name and wordmark: **Federico Molina**. Trading name federicomolina.com.
- Voice: plain, technical, unhyped, willing to state what went wrong. Concrete over aspirational. Admits the shutdown rather than hiding it. No growth-marketing register.
- Real portrait asset at `public/portrait.jpg`.
- No commitment to the incumbent earth-tone / Material-3 palette — it is evidence of what the site is, not authority over what it becomes.

## Evidence on Hand

Real:
- Five shipped products with live URLs: Attribute.ai (~500K leads attributed per month), The Nomad Hub (multi-agent relocation planner, built solo, shut down after one paying customer, kept live as a case study), Annise (fintech/wealth), eNotary Log (legal tech/notary), LocalSpot AI (restaurant marketing).
- Eight years building and running production systems.
- The scorecard: a real diagnostic built from the same checklist used in a paid audit.
- Portrait photograph.
- LinkedIn and GitHub profiles.

Absent — must never be fabricated:
- **No client testimonials, no client logos, no named references, no case-study metrics beyond the ~500K figure.** Credibility has to be carried by specificity of thinking and the shipped-product list, not by social proof that does not exist.
- No press, no certifications, no team.

## Product Principles

1. **Specificity is the proof.** With no testimonials and no logos, the only credibility available is demonstrating that he understands the reader's failure mode better than they can articulate it. Show the problem precisely; the diagnosis is the credential.
2. **Publish the number.** Price transparency is a position, not a detail. Anything that hides a price to force a conversation contradicts the practice.
3. **Own the shutdown.** The killed product is an asset. Never soften it into a success.
4. **Narrow beats broad.** Refusing general work is the differentiator; the page should read as a specialist's, not a generalist's.
5. **Cold reader, first viewport.** Assume no prior relationship and no scroll patience. What this is, why it matters, and how to start a conversation must land immediately.

## Accessibility & Inclusion

No product-specific standard established beyond the craft floor. The audience skims on laptops; legibility at speed and keyboard-reachable primary actions are the operative needs.
