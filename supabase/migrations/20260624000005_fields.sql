-- ============================================================================
-- P3 — Field Health & Operations Dashboard. Schema: fields.
-- ============================================================================

create table fields.fields (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references public.tenants(id) on delete cascade,
  name       text not null,
  crop       text,
  geom       extensions.geometry(Polygon, 4326),
  created_at timestamptz not null default now()
);
create index fields_fields_tenant_idx on fields.fields(tenant_id);
create index fields_fields_geom_idx
  on fields.fields using gist (geom extensions.gist_geometry_ops_2d);

create table fields.ndvi_readings (
  id          bigint generated always as identity primary key,
  field_id    uuid not null references fields.fields(id) on delete cascade,
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  captured_on date not null,
  ndvi_mean   numeric,
  cloud_pct   numeric
);
create index fields_ndvi_field_idx on fields.ndvi_readings(field_id);
create index fields_ndvi_tenant_idx on fields.ndvi_readings(tenant_id);

create table fields.weather_readings (
  id          bigint generated always as identity primary key,
  field_id    uuid references fields.fields(id) on delete cascade,
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  observed_on date not null,
  temp_c      numeric,
  precip_mm   numeric,
  wind_speed  numeric,
  forecast    boolean not null default false
);
create index fields_weather_field_idx on fields.weather_readings(field_id);
create index fields_weather_tenant_idx on fields.weather_readings(tenant_id);

create table fields.price_readings (
  id          bigint generated always as identity primary key,
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  commodity   text not null,
  observed_on date not null,
  price       numeric
);
create index fields_price_tenant_idx on fields.price_readings(tenant_id);

create table fields.briefings (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references public.tenants(id) on delete cascade,
  period_start date,
  period_end   date,
  summary      text,
  metrics      jsonb,
  created_at   timestamptz not null default now()
);
create index fields_briefings_tenant_idx on fields.briefings(tenant_id);

-- --- RLS: tenant isolation on every table ---
alter table fields.fields           enable row level security;
alter table fields.ndvi_readings    enable row level security;
alter table fields.weather_readings enable row level security;
alter table fields.price_readings   enable row level security;
alter table fields.briefings        enable row level security;

create policy tenant_select on fields.fields
  for select using (tenant_id = public.current_tenant_id());
create policy tenant_select on fields.ndvi_readings
  for select using (tenant_id = public.current_tenant_id());
create policy tenant_select on fields.weather_readings
  for select using (tenant_id = public.current_tenant_id());
create policy tenant_select on fields.price_readings
  for select using (tenant_id = public.current_tenant_id());
create policy tenant_select on fields.briefings
  for select using (tenant_id = public.current_tenant_id());

-- --- Grants ---
grant usage on schema fields to authenticated, service_role;
grant select, insert, update, delete on all tables in schema fields
  to authenticated, service_role;
alter default privileges in schema fields
  grant select, insert, update, delete on tables to authenticated, service_role;
