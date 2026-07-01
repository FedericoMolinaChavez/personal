# Architecture Plan — One Repo, One Supabase, Three Ag Tools

Companion to `agriculture-project-briefs.md`. This document defines how the three projects live inside your **single personal-website Next.js repo** and share **one Supabase instance**.

The three tools:

- **P1 — Agronomy Knowledge Assistant** (RAG)
- **P2 — Spray & Field-Record Automation** (dual-use)
- **P3 — Field Health & Operations Dashboard**

Guiding principles: one deploy to maintain, hard logical separation between tools so they can't break each other, and shared infrastructure (auth, LLM wrapper, logging) written once.

---

## 1. Routing strategy

Use the App Router with **route groups** so the marketing site and the tools stay cleanly separated but ship as one app.

- Marketing/personal site: `/`, `/about`, `/work`, `/contact` — your existing site, untouched.
- Tools live under a `/tools` namespace: `/tools/agronomy`, `/tools/spray`, `/tools/fields`.
- Each tool is self-contained: its own layout, its own auth gate, its own API routes.

```
app/
  (marketing)/              # your existing personal site
    page.tsx
    about/page.tsx
    work/page.tsx
  (tools)/
    tools/
      layout.tsx            # shared tools shell: auth guard, nav, tenant context
      agronomy/             # P1
        page.tsx
        chat/page.tsx
      spray/                # P2
        page.tsx
        review/page.tsx     # human-in-the-loop review queue
      fields/               # P3
        page.tsx
        [fieldId]/page.tsx
  api/
    agronomy/               # P1 endpoints
      ingest/route.ts
      chat/route.ts
    spray/                  # P2 endpoints
      intake/route.ts       # webhook for photo/SMS/voice submissions
      validate/route.ts
    fields/                 # P3 endpoints
      ndvi/route.ts
      briefing/route.ts
    cron/                   # scheduled jobs (Vercel Cron)
      ndvi-refresh/route.ts
      prices-refresh/route.ts
```

Why route groups instead of subdomains: one Vercel project, one deploy, shared session, no DNS/cookie juggling. If a tool later outgrows the site, you lift its folder into its own repo with minimal change because it's already self-contained.

---

## 2. Repo / folder structure

Keep a single Next.js app (no Turborepo needed at this size). Separate **shared** code from **per-tool** code with clear boundaries.

```
src/
  app/                      # routes (see section 1)
  lib/
    shared/                 # written once, used by all 3 tools
      supabase/
        client.ts           # browser client
        server.ts           # server client (service role, server-only)
        types.ts            # generated DB types
      llm/
        index.ts            # provider-agnostic chat()/embed() wrapper
        providers/
      logging/
        llmLog.ts           # logs every LLM call to shared table
        runLog.ts           # logs every automation run
      auth/
        guard.ts            # requireUser(), requireTenant()
      tenant/
        context.ts          # current workspace/tenant resolution
    agronomy/               # P1-only logic
      ingest.ts             # parse + chunk + embed
      retrieve.ts           # hybrid search
      answer.ts             # grounded answer + citations
    spray/                  # P2-only logic
      extract.ts            # vision/text -> structured record
      rules.ts              # rate/wind/REI/PHI validation
      records.ts
    fields/                 # P3-only logic
      ndvi.ts
      weather.ts
      prices.ts
      briefing.ts
  components/
    ui/                     # shared design system
    agronomy/  spray/  fields/   # tool-specific components
  db/
    migrations/             # SQL migrations, ordered
    seed/
```

Rule: tool folders may import from `lib/shared`, but never from each other. This keeps the three projects independently maintainable inside one repo.

---

## 3. Single Supabase instance — partition by Postgres schema

One Supabase project. Separate the tools using **Postgres schemas** (not table-name prefixes). Schemas give you real namespacing, cleaner RLS, and an easy future "lift one tool out" path.

```
public      -> shared: tenants, profiles, llm_logs (cross-cutting)
agronomy    -> P1 tables
spray       -> P2 tables
fields      -> P3 tables
```

Enable required extensions once on the instance: `vector` (pgvector, for P1), `postgis` (for P3 field geometry), `pg_cron` optional.

> In Supabase, expose the extra schemas to the API under Settings → API → "Exposed schemas" (add `agronomy`, `spray`, `fields`), or access them via the server client with the service role.

### Shared tables (`public`)

```sql
-- one row per customer/workspace; the tenancy boundary for all 3 tools
tenants(id uuid pk, name text, created_at timestamptz)

-- maps an auth user to a tenant + role
profiles(id uuid pk references auth.users, tenant_id uuid references tenants,
         role text check (role in ('owner','member')), created_at timestamptz)

-- every LLM call across all 3 tools (cost/latency observability)
llm_logs(id bigint pk, tenant_id uuid, tool text check (tool in ('agronomy','spray','fields')),
         model text, prompt_tokens int, completion_tokens int, cost_usd numeric,
         latency_ms int, created_at timestamptz)
```

### P1 — `agronomy`

```sql
agronomy.documents(id uuid pk, tenant_id uuid, name text, source text,
                   status text, page_count int, created_at timestamptz)
agronomy.chunks(id bigint pk, document_id uuid references agronomy.documents,
                tenant_id uuid, content text, page int, section text,
                embedding vector(1536))
agronomy.conversations(id uuid pk, tenant_id uuid, created_at timestamptz)
agronomy.messages(id bigint pk, conversation_id uuid, role text,
                  content text, citations jsonb, created_at timestamptz)
-- index: ivfflat/hnsw on chunks.embedding; plus a tsvector column for hybrid search
```

### P2 — `spray`

```sql
spray.submissions(id uuid pk, tenant_id uuid, raw_input jsonb, channel text,
                  status text check (status in ('parsed','needs_review','approved','rejected')),
                  created_at timestamptz)
spray.records(id uuid pk, submission_id uuid references spray.submissions, tenant_id uuid,
              product text, epa_reg_no text, rate numeric, unit text, field_block text,
              acres numeric, applied_at timestamptz, applicator text,
              wind_speed numeric, target_pest text, validation jsonb, approved_by uuid)
spray.run_log(id bigint pk, tenant_id uuid, submission_id uuid, status text,
              error text, time_saved_min numeric, created_at timestamptz)
```

### P3 — `fields`

```sql
fields.fields(id uuid pk, tenant_id uuid, name text, crop text,
              geom geometry(Polygon,4326), created_at timestamptz)
fields.ndvi_readings(id bigint pk, field_id uuid references fields.fields, tenant_id uuid,
                     captured_on date, ndvi_mean numeric, cloud_pct numeric)
fields.weather_readings(id bigint pk, field_id uuid, tenant_id uuid, observed_on date,
                        temp_c numeric, precip_mm numeric, wind_speed numeric, forecast bool)
fields.price_readings(id bigint pk, tenant_id uuid, commodity text, observed_on date, price numeric)
fields.briefings(id uuid pk, tenant_id uuid, period_start date, period_end date,
                 summary text, metrics jsonb, created_at timestamptz)
```

Note `tenant_id` on **every** table — it's the spine of isolation and the RLS filter.

---

## 4. Multi-tenancy & Row-Level Security

Even for a portfolio, real RLS makes you look senior and lets you safely demo with multiple "companies."

- Every table carries `tenant_id`.
- A user belongs to one tenant via `public.profiles`.
- Enable RLS on every table; policy pattern:

```sql
alter table agronomy.documents enable row level security;

create policy tenant_isolation on agronomy.documents
  using (tenant_id = (select tenant_id from public.profiles where id = auth.uid()));
```

- **Browser/anon client** → always RLS-enforced (read paths, chat UI).
- **Server/service-role client** → bypasses RLS; use only in trusted API routes (ingestion, cron, webhooks) and always set `tenant_id` explicitly in code.
- Webhook intake (P2 SMS/photo) has no logged-in user — authenticate the webhook with a per-tenant secret/token, resolve `tenant_id` server-side, then write with the service role.

---

## 5. Auth

- One Supabase Auth instance for the whole app.
- The marketing site is public; `app/(tools)/tools/layout.tsx` is the single auth gate for all three tools (`requireUser()` → redirect to sign-in if absent).
- Roles via `profiles.role`. Tenant context resolved once in the tools layout and passed down.
- For demos, seed 2–3 tenants so reviewers can see isolation working.

---

## 6. Environment & config

Single `.env`, namespaced by concern. Keep server-only secrets out of `NEXT_PUBLIC_`.

```
# Supabase (shared)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server only

# LLM
LLM_PROVIDER=
LLM_API_KEY=
EMBEDDING_MODEL=

# P3 data sources
SENTINELHUB_CLIENT_ID=
SENTINELHUB_CLIENT_SECRET=
NASS_API_KEY=
# weather via Open-Meteo (no key)

# P2 intake
SPRAY_WEBHOOK_SECRET=
TWILIO_*=                          # optional SMS/WhatsApp
```

Use a small typed config loader (e.g. `zod`-validated `env.ts`) so a missing var fails fast at boot.

---

## 7. Deployment & background work

- **One Vercel project** for the whole repo (site + 3 tools).
- **Vercel Cron** drives P3's scheduled fetches (`/api/cron/ndvi-refresh`, `/api/cron/prices-refresh`) and any P2 digest. Protect cron routes with a secret header.
- Heavy/long jobs (NDVI processing, large PDF ingestion) that may exceed serverless limits: offload to a Supabase Edge Function or a small separate worker, or chunk the work. Keep request handlers fast.
- Generate Supabase types into `lib/shared/supabase/types.ts` in CI so the typed client stays in sync with migrations.

---

## 8. Migration & build order

1. **Foundation:** create the Supabase project, enable `vector` + `postgis`, write the `public` shared tables (tenants, profiles, llm_logs), set up RLS helper + seed tenants. Build `lib/shared` (supabase clients, llm wrapper, logging, auth guard). Add the `/tools` route group + auth gate.
2. **P2 (spray)** first — smallest, clearest ROI. Schema → intake webhook → extraction → rules → review queue → export.
3. **P1 (agronomy)** — schema → ingestion → hybrid retrieval → grounded chat → admin.
4. **P3 (fields)** — schema (PostGIS) → field boundaries → NDVI/weather/price pipelines + cron → charts/map → AI briefing.

Each tool reuses the foundation from step 1, so 2→3→4 get progressively faster to ship.

---

## 9. Risks & guardrails for the single-instance choice

- **Schema separation** keeps the three tools from colliding; a bug in one can't read another's tables thanks to RLS + schema boundaries.
- **One DB = one blast radius.** Take Supabase backups before each migration; run migrations through ordered SQL files in `db/migrations`, never ad-hoc in the dashboard.
- **Connection limits:** serverless can exhaust Postgres connections — use Supabase's connection pooler (PgBouncer / port 6543) for serverless routes.
- **Cost isolation:** `llm_logs.tool` lets you see per-tool LLM spend even though billing is shared.
- **Future exit:** because each tool is its own schema + its own `lib/<tool>` + its own route folder, peeling one out into a dedicated repo/instance later is a contained job, not a rewrite.
