-- ============================================================================
-- P2 — private Storage bucket for spray intake photos.
-- The server (service role) uploads originals and issues short-lived signed
-- URLs for the review queue. No anon/authenticated policies: only the service
-- role touches this bucket, and it bypasses Storage RLS.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('spray-intake', 'spray-intake', false)
on conflict (id) do nothing;
