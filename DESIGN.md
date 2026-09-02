---
name: Federico Molina — Mesophotic Descent
description: A fractional CTO practice drawn as a technical dive down a volcanic island wall — instrument-grade, hairline-ruled, one cyan signal in deep water.
colors:
  sea-lit: "#0E3247"
  sea-mid: "#081626"
  sea-cold: "#10243A"
  sea-meso: "#071A2E"
  sea-deep: "#04121F"
  abyss: "#02060D"
  abyss-ink: "#050A14"
  thermocline: "#23D6E6"
  thermocline-dim: "#16899A"
  coral: "#FF6B4A"
  kelp: "#6FD79B"
  snow: "#F4F6FA"
  snow-dim: "#9FB6C4"
  snow-faint: "#7994A6"
  hairline: "#17334A"
  hairline-lit: "#26536F"
typography:
  hero:
    fontFamily: "Saira Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 9vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.025em"
  stage:
    fontFamily: "Saira Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: "-0.02em"
  readout:
    fontFamily: "Martian Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "clamp(2.75rem, 6vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  readout-sm:
    fontFamily: "Martian Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  lede:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.6vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.6
  prose:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Martian Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.16em"
  label-lg:
    fontFamily: "Martian Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.12em"
rounded:
  default: "2px"
  xl: "3px"
  full: "9999px"
spacing:
  margin-mobile: "20px"
  gutter: "24px"
  margin-desktop: "40px"
  rail: "208px"
components:
  control-primary:
    backgroundColor: "{colors.thermocline}"
    textColor: "{colors.abyss}"
    typography: "{typography.label}"
    rounded: "{rounded.default}"
    padding: "14px 24px"
  control-primary-hover:
    backgroundColor: "#5AE6F2"
    textColor: "{colors.abyss}"
  control-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.snow}"
    typography: "{typography.label}"
    rounded: "{rounded.default}"
    padding: "14px 24px"
  control-secondary-hover:
    backgroundColor: "{colors.sea-cold}"
    textColor: "{colors.snow}"
  control-nav:
    backgroundColor: "{colors.thermocline}"
    textColor: "{colors.abyss}"
    rounded: "{rounded.default}"
    padding: "10px 24px"
  module:
    backgroundColor: "rgb(8 22 38 / 0.55)"
    textColor: "{colors.snow}"
    rounded: "{rounded.default}"
  module-header:
    backgroundColor: "transparent"
    textColor: "{colors.snow-faint}"
    typography: "{typography.label}"
    padding: "12px 20px"
  field:
    backgroundColor: "{colors.sea-deep}"
    textColor: "{colors.snow}"
    rounded: "{rounded.default}"
    padding: "12px 16px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.snow-dim}"
    typography: "{typography.label}"
  nav-link-hover:
    textColor: "{colors.thermocline}"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.snow-dim}"
    typography: "{typography.label}"
    rounded: "{rounded.default}"
    padding: "8px 14px"
---

# Design System: Federico Molina — Mesophotic Descent

## Overview

**Creative North Star: "The Mesophotic Descent"**

The marketing site is one dive down a volcanic island wall, rendered with the discipline of dive instrumentation rather than the vocabulary of a consultancy landing page. The ground deepens as you scroll, a single thermocline cyan marks the depth you are currently at and carries every primary action, and warm colour is the thing that drains as you go down — restored only where a lamp falls on it. Nothing is decorative for its own sake: every rule, tick, numeral and label behaves like part of a gauge. Density is high and the surfaces are flat; there is no glass, no glow, no lift.

The world's argument is legibility under pressure. The claim being sold is that a system can look healthy at the surface and fail at depth, so the page makes the reader perform that discovery: at the mesophotic wall all chroma is drained and the work reads uniformly blue and fine until a pointer-driven lamp restores it. That one moment is authored; everything around it is instrument-flat and still.

Two confirmed rejections define the outer edges. The AI-consultancy canon — near-black with neon glow, gradient orbs, three identical icon cards, fake terminal chrome — is out. Its opposite, the warm-cream / big-serif / terracotta personal-consultant look this site used to be, is equally out. Where a section could resolve into a symmetrical card grid, it resolves into a ruled log instead.

Two boundaries are load-bearing and neither is a gap. The `/tools` app runs a separate, deliberately untouched dark "Command" theme, scoped by the `.command-theme` wrapper in `app/globals.css` and the `cmd-*` token scale in `tailwind.config.ts`; the two worlds never share a surface and nothing in this document applies there. The sibling marketing routes (`/scorecard`, `/terms`, `/success`, `/cancel`) were not redesigned: they inherit this palette through legacy Material-3 token names remapped onto dive values in `tailwind.config.ts`, so they are legible and on-world, but they are not art-directed into the dive and carry none of its stage structure.

**Key Characteristics:**
- One continuous water column, tinted by dive stage, never broken into per-section background blocks
- A single cyan signal (`thermocline`) for active depth and every primary action; nothing else is filled with it
- Hairline 1px structure and a 2px corner radius everywhere — machined, not rounded; no pills
- Three faces, three jobs: condensed uppercase display, quiet grotesk prose, monospace for every measurement
- Depth is the navigation: a fixed rail is the only nav, and every claim is pinned to the metre it happens at
- Flat by default — one box-shadow exists in the entire system, and it reads as light rather than lift

## Colors

An abyssal blue-ink ground that gets darker with depth, one high-chroma cyan that is the only saturated colour most of the page ever shows, and a chalk-white ink borrowed from marine snow.

### Primary
- **Thermocline Cyan** (`thermocline`): The active depth, and every primary action. It fills the "Book a 15-minute call" control, the rail's live depth readout, the lit rail tick, the published price numerals, the thermocline band itself, the focus ring, the caret and the scrollbar thumb. Its rarity is what makes it read as a signal rather than a brand colour.
- **Thermocline Dim** (`thermocline-dim`): The passed-stage state on the depth rail, the drawn specimens on the wall, and the resting scrollbar thumb. Cyan with the volume down — used where cyan needs to be present but not active.

### Secondary
- **Coral** (`coral`): The warm end of the spectrum, and therefore the thing depth takes away. It appears only where something has genuinely ended or genuinely failed: the `Sunset` status on The Nomad Hub, and form and checkout error text. It is never used decoratively, and never for emphasis.
- **Kelp** (`kelp`): Ready / affirmative. The availability dot in the nav, the `Live` status on shipped work, the `Ready` flag on the dive-log module, and the ascending-leg marker on the rail.

### Neutral
- **Sunlit Tip** (`sea-lit`): The top and bottom of the water column, and the nav's translucent ground. The only place in the world that reads as daylight.
- **Midnight / Cold / Mesophotic / Turnaround / Abyss** (`sea-mid`, `sea-cold`, `sea-meso`, `sea-deep`, `abyss`): The dive-stage grounds, stepped by depth. `sea-meso` is the document's base background; `sea-cold` is the hover ground for a ruled row and the label backing on the thermocline band; `sea-deep` is the input field ground and the scrollbar track; `abyss` is the footer, the mobile stage sheet, and the text colour that sits on a filled cyan control.
- **Marine Snow** (`snow`): Primary text, headings, and the falling particulate itself — the same white does the reading and the atmosphere.
- **Snow Dim** (`snow-dim`): Secondary body copy and lede text (8.3:1 on `sea-meso`).
- **Snow Faint** (`snow-faint`): Tertiary text — instrument labels, units, notes and disclosures (5.6:1 on `sea-meso`).
- **Hairline / Hairline Lit** (`hairline`, `hairline-lit`): 1px structure. `hairline` rules every log row, module edge and data cell; `hairline-lit` is the brighter edge, reserved for a secondary control's box and an unvisited rail tick.

### Named Rules

**The Drain Rule.** Warm colour is what depth takes away, so warm colour is never spent on decoration. `coral` appears only where something is genuinely wrong or genuinely over — an error, or a shut-down product. If a surface wants coral for emphasis, it wants a hairline or a label instead.

**The One Signal Rule.** `thermocline` marks exactly two things: the depth you are at, and the action the page wants you to take. Nothing else is filled with it. A screen where cyan appears in a third role has stopped being an instrument.

**The Never-Only-Colour Rule.** No status is carried by colour alone. `StatusLamp` in `components/Projects.tsx` pairs its square with the word "Live" or "Sunset"; the depth rail pairs its marker with "Descending" or "Ascending"; the nav pairs its kelp square with "available". A swatch without its word is not a state.

**The Legacy Alias Rule.** The Material-3 names still present in `tailwind.config.ts` (`surface`, `primary`, `on-surface`, `outline-variant`, `error`, and the `surface-container-*` family) are aliases pointing at dive values, kept alive only so the un-redesigned sibling routes stay on-world. New landing-page work uses the dive names. Never introduce a Material-3 name into a dive surface, and never give an alias a value the dive scale does not already have.

## Typography

**Display Font:** Saira Condensed (with `ui-sans-serif`, `system-ui`, `sans-serif`), weights 500/600/700
**Body Font:** Archivo (with `ui-sans-serif`, `system-ui`, `sans-serif`)
**Data Font:** Martian Mono (with `ui-monospace`, `SFMono-Regular`, `monospace`), weights 400/500/600

All three are loaded through `next/font/google` in `app/layout.tsx` as CSS variables (`--font-saira`, `--font-archivo`, `--font-martian`) with `display: swap`.

**Character:** Expedition lettering over quiet prose over dive-computer numerals. Saira Condensed set uppercase and tight is the equipment stencil — it names things and never explains them. Archivo is deliberately characterless, there to be read at speed by someone skimming between meetings. Martian Mono is the instrument face: it sets every number, unit, code, label and control, and never sets a sentence.

### Hierarchy
- **Hero** (`text-hero`, 700, `clamp(3rem, 9vw, 6rem)`, 0.92, `-0.025em`, uppercase): Two uses only — the first viewport's thesis in `components/Hero.tsx` and the closing call in `components/Contact.tsx`. The dive's surface, top and bottom.
- **Stage** (`text-stage`, 700, `clamp(2rem, 5vw, 3.25rem)`, 1.0, `-0.02em`, uppercase): Every section's `h2`. One per stage, capped at roughly 14–18ch so it breaks to two or three short lines.
- **Readout** (`text-readout`, Martian Mono 600, `clamp(2.75rem, 6vw, 4.5rem)`, 0.9, `-0.03em`): The dive-computer value in `Readout` from `components/dive/Instrument.tsx`. Its close relative is the price numeral in `components/Offer.tsx` (2.5rem, `-0.04em`) — the loudest single element on the page, which is the point of publishing prices.
- **Sub-display** (Saira Condensed, 1.375rem–2.5rem, uppercase): Module and card titles — a project name, a price tier, a form's success heading. Set at the size the module can carry, always uppercase, always `leading-none` or `leading-tight`.
- **Lede** (`text-lede`, Archivo 400, `clamp(1.0625rem, 1.6vw, 1.25rem)`, 1.6): The paragraph immediately under a stage heading, in `snow-dim`, capped at `max-w-measure` (68ch).
- **Prose** (`text-prose`, Archivo 400, 1.0625rem, 1.65): Body copy inside a log row or a module. Capped at 68ch.
- **Label** (`text-label`, Martian Mono 600, 0.6875rem, `0.16em`, uppercase): The engraving. `RuleLabel` and every control's text.
- **Micro-label** (Martian Mono, 0.5rem–0.625rem, `0.12em`–`0.16em`, uppercase): The dense instrument tier — rail stage names, data-cell keys, module header strips, footer disclosures, nav links. This tier does the majority of the page's small type and always sits in `snow-faint` or `snow-dim`.

### Named Rules

**The Three-Voice Rule.** Display names, body argues, data measures. Martian Mono never sets a sentence and Archivo never sets a number that means something. If a numeral is a quantity, it is mono, tabular, and paired with its unit in `snow-faint` at roughly a third of its size.

**The Tabular Rule.** Every numeral in this world is a measurement, so it lines up. Any mono figure that changes, repeats down a column, or sits beside another figure carries `.tabular` (`font-variant-numeric: tabular-nums` plus `"tnum" 1`). A live depth readout that jitters as it counts has broken the instrument.

**The Uppercase Display Rule.** Saira Condensed is always uppercase in this world. It is stencilled equipment lettering, not a headline face — sentence-case display is off-world.

## Layout

A single centred column, `max-w-container-max` (1280px), with `px-margin-mobile` (20px) below `md` and `px-margin-desktop` (40px) above it. From `xl` (1280px) the column takes an additional `pl-[248px]` so the fixed depth rail — `w-rail` (208px) plus its own left margin — never overlaps content. **The content column is therefore deliberately asymmetric above `xl`.** Prose inside it is capped at `max-w-measure` (68ch) regardless.

Sections are stages, defined once in `components/dive/stages.ts` and consumed by both the page and the rail. Vertical rhythm is `py-24` rising to `md:py-32`; the hero is `min-h-[86vh]`; every section carries `scroll-mt-16` so a hash landing clears the 64px sticky nav.

Inside a stage the recurring frame is a 12-column grid at `lg` and above: heading in `lg:col-span-5`, lede in `lg:col-span-7`, then the stage's own content beneath. Log rows subdivide the same 12 columns (`md:col-span-2` for the measured band, then 4/6 or 6/4 for content).

Breakpoints are Tailwind's defaults, unmodified, and each carries a real decision:
- `sm` 640px — hero controls go side by side; the thermocline band's label switches to its long form; specimens appear on observation cards.
- `md` 768px — desktop margins; log rows become horizontal; grids split.
- `lg` 1024px — the nav's six links appear (held to `lg` because they do not fit alongside the wordmark and control in the 768–1000px band); price tiers go to three columns.
- `xl` 1280px — the fixed depth rail replaces the mobile bottom bar and the content column gains its left offset.

**Full bleed** uses the `.bleed` helper in `app/globals.css`: `position: absolute; left: 0; right: 0`. It deliberately does **not** use `margin-inline: calc(50% - 50vw)` — the content column is asymmetric because of the rail, so that formula lands a bleeding band off-centre, and `100vw` also mis-measures by the scrollbar width. A bleed element keeps its static vertical position and stretches to the nearest positioned ancestor, which is the full-width water column.

### Named Rules

**The Depth-Pinned Rule.** Every stage, every observation and every piece of work carries the depth it happens at, as a mono figure. Depth is the page's ordinate and its only navigation — new content earns a place on the profile in `stages.ts` or it does not belong in the dive.

**The Log-Not-Grid Rule.** Repeated content defaults to a hairline-ruled log — an `<ol>` or a stack of `<article>`s divided by 1px rules, as in `Thermocline.tsx`, `Expertise.tsx` and `ScorecardTeaser.tsx`. Boxed modules are reserved for things you can act on: a link out of the page, a purchase, a form, an ascent stop. Three identical icon cards is the anti-reference; do not converge on it.

## Elevation & Depth

**There is no elevation system.** Nothing on this page lifts. Depth is carried entirely by tonal layering and atmosphere: the `.water-column` gradient that the whole document sits inside, two parallaxing marine-snow layers, light shafts that exist only near the surface, and a single bright thermocline band at the boundary crossing. Modules are translucent (`rgb(8 22 38 / 0.55)`) so the water and the falling snow read *through* them — that translucency, not a shadow, is what puts them in the column.

### Shadow Vocabulary

- **Lit module** (`.module-lit`, `box-shadow: 0 0 0 1px color-mix(in srgb, var(--thermocline) 12%, transparent), 0 18px 40px -24px color-mix(in srgb, var(--thermocline) 45%, transparent)`): The only box-shadow in the system. It is a cyan glow, not a drop shadow — light falling on the module rather than the module rising off the page. Used on exactly one element at a time: the featured price tier in `components/Offer.tsx`.

### Named Rules

**The Flat-Ground Rule.** Surfaces never lift. There is one shadow token and it reads as light. If a surface needs to separate from its neighbour, it gets a hairline, a tonal step in the water column, or nothing.

**The One-Ground Rule.** The document sits in a single continuous `.water-column` gradient defined once in `app/globals.css`. Stages tint that ground; they never replace it with a background block of their own. A section that paints its own opaque background has cut the column and broken the dive.

## Shapes

Machined, not rounded. `2px` is the entire radius system: `rounded`, `rounded-lg` and the `DEFAULT` all resolve to 2px, `rounded-xl` is 3px, and `rounded-full` (9999px) exists in the config but is **unused on the landing page**. There are no pills, no capsules and no circles: status indicators, rail markers and leg flags are all square `1.5×1.5` blocks (`h-1.5 w-1.5`), which is what makes them read as instrument LEDs rather than dots.

Structure is one weight: 1px in `hairline`, or `hairline-lit` where an edge needs to be brighter. Rules do the work that borders and boxes would do elsewhere — a log is a stack of `border-b` rows, a data strip is `border-t` with `border-l` between cells, a module header is a `border-b` strip.

Icons are authored, not borrowed: `components/dive/Icon.tsx` draws eleven glyphs on one 24-unit grid at a single `1.5` stroke with `strokeLinecap="square"` and `strokeLinejoin="miter"` — square and mitred, matching the 2px corner language. Specimens (`components/dive/Specimen.tsx`) are hairline SVG generated once at module load from fixed seeds (`9137`, `4421`, `2287`) so server and client render byte-identical paths.

### Named Rules

**The 2px Rule.** Every corner in this world is 2px. A radius above 3px is off-world; a pill is off-world. If a shape needs to feel softer, it is the wrong shape.

**The Hairline Rule.** Structure is 1px, always. No 2px dividers, no double rules, no borders that thicken on hover — a hover changes a rule's *colour*, never its weight.

**The One-Stroke Rule.** All authored line art is `1.5` stroke on a 24 grid, square cap, mitre join. A new icon is drawn into `Icon.tsx` under those constraints, not imported from a set.

## Components

### Controls (buttons and links)

Instrument switches: rectangular, tracked-out mono, with a right-hand arrow that nudges. Defined once as string constants in `components/dive/Instrument.tsx` so no control is ever assembled ad hoc.

- **Shape:** Sharp (2px). Text is `text-label` — Martian Mono 600, 0.6875rem, `0.16em` tracking, uppercase. Padding `14px 24px` (`px-6 py-3.5`), with the label and the arrow pushed apart by `justify-between` and a 24px minimum gap.
- **Primary** (`primaryControl`): Filled `thermocline` on `abyss` text. Hover lightens the fill to `#5AE6F2`. The lamp is always on the primary action — one per section at most.
- **Secondary** (`secondaryControl`): `hairline-lit` 1px box, `snow` text, transparent ground. Hover fills `sea-cold` and brightens the border to `thermocline`.
- **Nav variant:** The same primary control at `py-2.5` and 0.625rem, overridden inline in `components/Nav.tsx`.
- **Arrow:** `ControlArrow` renders the 16px `ArrowRight` and translates 4px right on group hover over 200ms. Every control carries one; an arrowless control is off-vocabulary.
- **States:** Transitions are `colors` only at 150ms. Disabled is `opacity-60` plus `cursor-not-allowed`, driven by `aria-busy` on the same element (`HireMeButton`, `ReversePitch`). Focus is the global ring (below), never a control-specific treatment.

### Modules (cards and containers)

The world's only container, and never nested. A hairline box in translucent midnight, built from `Module` / `ModuleHeader` / `DataStrip` in `components/dive/Instrument.tsx` and reproduced inline where a card needs to be an anchor.

- **Corner:** 2px. **Background:** `rgb(8 22 38 / 0.55)` — translucent, so the water column and marine snow read through. **Border:** 1px `hairline`.
- **Header strip:** A `border-b` row at `12px 20px` carrying a micro-label on the left (`snow-faint`) and an optional right-hand value in `thermocline`. This is where a module states its depth, its cadence or its status.
- **Foot strip:** `DataStrip` — a `border-t` `<dl>` of two or three cells divided by `border-l`, each a 0.5rem uppercase key over a 0.8125rem mono value.
- **Lit variant** (`module-lit`): Border shifts to 55% thermocline and the single system shadow appears. One at a time, marking the recommended option.
- **Hover** (link modules only): Border goes to `thermocline/60` over 200ms and the `ArrowOut` glyph translates up-right and turns cyan. Specimen art lifts from 60% to 90% opacity.

### Inputs / Fields

`components/ReversePitch.tsx` defines the field vocabulary as two shared class strings.

- **Style:** 1px `hairline` box on `sea-deep`, 2px corner, `16px` horizontal / `12px` vertical padding, Archivo 0.9375rem in `snow`. Placeholder is `snow-faint/70`.
- **Label:** Above the field, mono 0.5625rem uppercase at `0.16em` in `snow-faint`, with `*` marking required.
- **Focus:** Border goes `thermocline` plus a 1px `thermocline` ring; the browser outline is suppressed on the field itself because the border and ring already carry it.
- **Error:** Message text in `coral` with `role="alert"`, adjacent to the submit control — never a colour change on the field alone.
- **Success:** The whole form is replaced by a logged-state panel — a 30px `Check` glyph, an uppercase display heading, and a "Send another" link back to `idle`. The module header's right value flips from `Open` to `Logged`.

### Navigation

- **Surface bar** (`components/Nav.tsx`): Sticky, 64px, `sea-lit/80` with `backdrop-blur-md`, closed by a `hairline` bottom border. Wordmark in Saira Condensed 1.0625rem bold uppercase, followed at `sm` by a kelp square and "Fractional CTO · available". Six mono links in `snow-dim` appear at `lg` and hover to `thermocline` over 150ms. The primary control sits at the right at all widths.
- **Depth rail** (`components/dive/DepthRail.tsx`): See below — it is the real navigation.
- **Footer** (`components/Footer.tsx`): `abyss` ground, wordmark plus a six-link mono grid, then a `border-t` entity-disclosure block in micro-label type.

### Tags

Flat hairline rectangles, `8px 14px`, mono 0.5625rem uppercase in `snow-dim`. No fill, no radius beyond 2px, no hover state — they are printed on the log, not interactive.

### Signature component: the Depth Rail

The page's ordinate and its only navigation. `components/dive/DepthRail.tsx` runs one rAF-throttled scroll scrub that drives everything, and renders two different instruments from it.

- **Desktop (`xl` and up):** Fixed to the left margin, vertically centred, `w-rail` (208px), hung off a `border-l` hairline. A live `000.0 M` depth readout in `thermocline` sits above an ordered list of the eight stages, each a tick + depth + name. Tick states: active is a 24px `thermocline` bar with the name in `snow`; passed is a 14px `thermocline-dim` bar with the name in `snow-dim` and a lit connecting line; unvisited is a 10px `hairline-lit` bar that grows to 16px and `snow-faint` on hover. A leg flag closes the rail — a cyan square and "Descending", or a kelp square and "Ascending".
- **Depth readout behaviour:** Depth holds at the current stage's own value across the middle half of that section and only travels in the outer quarters, so a lit `60 TURNAROUND` can never sit beside a reading of `052.8`. The active stage is chosen by index, never by comparing interpolated depth against a stage value.
- **Narrow screens (below `xl`):** A fixed bottom bar on `abyss/90` with `backdrop-blur-sm` — chevron, current stage name, live depth — that expands into a full stage sheet with `aria-expanded` / `aria-controls`. Beneath it, a 1px progress line whose cyan/hairline split is the dive's completion. This exists because the nav links are hidden below `lg`; without it the dive profile is unreachable on a phone.

### Signature component: the Lamp

The world's one authored interaction, in `components/dive/Lamp.tsx`, bounded to the mesophotic wall in `components/Projects.tsx`.

- **What it does:** Renders two stacked copies of the same children. The lower copy is desaturated (`filter: saturate(0.15)`); the upper copy is true colour, revealed through a radial `mask-image` whose centre and radius are CSS variables the pointer writes. Radius opens to 320px on enter and closes to 0 on leave. A faint warm `lamp-cone` wash sits above the revealed layer so the beam is visible, not just its effect.
- **Why it is built this way (load-bearing):** The **drained** copy is the real one — it carries the semantics, the focus order and every click, because a CSS mask makes its own transparent regions un-hittable and nothing important may sit behind one. The true-colour copy is `aria-hidden`, `inert` and `pointer-events-none`.
- **Contrast safety:** The drain is *saturation only*. Luminance is untouched, so text contrast is identical lit or unlit. The lamp changes colour, never legibility.
- **Performance:** Pointer moves write CSS custom properties inside a single `requestAnimationFrame`; nothing re-renders per frame.
- **Fallbacks:** `useHandheld()` returns true for a coarse pointer or `prefers-reduced-motion`. In that case `Lamp` renders its children once, at full colour, with no drained layer at all — and `LampHint` renders nothing, so no one is told to move a lamp that does not exist. Both read the same test, so they can never disagree.

## Do's and Don'ts

### Do:
- **Do** pin new content to a depth. Add the stage to `components/dive/stages.ts` so the rail, the anchors and the ordering all stay in agreement.
- **Do** build every control from `primaryControl` / `secondaryControl` in `components/dive/Instrument.tsx`, and give it a `ControlArrow`.
- **Do** default repeated content to a hairline-ruled log; reserve `.module` for something the reader can act on.
- **Do** set every meaningful numeral in Martian Mono with `.tabular`, paired with its unit in `snow-faint` at roughly a third of the size.
- **Do** draw new icons into `components/dive/Icon.tsx` on the 24 grid at `1.5` stroke, square cap, mitre join.
- **Do** keep prose at `max-w-measure` (68ch) and let the column stay asymmetric above `xl`.
- **Do** use `.bleed` for any full-width band, never a `100vw` or `50% - 50vw` trick.
- **Do** state a new ink colour's contrast ratio against `sea-meso` in the token comment, the way `snow-dim` and `snow-faint` do.

### Don't:
- **Don't** add a second saturated accent, or spend `thermocline` on anything that is neither the active depth nor a primary action.
- **Don't** use `coral` for emphasis. It means failed or ended, and nothing else.
- **Don't** exceed a 2px corner, and don't introduce a pill, capsule or circular indicator — status marks are square blocks.
- **Don't** add a drop shadow. `module-lit` is the only shadow, it reads as light, and only one element wears it at a time.
- **Don't** nest a `.module` inside a `.module`.
- **Don't** give a section its own opaque background; tint the water column instead.
- **Don't** set prose in Martian Mono, or set display type in sentence case.
- **Don't** resolve a stage into three symmetrical icon cards, a gradient orb, a neon glow, or fake terminal chrome — and don't drift back toward the warm cream / big serif / terracotta consultant look this site replaced.
- **Don't** put content behind a hover, a pointer, or a motion preference.
- **Don't** let `.command-theme` or any `cmd-*` token touch a marketing surface, or a dive token touch `/tools`. The two worlds are scoped apart on purpose.
- **Don't** treat the legacy Material-3 aliases as available design tokens. They exist to keep the un-redesigned sibling routes legible, not to be built on.

## Motion

Motion is instrument response, not animation. Two ambient loops and a short list of state transitions; no entrance animations, no scroll-triggered reveals, no parallax beyond the snow.

- **Marine snow:** Two tiled layers drifting upward on `transform: translate3d` — 26s and 46s, linear, infinite. Deliberately a transform on an over-tall layer rather than an animated `background-position`, which repaints the whole viewport every frame and stalls the compositor on two fixed full-screen layers.
- **State transitions:** control colours 150ms; hover transforms and specimen opacity 200ms; rail tick colour 220ms; rail tick geometry 300ms; the rail marker 420ms. Easing on rail elements is `cubic-bezier(0.16, 1, 0.3, 1)`; everything else uses Tailwind's default.
- **Scrolling:** `scroll-behavior: smooth` on `html`, with `scroll-mt-16` on every stage.
- **Reduced motion** (`@media (prefers-reduced-motion: reduce)` in `app/globals.css`): smooth scroll off; snow drift off; `.lamp-drained` filter removed so the wall is already at true colour; the lamp mask and cone removed and hidden; rail transitions off. The dive still reads — every stage simply arrives already lit.

### Named Rules

**The Compositor-Only Rule.** Ambient motion animates `transform` and nothing else. If a loop would animate a paint property across a fixed full-screen layer, it does not ship.

**The No-Gate Rule.** No content is ever behind a hover, a pointer, or a motion preference. The lamp is a way of *seeing* the wall, never the way of reading it.

## Accessibility

These are decisions, not defaults, and changing them changes the design.

- **The lamp's drained layer carries all semantics**, focus order and clicks; the revealed layer is `aria-hidden` + `inert` + `pointer-events-none`. Any future duplicate-layer effect must be built the same way round.
- **The drain is saturation-only**, so contrast is constant lit or unlit.
- **One test, two consumers:** `useHandheld()` governs both the lamp and its hint, so the instruction and the effect can never contradict each other.
- **Contrast is recorded at the token:** `snow-dim` is 8.3:1 and `snow-faint` 5.6:1 on `sea-meso`. A new ink value has to state its ratio.
- **Colour is never the sole carrier of status** — see The Never-Only-Colour Rule.
- **Focus ring:** a global `2px` `thermocline` outline at `2px` offset with a `1px` radius, on `:where(a, button, input, textarea, select, [tabindex]):focus-visible`. It is described in the source as a lamp on the control. Never removed; the rail's stage links only widen its offset.
- **Decorative SVG is fully hidden:** every glyph and specimen carries `aria-hidden="true"` and `focusable="false"`.
- **Instrument rows do not double-read:** in the hero's stat line the `<dt>` is `sr-only` and the visible label is `aria-hidden`, so the pairing is announced once.
- **Async state is announced:** `aria-busy` on submitting controls, `role="alert"` on every error note.
- **Browser chrome is themed rather than replaced:** `::selection`, `caret-color`, `accent-color` and the scrollbar all take dive values; nothing overrides native focus or scrolling behaviour.

## Known Gaps

Recorded because they are ceilings this build hit, not defects to quietly close. Each is actionable.

### No raster material anywhere in the world

**What is missing.** The quality bar this build was calibrated against (`.impeccable/qualitybar/board.webp`) names three material textures — marine-snow particulate, glass-sponge surface, and black-coral surface — and its hero register is photographic. The shipped page has **zero raster imagery of the world**. Every specimen is authored hairline SVG (`components/dive/Specimen.tsx`) and all atmosphere is CSS gradients (`app/globals.css`). The mesophotic-wall section in `components/Projects.tsx` — the stage that most needs material to justify the lamp — is carried by six drawn line-art specimens at 34% opacity.

**Why.** A harness limitation, not a design decision: the session that built this had no image generation available of any kind, and PRODUCT.md forbids fabricating photography. The finish reviewer scored this partial and instructed that it be documented rather than closed by substitution.

**What a future round should produce.**
1. A **marine-snow particulate plate** — a tileable, seamless, transparent-background raster of suspended particulate at two scales, to sit under or replace the six `radial-gradient` stops in `.marine-snow` / `.marine-snow-far`. Must tile at the existing 340px and 190px sizes so `snow-rise` keeps working unchanged, and must stay compositor-only.
2. A **coral / sponge wall texture** at a scale that carries the mesophotic wall section — a wide, dark, low-key raster of black-coral branches and glass-sponge lattice against basalt, in the `sea-meso` / `sea-deep` range, with enough real chroma in the warm end that the lamp's saturation drain has something to take away and give back. This is the asset that would make the lamp read as *material* rather than as a filter over line art.
3. Provenance for both. Per the direction contract's FINISH clause, every shipping raster carries its provenance.

When commissioned imagery arrives it should **replace** the drawn specimens on the wall, not supplement them; line art layered over photographic material is the failure mode here.

**The one real photograph.** `public/portrait.jpg` is the only raster on the page, used in the dive-log module in `components/Projects.tsx` at `aspect-[4/5]`, `object-cover`, inside a hairline module with a "Lead diver / Ready" header and a two-cell data strip. It is real and load-bearing, and it is the entire photographic content of the world.

### The booking embed is un-redesigned

`components/BookingEmbed.tsx` still carries the previous world: `rounded-3xl` (a 24px corner inside a 2px system), `border-outline-variant` and `bg-surface-container-lowest` (legacy Material-3 aliases), a `soil-shadow` class that **no longer exists in any stylesheet**, and a Cal.com brand colour of `#8f4538` — terracotta from the abandoned earth-tone identity. None of that is design-system guidance; it is a carried defect on the landing page's own booking stage. A future round should give the embed a `.module` frame at 2px, drop the dead class, and set `cal-brand` to `thermocline` (`#23D6E6`).

### Sibling marketing routes are legible but not art-directed

`/scorecard`, `/terms`, `/success` and `/cancel` inherit this palette only through the remapped legacy token names. They read as on-world and are not broken, but they carry none of the dive's stage structure, depth pinning, or instrument vocabulary. They are the obvious next surface, and this document is the rulebook to bring them into.
