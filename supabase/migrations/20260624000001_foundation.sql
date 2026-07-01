-- ============================================================================
-- Foundation: extensions, tool schemas, shared `public` tables, RLS helper.
-- Everything the three ag tools (agronomy / spray / fields) hang off of.
-- ============================================================================

-- --- Extensions (kept in the dedicated `extensions` schema) ---
create extension if not exists vector with schema extensions;   -- pgvector  (P1 RAG)
create extension if not exists postgis with schema extensions;  -- PostGIS   (P3 geometry)

-- --- Per-tool schemas (hard logical separation between the three tools) ---
create schema if not exists agronomy;
create schema if not exists spray;
create schema if not exists fields;

-- ============================================================================
-- Shared tables (public) — cross-cutting tenancy + observability
-- ============================================================================

-- One row per customer/workspace; the tenancy boundary for all three tools.
create table public.tenants (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

-- Maps an auth user to a tenant + role.
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  tenant_id  uuid not null references public.tenants(id) on delete cascade,
  role       text not null default 'member' check (role in ('owner','member')),
  created_at timestamptz not null default now()
);
create index profiles_tenant_id_idx on public.profiles(tenant_id);

-- Every LLM call across all three tools (cost/latency observability).
create table public.llm_logs (
  id                bigint generated always as identity primary key,
  tenant_id         uuid references public.tenants(id) on delete cascade,
  tool              text not null check (tool in ('agronomy','spray','fields')),
  model             text,
  prompt_tokens     int,
  completion_tokens int,
  cost_usd          numeric,
  latency_ms        int,
  created_at        timestamptz not null default now()
);
create index llm_logs_tenant_id_idx on public.llm_logs(tenant_id);

-- ============================================================================
-- Helpers
-- ============================================================================

-- Resolve the current user's tenant. SECURITY DEFINER so it bypasses RLS on
-- `profiles` (avoids recursive policy evaluation) — the standard Supabase
-- pattern. Reused by every tenant-isolation policy below and in tool schemas.
create or replace function public.current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$ select tenant_id from public.profiles where id = auth.uid() $$;

-- Generic updated_at touch trigger.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$ begin new.updated_at = now(); return new; end; $$;

-- ============================================================================
-- Row-Level Security on shared tables (read paths; writes go via service role)
-- ============================================================================

alter table public.tenants  enable row level security;
alter table public.profiles enable row level security;
alter table public.llm_logs enable row level security;

create policy tenants_self_select on public.tenants
  for select using (id = public.current_tenant_id());

create policy profiles_tenant_select on public.profiles
  for select using (tenant_id = public.current_tenant_id());

create policy llm_logs_tenant_select on public.llm_logs
  for select using (tenant_id = public.current_tenant_id());
