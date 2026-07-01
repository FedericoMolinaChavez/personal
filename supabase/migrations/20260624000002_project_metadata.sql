-- ============================================================================
-- Public, read-only project showcase reference table.
-- Drives the marketing site's Projects section. One row per tool, keyed by a
-- slug that matches the tool schema names. NOT tenant-scoped — public content.
-- ============================================================================

create table public.project_metadata (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null check (slug in ('agronomy','spray','fields')),
  title       text not null,
  description text,
  img         text,        -- image URL / public path
  link        text,        -- live demo / case-study URL
  video       text,        -- demo video URL
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger project_metadata_set_updated_at
  before update on public.project_metadata
  for each row execute function public.set_updated_at();

-- RLS: anyone may read; writes are service-role only (service role bypasses RLS).
alter table public.project_metadata enable row level security;

create policy project_metadata_public_read
  on public.project_metadata for select
  using (true);

-- The anon/authenticated API roles need an explicit table grant in addition to
-- the read policy above.
grant select on public.project_metadata to anon, authenticated;
