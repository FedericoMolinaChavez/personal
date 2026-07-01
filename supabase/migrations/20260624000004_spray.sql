-- ============================================================================
-- P2 — Spray & Field-Record Automation (dual-use). Schema: spray.
-- ============================================================================

create table spray.submissions (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references public.tenants(id) on delete cascade,
  raw_input  jsonb,
  channel    text,   -- photo | sms | whatsapp | form | voice
  status     text not null default 'parsed'
             check (status in ('parsed','needs_review','approved','rejected')),
  created_at timestamptz not null default now()
);
create index spray_submissions_tenant_idx on spray.submissions(tenant_id);

create table spray.records (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references spray.submissions(id) on delete cascade,
  tenant_id     uuid not null references public.tenants(id) on delete cascade,
  product       text,
  epa_reg_no    text,
  rate          numeric,
  unit          text,
  field_block   text,
  acres         numeric,
  applied_at    timestamptz,
  applicator    text,
  wind_speed    numeric,
  target_pest   text,
  validation    jsonb,
  approved_by   uuid references auth.users(id),
  created_at    timestamptz not null default now()
);
create index spray_records_tenant_idx on spray.records(tenant_id);
create index spray_records_submission_idx on spray.records(submission_id);

create table spray.run_log (
  id             bigint generated always as identity primary key,
  tenant_id      uuid not null references public.tenants(id) on delete cascade,
  submission_id  uuid references spray.submissions(id) on delete set null,
  status         text,
  error          text,
  time_saved_min numeric,
  created_at     timestamptz not null default now()
);
create index spray_run_log_tenant_idx on spray.run_log(tenant_id);

-- --- RLS: tenant isolation on every table ---
alter table spray.submissions enable row level security;
alter table spray.records     enable row level security;
alter table spray.run_log     enable row level security;

create policy tenant_select on spray.submissions
  for select using (tenant_id = public.current_tenant_id());
create policy tenant_select on spray.records
  for select using (tenant_id = public.current_tenant_id());
create policy tenant_select on spray.run_log
  for select using (tenant_id = public.current_tenant_id());

-- --- Grants ---
grant usage on schema spray to authenticated, service_role;
grant select, insert, update, delete on all tables in schema spray
  to authenticated, service_role;
alter default privileges in schema spray
  grant select, insert, update, delete on tables to authenticated, service_role;
