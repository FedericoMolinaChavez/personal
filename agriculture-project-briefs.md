# Portfolio Project Briefs — AI Tools for Agriculture

**Niche:** AI-powered tools and automation for farms, co-ops, agronomists, and agtech companies.
**Positioning:** "The AI-ops person for agriculture." All three projects use real, public ag data so every demo is live and clickable — the biggest advantage of this niche.

**Why agriculture works for a solo freelancer:** rich open data (satellite imagery, weather, soil, commodity prices, public agronomy/regulatory docs), real SMB buyers, and obvious ROI (yield, input cost, compliance, labor hours). One project is built **dual-use** so it doubles as a logistics/defense-adjacent showcase later.

### Shared stack (reuse across all three)

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind.
- **Backend:** Next.js API routes / serverless, or a small FastAPI service for heavier AI/geospatial work.
- **AI:** An LLM API (OpenAI / Anthropic / open model) behind a thin provider abstraction.
- **Vector store:** Postgres + pgvector (one DB for everything).
- **Geospatial (for ag):** PostGIS, plus a satellite/imagery API (Sentinel Hub, or open Sentinel-2 / Landsat).
- **Auth & DB:** Supabase or Postgres + Auth.js/Clerk.
- **Hosting:** Vercel + managed Postgres.
- **Evals/logging:** log every LLM call (input, output, latency, cost) and every automation run.

### Useful public ag data sources

- **Weather:** OpenWeather, NOAA, Open-Meteo (free, no key).
- **Satellite crop health (NDVI):** Sentinel-2 via Sentinel Hub / Copernicus, or Landsat.
- **Soil:** USDA Web Soil Survey / SSURGO, SoilGrids.
- **Commodity prices & yields:** USDA NASS QuickStats API, USDA AMS market reports.
- **Agronomy / regulatory docs:** University extension publications (land-grant universities), EPA pesticide labels, CDMS label database, FAO guides.

> Build a shared starter once (auth, DB, LLM wrapper, logging, a weather/satellite fetch helper), then fork it per project. Reusability is itself a selling point.

---

## Project 1 — Agronomy Knowledge Assistant (RAG)

**One-liner:** A chat tool that answers agronomy and compliance questions from a grower's own documents — pesticide labels, crop guides, equipment manuals, extension publications — with cited sources.

**Why it wins ag clients:** Application rates, restricted-entry intervals (REI), pre-harvest intervals (PHI), and tank-mix rules live in dense PDF labels and guides. Getting these wrong has legal and crop-safety consequences, so growers and agronomists value a tool that answers *with citations* and refuses to guess.

### Scope (MVP)

- Upload/ingest agronomy docs (PDF labels, extension guides, equipment manuals).
- Chat that retrieves relevant passages and answers **only** from them, with citations to the exact label/section/page.
- Hard "I can't find that in the documents" behavior — never invent a rate or interval.
- Admin panel to manage the document library.

### Functional requirements

1. **Ingestion:** parse PDFs (including multi-column pesticide labels), chunk (~500–800 tokens, overlap), embed, store vectors + metadata (doc, product name, section, page).
2. **Retrieval:** hybrid search (keyword + vector) — important because product names, EPA reg numbers, and crop names must match exactly.
3. **Answer generation:** answer strictly from retrieved context; surface the specific number (rate, REI, PHI) plus the citation.
4. **Citations:** click-through to the source document and page.
5. **Guardrails:** low-confidence retrieval → decline and suggest checking the label directly. Add a visible "always confirm against the official label" disclaimer (compliance-sensitive).
6. **Admin:** upload, list, delete, see ingestion status.

### Non-functional requirements

- Answer latency under ~5s.
- Per-query cost logging.
- Tenant/workspace data isolation (a co-op's docs stay private).
- Robust to messy label formatting.

### Tech stack

Next.js streaming chat UI · Postgres + pgvector · LLM embeddings + generation · `pdf-parse`/`unstructured` for PDFs · simple ingestion queue.

### Build steps

1. Scaffold the shared starter.
2. Build ingestion + chunking; sanity-check chunks on a real pesticide label PDF.
3. Add embeddings + pgvector + hybrid retrieval.
4. Build streaming chat UI with citation rendering.
5. Tune the "answer only from context / decline otherwise" prompt against tricky label questions.
6. Add admin doc management + the compliance disclaimer.
7. Build a 25–30 question eval set with known answers from real labels; measure accuracy, tune.

### Stretch goals

Per-crop/per-product filters, REI/PHI calculator that pairs the cited number with an application-date input, Spanish-language support (large share of ag labor), Slack/WhatsApp front-end for in-field use.

### Case-study packaging

- Corpus: real public pesticide labels (CDMS/EPA) + a few land-grant extension guides — fully demoable.
- Headline: "Answers application-rate, REI, and PHI questions in seconds with the exact label citation."
- Show the eval ("96% correct on 30 real label questions") and the refuse-to-guess behavior.
- 60–90s demo video + a short build note on hybrid retrieval and hallucination guardrails.

**Effort:** 2–3 weeks part-time.

---

## Project 2 — Spray & Field-Record Automation (dual-use)

**One-liner:** Turn messy field inputs (a photo of a handwritten spray log, a text from an operator, a voice note) into structured, compliant application records — automatically logged and threshold-checked.

**Why it wins ag clients:** Pesticide application record-keeping is legally required in most jurisdictions and is a genuine, recurring pain — usually done on paper or in a shoebox. Automating it produces a clean compliance number ("cut record-keeping from 30 min/day to 2 min of review"). **Dual-use angle:** the same intake-extract-validate-log pattern is exactly how logistics/asset-tracking and defense-adjacent field-reporting workflows work — so this one doubles as a logistics showcase.

### Scope (MVP)

- **Trigger:** an operator submits a record (photo of paper log, SMS/WhatsApp message, form, or voice note).
- **Processing:** extract the required fields — product + EPA reg number, rate, field/block, acres, date/time, applicator, weather/wind, target pest.
- **Validation:** check against rules (rate within label max, wind within limits, REI/PHI flags) — uncertain or out-of-range items go to a **review queue** instead of being auto-saved.
- **Action:** write a clean record to a database/sheet and generate the compliance-ready log.
- **Dashboard/log:** every submission, its parsed result, and status.

### Functional requirements

1. Idempotent trigger handling (no duplicate records).
2. Structured extraction with a strict schema; LLM for messy inputs (handwriting/photos/free text), rules for clean ones.
3. Validation layer with configurable thresholds (label max rate, max wind speed, REI/PHI windows).
4. Human-in-the-loop review queue for low-confidence or rule-violating entries.
5. Record store + exportable compliance report (CSV/PDF).
6. Failure notifications.

### Non-functional requirements

- Never silently fail — every error/edge case is visible and recoverable.
- Auditable: full trail of raw input → parsed output → who approved.
- Configurable per farm/jurisdiction.

### Tech stack

Webhook/intake endpoint (Next.js API) · LLM with vision for photo/handwriting extraction · rules engine in code · Postgres for records + run log · optional Twilio/WhatsApp intake · PDF/CSV export.

### Build steps

1. Map the manual record-keeping process; capture the legally required fields and note current time cost.
2. Build the intake endpoint; capture a real sample (photo + text).
3. Build extraction to a strict schema; validate structure.
4. Add the rules/validation layer (rate, wind, REI/PHI).
5. Build the review queue + record store + export.
6. Add failure alerts.
7. Run on a batch of realistic samples; measure extraction accuracy and time saved.

### Stretch goals

Voice-note intake, multi-language, weather auto-fill from a weather API at the logged time/location, a "hours saved this month" report, multi-farm/multi-operator roles.

### Case-study packaging

- Lead with the number: "Cut spray record-keeping from ~30 min/day to 2 min of review, with built-in compliance checks."
- Before/after workflow diagram.
- Show the review queue and a rejected out-of-range entry (proves reliability + the compliance guardrail).
- Explicitly note the dual-use pattern in your write-up — "the same intake→extract→validate→log pipeline powers logistics field reporting."

**Effort:** 1.5–2.5 weeks part-time.

---

## Project 3 — Field Health & Operations Dashboard with AI Briefing

**One-liner:** A dashboard that pulls satellite crop-health (NDVI), weather, and commodity-price data for a grower's fields and adds a plain-English "what changed, why, and what to do this week" briefing.

**Why it wins ag clients:** Growers don't want more charts — they want to know which field needs attention and whether to sell now. Layering an AI briefing over real geospatial + market data is a strong, visual, clearly-valuable artifact.

### Scope (MVP)

- Define fields (draw/upload field boundaries as polygons).
- Pull **NDVI / crop-health** imagery per field over time (Sentinel-2).
- Pull **weather** (recent + forecast) and **commodity prices** (USDA NASS) for the relevant crops.
- Visualize: NDVI trend per field, a field-health map, weather, and price trends.
- **AI briefing:** flags fields with declining health, ties it to weather, notes price moves, and suggests 1–2 actions — grounded strictly in the data shown.
- Date-range and field filters.

### Functional requirements

1. Field boundary management (GeoJSON polygons in PostGIS).
2. Scheduled fetch of NDVI per field (cloud-masked), cached — don't recompute on every load.
3. Weather + price ingestion with period-over-period comparison.
4. Charts + a simple field-health map (color-coded by NDVI).
5. AI briefing fed **computed metrics as JSON** (not raw imagery), instructed to cite actual numbers and never invent them.
6. Filters update charts, map, and briefing together; loading/empty/error states.

### Non-functional requirements

- Briefing faithful to the data (numbers only from the computed metrics).
- Fast load via precomputed/cached metrics.
- Graceful handling of cloud-obscured or missing imagery.

### Tech stack

Next.js + Tailwind · Recharts/Chart.js + a map (Leaflet/Mapbox) · PostGIS for field geometry · Sentinel Hub / Copernicus for NDVI · Open-Meteo/NOAA for weather · USDA NASS QuickStats for prices · LLM for the briefing · scheduled jobs for ingestion.

### Build steps

1. Get imagery + weather + price API access (all have free tiers / public access).
2. Build field-boundary input and store polygons in PostGIS.
3. Build the NDVI fetch + cloud-mask + per-field aggregation pipeline; cache results.
4. Add weather + price ingestion with period comparisons; verify the math.
5. Build charts, the field-health map, and metric cards.
6. Add filters and wire them through.
7. Build the AI briefing from computed metric JSON; test across date ranges to confirm it never fabricates numbers.

### Stretch goals

Anomaly/early-stress alerts, weekly emailed briefing, drill-down from briefing to the specific field/chart, irrigation or spray timing suggestions from weather, a natural-language "ask your fields" box (reuses Project 1's RAG skills).

### Case-study packaging

- Use real public fields/coordinates so NDVI and weather actually move.
- Headline: "Turns satellite, weather, and market data into a 30-second weekly briefing telling a grower which field needs attention and whether to sell."
- Show the briefing beside the map/charts it references.
- Call out the faithfulness guardrail — "the AI only reports numbers present in the data."

**Effort:** 2.5–3.5 weeks part-time (geospatial adds time).

---

## Roadmap to break into the agriculture niche

- **Sequence:** start with **Project 2 (spray-record automation)** — smallest build, clearest dollar/hours number, and the compliance pain is universal. Then **Project 1 (agronomy assistant)**. Then **Project 3 (dashboard)** — most impressive, most effort.
- **Reuse the shared starter** so builds 2 and 3 ship faster and look consistent.
- **Each ships as a case study:** live demo link, 60–90s video, short build write-up, one headline metric.
- **Productize each into an offer:** "compliant spray-record setup," "agronomy AI assistant," "field-health briefing dashboard" — the portfolio pieces become sales assets.
- **Keep the dual-use bridge:** Project 2's intake→extract→validate→log pattern is your credible path toward logistics and defense-adjacent work later, without needing clearances or closed data.
