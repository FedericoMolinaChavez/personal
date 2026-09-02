---
version: 1
slug: "app-marketing-page-tsx"
primary_target: "app/(marketing)/page.tsx"
related_targets: ["components/Hero.tsx","components/Thermocline.tsx","components/Projects.tsx","components/Offer.tsx","components/dive/DepthRail.tsx","components/dive/Lamp.tsx"]
---

## Scope & mode

The marketing landing page (`app/(marketing)/page.tsx`) and its sections. Visitor mode: **Persuade** — the visitor decides and acts; design is the product. Sibling marketing routes (`/scorecard`, `/terms`, `/success`, `/cancel`) are out of scope and inherit the palette through remapped legacy tokens. `/tools` keeps its own "Command" world.

## Audience & job

Two buyers on one page. A funded startup CTO or VP Eng whose agent system already runs in production and misbehaves, and a non-technical or solo founder who shipped fast with Cursor/v0/Lovable and suspects the result is fragile. Traffic is mostly cold — Apollo outbound and LinkedIn — so the page has to establish credibility from near zero inside the first viewport, for a reader who skims.

## Action

Primary: **book the free 15-minute call** (Cal.com, `#booking`). Secondary: the $300 Stripe checkout, the only self-serve purchase. Tertiary: the ungated scorecard, and the Pitch Me form where the visitor names their own price.

## Proof and content

The lead proof is **the diagnosis itself** — the Thermocline stage names six production failure modes precisely enough that a reader recognises their own. That is the credential, because there is nothing else: no testimonials, no client logos, no case-study metrics beyond "~500K leads/month attributed via Attribute.ai". Nothing in those categories may be invented. Supporting proof is the five shipped products, one of them deliberately marked Sunset, and the published prices.

## Constraints

- Payment-processor and trading-name disclosures stay adjacent to prices and checkout.
- The three prices stay published; hiding one to force a conversation contradicts the practice.
- Legacy anchors must keep resolving: `#top`, `#break`, `#expertise`, `#work`, `#approach`, `#offer`, `#scorecard`, `#pitch`, `#contact`, `#booking`.
- The site must stay legible in placeholder mode, with no Stripe or Cal.com keys set.

## Chosen direction

**Mesophotic Descent** — a technical dive down a volcanic island wall. Chosen by the user over the rolled "Interlocking" direction. Seed `83700d5e`, code-led (no image generation available, so no comp).

The page is one dive. Sections are stages of a real dive profile, descending to turnaround depth at the pricing and ascending back to the surface at the booking. A fixed depth rail is the only navigation, and every claim is pinned to the depth it happens at.

## Memorable moment

**The lamp.** At mesophotic depth all chroma has drained and the wall of shipped work reads uniformly blue and healthy. A pointer-following radial mask restores true colour where it falls, so the visitor performs the argument themselves: your system looks fine until somebody actually goes down and looks at it. Bounded to the wall section, degrades to full colour on touch and under reduced motion.

## Anti-references

The AI-consultancy canon (near-black plus neon glow, gradient orbs, three icon feature cards, a fake terminal) and its opposite, the warm cream / big serif / terracotta personal-consultant look — which is what this site used to be. The user named both as failure states.

## Unresolved

- No real photography beyond `public/portrait.jpg`; the wall's specimens are authored SVG. If commissioned imagery ever arrives it should replace, not supplement, the drawn specimens.
- `lib/company.ts` still has `registrationState` as a placeholder, which the Terms' governing-law clause depends on. Pre-existing, and not a design decision.
- Sibling marketing routes are legible but not art-directed in this world; they are the obvious next surface.
