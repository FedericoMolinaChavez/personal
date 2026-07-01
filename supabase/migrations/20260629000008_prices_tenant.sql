-- Replace the global (commodity, observed_on) unique constraint added in 007
-- with a per-tenant one so each tenant's price rows are independently idempotent.
alter table fields.price_readings
  drop constraint if exists price_readings_commodity_date_uq;

alter table fields.price_readings
  add constraint price_readings_tenant_commodity_date_uq
  unique (tenant_id, commodity, observed_on);
