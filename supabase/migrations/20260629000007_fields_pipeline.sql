-- ============================================================================
-- P3 — Field Health & Operations Dashboard: pipeline migration.
-- Additive to 20260624000005_fields.sql: richer NDVI stats, idempotent-upsert
-- unique keys, and PostgREST-friendly geometry I/O (write fn + GeoJSON view).
-- ============================================================================

-- --- Richer NDVI statistics from the Sentinel Hub Statistical API (brief §4.2) ---
alter table fields.ndvi_readings
  add column if not exists ndvi_min       numeric,
  add column if not exists ndvi_max       numeric,
  add column if not exists ndvi_std       numeric,
  add column if not exists valid_coverage numeric;

-- --- Unique keys so the daily cron upserts are idempotent ---
alter table fields.ndvi_readings
  add constraint ndvi_readings_field_date_uq unique (field_id, captured_on);
alter table fields.weather_readings
  add constraint weather_readings_field_date_uq unique (field_id, observed_on, forecast);
alter table fields.price_readings
  add constraint price_readings_commodity_date_uq unique (commodity, observed_on);

-- ============================================================================
-- Geometry I/O through PostgREST
-- PostgREST returns raw geometry as WKB hex and can't accept GeoJSON on insert,
-- so writes go through a function and reads through a view.
-- ============================================================================

-- Write: GeoJSON geometry object in, new field id out. The service-role caller
-- passes tenant_id explicitly (matches the spray write pattern).
create or replace function public.fields_create(
  p_tenant  uuid,
  p_name    text,
  p_crop    text,
  p_geojson jsonb
) returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  new_id uuid;
begin
  insert into fields.fields (tenant_id, name, crop, geom)
  values (
    p_tenant,
    p_name,
    p_crop,
    extensions.ST_SetSRID(extensions.ST_GeomFromGeoJSON(p_geojson::text), 4326)
  )
  returning id into new_id;
  return new_id;
end;
$$;

-- Read: expose geometry as GeoJSON plus a precomputed centroid for weather lookups.
-- security_invoker keeps RLS in force for anon/authenticated reads; the service
-- role bypasses RLS and filters by tenant_id explicitly in code.
create view fields.field_list
with (security_invoker = on) as
  select
    f.id,
    f.tenant_id,
    f.name,
    f.crop,
    f.created_at,
    extensions.ST_AsGeoJSON(f.geom)::jsonb     as geometry,
    extensions.ST_Y(extensions.ST_Centroid(f.geom)) as lat,
    extensions.ST_X(extensions.ST_Centroid(f.geom)) as lng
  from fields.fields f;

grant select on fields.field_list to authenticated, service_role;
