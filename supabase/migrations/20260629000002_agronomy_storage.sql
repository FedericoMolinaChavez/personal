-- ============================================================================
-- P1 — private Storage bucket for original agronomy documents (PDF/DOCX/TXT/MD).
-- The server (service role) uploads originals and issues short-lived signed URLs
-- so citations can open the source file. No anon/authenticated policies: only the
-- service role touches this bucket, and it bypasses Storage RLS. Mirrors the
-- spray-intake bucket (20260624000006_spray_storage.sql).
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('agronomy-docs', 'agronomy-docs', false)
on conflict (id) do nothing;
