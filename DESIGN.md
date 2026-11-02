---
name: CTO + AI
description: Warm, spacious consulting surfaces with clay actions and Bricolage Grotesque typography.
colors:
  primary: "#8f4538"
  on-primary: "#ffffff"
  on-primary-fixed-variant: "#763226"
  primary-container: "#ad5d4e"
  on-primary-container: "#fffaf9"
  secondary: "#56642b"
  secondary-container: "#d6e7a1"
  surface: "#fff8f3"
  on-surface: "#1f1b15"
  on-surface-variant: "#544340"
  surface-container-low: "#fbf2e8"
  surface-container: "#f6ece3"
  surface-container-high: "#f0e7dd"
  surface-container-highest: "#eae1d7"
  outline: "#87726f"
  outline-variant: "#dac1bd"
  error: "#ba1a1a"
typography:
  display:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "44px"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "36px"
    fontWeight: 400
    lineHeight: "40px"
  headline-md:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: "32px"
  headline-lg:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: "40px"
    letterSpacing: "-0.01em"
  body-lg:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "28px"
  body-md:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  label-md:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
    letterSpacing: "0.02em"
  label-sm:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "16px"
    letterSpacing: "0.05em"
rounded:
  xl: "12px"
  3xl: "24px"
  full: "9999px"
spacing:
  "2": "8px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "12": "48px"
  "16": "64px"
  "20": "80px"
  "24": "96px"
  "28": "112px"
  "32": "128px"
  margin-mobile: "20px"
  margin-desktop: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.on-primary-fixed-variant}"
  button-secondary:
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-container}"
  field:
    backgroundColor: "{colors.surface-container-low}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
  panel:
    backgroundColor: "{colors.surface-container}"
    rounded: "{rounded.xl}"
  answer-option-selected:
    backgroundColor: "{colors.secondary-container}"
    rounded: "{rounded.full}"
---

# Design System: CTO + AI

## Overview

**Creative North Star: "The established warm consulting studio"**

The established warm consulting studio pairs an ivory ground with earthy clay actions, muted sage accents and open, left-aligned typography. Bricolage Grotesque carries both the conversational headline and the practical interface. Large open sections alternate with softly rounded inset panels rather than a continuous grid of boxed content.

This records the implemented consulting website, including its service pages and production checklist. The existing identity is the authority; the separate agriculture tools are outside this document's scope. The world description is inherited from the approved surface brief, not a new identity proposal.

**Key Characteristics:**
- Warm tonal surfaces and dark brown text.
- Large, regular-weight opening headlines with compact, heavier interface labels.
- Pill actions, rounded panels and thin dividers.
- Stacked mobile reading order with wider-screen split layouts.

## Colors

The palette is warm and tonal, with clay leading actions and sage providing secondary emphasis. The frontmatter preserves the incumbent Tailwind names and hex values; it selects reused roles rather than reproducing the entire configured palette.

### Primary

- **Primary clay:** filled booking/purchase actions, the wordmark, links, focus outlines and native-control accents.
- **Deep clay:** the shared filled action's hover state.
- **Clay container:** text selection and inherited clay utilities, with a light foreground for selection.

### Secondary

- **Deep sage:** secondary project accents and accepted-booking status.
- **Pale sage:** the selected checklist answer background. It indicates selection, including an unknown answer; it is not a readiness verdict.

### Neutral

- **Warm ivory surface:** the page and opaque sticky navigation ground.
- **Dark brown ink:** principal headings and text. The configured on-background alias has the same value as on-surface.
- **Muted brown ink:** introductions, supporting paragraphs, placeholders and explanatory copy.
- **Warm surface steps:** inset summaries, booking and enquiry containers, expertise hover states and capability tags.
- **Muted outline:** scrollbar thumb; the pale outline variant supplies panel, field and section strokes.
- **Error red:** enquiry error text, paired with an alert message.

### Named Rules

**The Clay Action Rule.** Use primary clay for the main filled action and actionable text; use the darker primary variant for the shared filled button hover.

## Typography

**Display Font:** Bricolage Grotesque (sans-serif fallback).
**Body Font:** Bricolage Grotesque (same fallback).

The root layout loads weights 400, 600, 700 and 800 through Next's font loader. Large opening headlines are regular-weight; the wordmark and some incumbent feature headings are heavier. The configured role names do not impose their size or weight by themselves when only the font-family utility is used.

### Hierarchy

- **Display:** frontmatter describes the shared mobile home/service headline. The homepage grows to 60px at small and 80px at medium widths; service pages grow to 60px at small and 68px at large widths. The checklist uses 44px then 64px, with 1.1 line-height. These are discrete responsive steps, not a fluid clamp.
- **Headline:** service and booking section headings use 36px/40px, increasing to 48px/48px at medium widths. Inherited sections also use the configured headline-lg role, sometimes overriding the desktop size to 48px while retaining its other properties.
- **Title:** summaries and content subsections commonly use regular 24px/32px text; the configured headline-md role is a separate semibold treatment used in the wordmark and inherited components. Service selection titles and result headings use 30px/36px.
- **Body:** body-lg introduces an engagement; body-md is the root default for detail. Supporting utility text commonly uses 14px/20px. Introductions frequently cap at 42rem, while broader content blocks cap at 48rem.
- **Label:** label-md identifies buttons and navigation. Label-sm supports functional form labels and feedback; enquiry field labels are uppercase with wider tracking (0.1em). This functional label treatment is not a section-heading preface.

### Named Rules

**The One Family Rule.** Use Bricolage Grotesque for display, body and interface text; hierarchy comes from size, spacing and weight.

## Layout

The shared marketing container is centered with a maximum outer width of 1280px. Its internal side padding is margin-mobile below the medium breakpoint and margin-desktop from medium onward. The root horizontal rhythm is not a full-bleed card grid.

Shared responsive thresholds are small (640px), medium (768px), large (1024px) and extra-large (1280px), inherited from Tailwind. The navigation's full link row starts at extra-large; the header booking action appears from small. The menu occupies the narrower widths.

Home and service openings use 80px vertical padding, increasing to 112px at medium. Common content sections use 64px then 96px; inherited enquiry and expertise sections use 128px. Gaps cluster at 16, 24, 32, 40, 48, 64 and 80px. Most anchored sections reserve 96px of scroll clearance for the sticky navigation.

Service openings split 1.5:1 at large widths, with the summary following the introduction in the mobile document order. Service scope splits 1:1.5 from medium. The offer splits 1.2:1 at medium. The checklist splits 1.5:1 at large, where its results panel becomes sticky 112px from the top; the results follow the questions below that breakpoint. The existing project pair uses a twelve-column 7:5 split from medium, with the second item offset downward, then a three-column secondary row. Narrow layouts stack these regions.

## Elevation & Depth

Depth comes primarily from warm tonal panels, whitespace and fine strokes. The existing approach feature and portrait share the diffuse soil shadow (`0 20px 40px -10px rgba(74, 69, 62, 0.08)`). This is an ambient lift, not a general card elevation scale. Project panels retain their light clay gradient, and the portrait retains its soft sage halo; neither creates a new reusable color or motion token.

### Named Rules

**The Tonal Separation Rule.** Separate ordinary content with warm surface steps and thin dividers; reserve the existing diffuse shadow for the approach feature and portrait.

## Shapes

Shared actions, menu controls and answer choices are fully rounded pills. Most inset content panels, project panels and fields use the xl corner. The approach and enquiry outer containers use the larger 3xl corner. The portrait uses an intermediate rounded corner (16px) and a light frame; this image treatment is not a general panel token. Thin pale borders define fields, option controls, navigation and section divisions. No hard offset shadow belongs to the observed depth vocabulary.

## Components

### Buttons

Clear filled or outlined pills, with compact semibold labels.

- **Primary:** primary clay with on-primary text, shared padding from frontmatter and a minimum height of 48px. Hover uses deep clay; disabled shared buttons use a waiting cursor and 60% opacity.
- **Secondary:** transparent with a pale outline and primary text; hover adds the ordinary container tone. Same minimum height and padding as primary.
- **Focus:** the global visible-focus outline is 2px primary clay, offset 4px.
- **Existing enquiry variant:** larger padding (16px 40px), a hover scale of 0.95 and 70% disabled opacity; the shared action remains the default for other consulting flows.
- **Text actions:** underlined clay links with a 4px underline offset, including in-page scope links and alternatives to the main action.

### Chips

Checklist answer options are bordered pills with a 44px minimum height and 12px horizontal padding. A pale sage fill marks the checked option, while the clay native radio and text retain explicit state. Capability tags in the approach feature are static pills on the highest warm container tone; they do not behave as filters.

### Cards / Containers

Inset summaries and checklist results use the ordinary container tone; booking uses the low tone. Common panel padding spans 24–40px, and service feature panels grow to 48px where implemented. The enquiry container uses 32px then 48px. These panels remain flat. Expertise panels darken one surface step on hover. Existing project links gently scale their visual panel to 0.98 over 500ms, while their textual description stays outside the panel.

### Inputs / Fields

Enquiry inputs and textarea use a pale low surface, a thin outline, xl corners and the frontmatter field padding. Placeholder text uses the same muted brown role as supporting copy. Focus changes the border to primary and adds a 1px primary ring; these fields suppress the global outline in favor of that treatment. The textarea resizes vertically. Field groups become two columns at medium width.

Native required/type validation remains active. Errors appear in error red with alert semantics; submission exposes a busy state and text. Provider-accepted success replaces the form with an announced, programmatically focused confirmation and a Send another action. Verification mounts only when configured and is removed/remounted as the form leaves/returns. These state distinctions are part of the implemented component behavior, not proof of live delivery.

### Navigation

An opaque ivory header sticks at the top with a fine bottom border and an 80px minimum inner height. The clay wordmark sits left. Links darken to clay on hover; there is no route-active visual style in the component. The narrower-screen menu is an in-flow list below the header row, controlled by a text Menu/Close pill with expanded state. Link activation and Escape from the open list close it. Focused service navigation reduces the desktop links to selected work and keeps a scoping action. A keyboard skip link becomes visible when focused.

### Booking

The inset booking region initially shows an action to load available times. Loading/slow/failure text and direct-calendar/email alternatives remain explicit; without a configured calendar link it shows an email arrangement action. The embedded calendar receives a light theme with primary clay branding and a minimum height of 600px. Accepted bookings use a sage confirmation; other successful requests retain neutral explanatory text. External provider contents are not a local component token source.

### Production Checklist

Native disclosure groups divide the questions. A fieldset/legend pairs each check with Confirmed, Needs attention and Not sure radio answers. The result panel announces separate confirmed, gap and unknown counts. Gap checkboxes allow up to three selected email-draft items; unselected boxes disable at that limit. The email action appears only when a gap is selected, and reset clears answers and selections. The component's explicit reset-on-reload and non-certification copy are functional context, not a new visual scoring language.

### Icons and motion

The incumbent site uses the Google Material Symbols Outlined library with fill 0, weight 400, grade 0 and optical size 24; selected decorative project/confirmation symbols request fill 1. It is an existing library, not a substitute Unicode icon vocabulary. The sidecar previews omit decorative symbols rather than creating a second icon system.

State changes use the existing color/transform transitions; the footer specifies 200ms and project panels 500ms. Smooth anchor scrolling is enabled. Reduced-motion preference disables animation and transitions and restores automatic scrolling. Reveal-marked content is already opaque in the actual stylesheet; the observer does not establish a hidden-content animation pattern.

## Do's and Don'ts

### Do:
- **Do** reuse the shared filled and outlined pill actions for the consulting flows.
- **Do** retain visible focus, readable placeholders, native controls and explicit loading, error and confirmation text.
- **Do** stack split layouts and allow action groups to wrap on narrow screens.
- **Do** use the established ivory, clay and sage roles before adding another color.

### Don't:
- **Don't** use the pale outline color as running text; the build uses the darker surface-variant text role.
- **Don't** make checklist selection color carry the answer alone; retain the native control and written label.
- **Don't** copy the existing decorative section eyebrows into new sections.

Not canonized: the existing Selected Work and Expertise eyebrows are inherited craft-floor defects, not a reusable heading pattern. One-off project tints, portrait effects and unused theme tokens are not promoted into system primitives.
