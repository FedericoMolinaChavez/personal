# Website page and conversion change plan

Reviewed: 2026-11-02.

Implementation update: the user approved this plan and the supported changes have been implemented locally. See `docs/qa/website-implementation.md` for delivered routes, validation and remaining provider/evidence limits. The original assessment below is retained as the planning record.

Scope: compare the supplied assessment with this repository and identify changes. This document proposes work; it does not change the website, prices, or published claims.

The user identifies federicomolina.com as the same website. Direct retrieval failed from this environment, including a DNS lookup failure, so current deployed content, visual behavior, and booking/payment operation remain unverified. Findings below are based on repository source.

## 1. Correct the starting assumptions

The assessment is useful as a direction, but several descriptions do not match the checked source:

- The hero says "I turn your idea into a product your users pay for." It does not use the underwater theme or the six production-failure scenarios.
- The current commercial offer is a $500 build plan with three working sessions or a basic MVP. The four offers at $300, $2,500, $5,000, and $4,000/month are absent from the marketing source.
- The portfolio lists Attribute.ai, The Nomad Hub, Annise, eNotary Log, and LocalSpot AI. The Cosmo case study and its reported 70% to 95% result are absent.
- There is no production-readiness scorecard in the checked routes or marketing components.
- A "name your price" form exists, so that recommendation applies directly.
- Analytics records booking-button clicks, checkout-button clicks, and form submission attempts. No completed-booking conversion tracking was found.

Treat the missing offers, scorecard, and case study as potential additions, not existing assets to polish. Do not replace the current offer or publish the supplied numerical result without confirming the underlying facts.

## 2. Recommended page structure

### `/` — personal consulting homepage

Purpose: introduce Federico, establish credibility, and help visitors choose the relevant service.

Changes:

1. State the audience and concrete business benefit in the opening screen. Keep founder-friendly language; the checked homepage does not have the technical jargon problem described in the assessment.
2. Put a primary "Book a free 15-minute call" action in the hero. Use the same label and destination in the navigation and contact section. The current hero has no action, while navigation "Hire Me" initiates checkout.
3. Add a short, factual proof section near the hero. Explain personal contribution and project outcomes rather than relying only on product descriptions and outbound links.
4. Make the two service paths visible: technical leadership for founders and AI systems work for teams. Link to their dedicated pages when those pages are ready.
5. Clarify the $500 offer: what is delivered, session length, turnaround, the boundary of a "basic MVP," exclusions, and whether the payment is credited toward later work. Credit is mentioned in checkout/schema copy but is less explicit in the visible offer section.
6. Reposition "Pitch Me" as "Custom engagement." Ask for an estimated budget range, desired outcome, and timeline; update form labels, confirmation copy, navigation, and notification wording together.

Suggested sequence: outcome and CTA → proof → service paths → selected work → working process → entry offer → custom engagement → booking.

### `/ai-systems-audit` — focused AI audit landing page

Status: new page, conditional on confirming that this is an offered service.

Audience: CTOs and engineering leaders with existing AI features or agents.

Suggested sections:

1. Clear outcome and the production problems the engagement addresses.
2. Fit and non-fit: operating system or prototype ready for review, access required, and limitations.
3. Scope: reliability, evaluation, retries and duplicate actions, context/retrieval, costs, observability, and security as applicable to the agreed engagement.
4. Deliverables: written findings, prioritized risks, recommended architecture changes, and a review session. Confirm these before publication.
5. Process, turnaround, and price. The supplied $2,500/two-week package is an unconfirmed proposal relative to this source.
6. Relevant evidence and FAQ.
7. Primary CTA: "Book a 15-minute scoping call." Secondary CTA: "See an example deliverable," only when one exists.

Keep campaign navigation focused. Do not add every homepage checkout, custom proposal, tool, and offer action to this page.

### `/fractional-cto` — founder-focused service landing page

Status: new page; consistent with existing site positioning, but package terms are not defined in the source.

Audience: founders needing senior technical decisions and delivery leadership.

Suggested sections:

1. Founder problems and business outcomes in plain language.
2. Responsibilities: roadmap, architecture decisions, hiring/vendor guidance, delivery oversight, and technical risk management, limited to services actually offered.
3. Working arrangement: availability, cadence, what is hands-on, and what remains with the client's team.
4. Relevant project evidence and process.
5. Scope, pricing basis, exclusions, and FAQ. Do not import the assessment's $4,000/month retainer automatically.
6. Primary CTA: "Book a free 15-minute call." Secondary CTA: "See relevant work."

### Case study pages — add when evidence is ready

Use `/work/[project]` for one or two projects with a supportable account of the problem, Federico's role, changes delivered, and observed results. Then link selected-work cards to these pages, with a separate external product link.

Do not publish the Cosmo accuracy claim solely because it appears in the pasted assessment. Confirm project identity, permission to disclose, evaluation method, sample, and whether before/after measurements are comparable.

### `/scorecard` — later, optional

This is a new feature in this repository. Build it after the service and booking paths are clear. Keep results free and offer an optional review of the visitor's three biggest risks. Define the checks and scoring method before implementation. It is not a prerequisite for the initial service pages.

### Existing `/success` and `/cancel` — complete the conversion journey

- `/success` currently displays payment and booking confirmation without checking a session. Show payment status based on verified checkout information and distinguish a paid engagement from a calendar booking. Add an actual next-step booking link where appropriate.
- `/cancel` should offer concrete links to resume the relevant offer or book a call, rather than only returning home.

No separate general contact or services-index page is necessary for this first pass; homepage sections and focused service pages can cover those needs.

## 3. Shared changes required when adding pages

- Give each landing page its own title, description, canonical URL, and social sharing metadata. Root metadata currently points to `/`; new routes must not inherit that homepage canonical unchanged.
- Add the public landing pages and case studies to the sitemap, which currently lists only the homepage.
- Make shared navigation work across routes. Existing links such as `#work`, `#offer`, and `#booking` assume a homepage section exists on the current route; use explicit homepage destinations or page-specific targets as appropriate.
- Carry service identity through scoping, booking, and any future checkout. Current checkout handles one configured service and price; new service buttons must not accidentally purchase the $500 offer.
- Track completed bookings separately from CTA clicks. Capture the source page and campaign attribution, and define qualification criteria before reporting qualified bookings. Do not send contact details or free-text project descriptions into analytics.
- Separate custom-form attempts from successful submissions; the existing submission event fires before the request succeeds.
- Verify mobile navigation, form feedback, calendar loading/failure behavior, and checkout recovery in the rendered site. Source review alone does not establish their usability.

## 4. Delivery order

1. Improve homepage outcome, primary CTA, proof, entry-offer scope, and custom engagement wording using established facts.
2. Confirm the audit and fractional CTO offer terms. Build the audit page first if it is the intended acquisition offer; otherwise start with the founder service already represented by the homepage.
3. Add page metadata, navigation, sitemap entries, attribution, and completed-booking measurement with the landing pages.
4. Verify the entire journey on desktop and mobile, including payment and booking as separate outcomes.
5. Add supported case studies, then consider the optional scorecard.

Advertising budget and keyword demand were not evaluated in this review. The assessment's scores are qualitative opinions, not measurements or baseline conversion data.

## 5. Main implementation locations

- Homepage assembly: `app/(marketing)/page.tsx`.
- Main content: `components/Hero.tsx`, `components/Projects.tsx`, `components/Offer.tsx`, `components/ReversePitch.tsx`, `components/Contact.tsx`.
- Navigation and actions: `components/Nav.tsx`, `components/ScheduleCallButton.tsx`, `components/HireMeButton.tsx`, `components/BookingEmbed.tsx`.
- Shared metadata and discovery: `app/layout.tsx`, `app/sitemap.ts`.
- New service routes: `app/(marketing)/ai-systems-audit/page.tsx`, `app/(marketing)/fractional-cto/page.tsx`.
- Conversion flow: `app/api/checkout/route.ts`, `app/api/webhook/route.ts`, `app/api/reverse-pitch/route.ts`, `app/(marketing)/success/page.tsx`, `app/(marketing)/cancel/page.tsx`.

Before implementation, read the installed Next.js guides required by AGENTS.md. This review made no code edits and ran no application tests.
