-- ============================================================================
-- Abuse protection: per-IP rate limiting for the public-facing tools.
-- The tool routes call rate_limit_hit() (service role) which atomically bumps a
-- per-IP counter in two windows (minute + day) and returns both counts, so a
-- bot can't run up LLM cost. `bucket` avoids the reserved word `window`.
-- ============================================================================

create table public.rate_limits (
  id           bigint generated always as identity primary key,
  key          text not null,          -- e.g. "tools:1.2.3.4"
  bucket       text not null,          -- 'min' | 'day'
  window_start timestamptz not null,
  count        int not null default 0,
  unique (key, bucket, window_start)
);
create index rate_limits_lookup_idx on public.rate_limits(key, bucket, window_start);

-- Only the service role touches this table (via the RPC). No anon/authenticated
-- access; enable RLS with no policies so it's locked down by default.
alter table public.rate_limits enable row level security;

/**
 * Atomically increment the minute + day counters for a key and return both new
 * counts. SECURITY DEFINER so the service-role callers can run it; opportunistic
 * cleanup keeps the table from growing unbounded.
 */
create or replace function public.rate_limit_hit(
  p_key text,
  p_minute_start timestamptz,
  p_day_start timestamptz
)
returns table (min_count int, day_count int)
language plpgsql
security definer
set search_path = public
as $$
declare
  mc int;
  dc int;
begin
  insert into public.rate_limits (key, bucket, window_start, count)
  values (p_key, 'min', p_minute_start, 1)
  on conflict (key, bucket, window_start)
  do update set count = public.rate_limits.count + 1
  returning count into mc;

  insert into public.rate_limits (key, bucket, window_start, count)
  values (p_key, 'day', p_day_start, 1)
  on conflict (key, bucket, window_start)
  do update set count = public.rate_limits.count + 1
  returning count into dc;

  -- Opportunistic cleanup of stale rows (~2% of calls).
  if random() < 0.02 then
    delete from public.rate_limits where window_start < now() - interval '2 days';
  end if;

  return query select mc, dc;
end;
$$;

grant execute on function public.rate_limit_hit(text, timestamptz, timestamptz)
  to service_role;
