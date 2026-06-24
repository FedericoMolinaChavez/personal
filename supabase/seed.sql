-- Seed data applied on `supabase db reset`.

-- --- Demo tenants (so RLS isolation can be demoed with multiple "companies") ---
-- Profiles are intentionally not seeded here: they reference auth.users, which
-- is populated through Supabase Auth. Create demo users in Studio, then insert
-- matching public.profiles rows pointing at these tenant ids.
insert into public.tenants (id, name) values
  ('11111111-1111-1111-1111-111111111111', 'Green Valley Co-op'),
  ('22222222-2222-2222-2222-222222222222', 'Sunrise Farms'),
  ('33333333-3333-3333-3333-333333333333', 'Demo Agronomy LLC')
on conflict (id) do nothing;

-- --- Project showcase metadata (public read) ---
-- sort_order follows the build roadmap: spray -> agronomy -> fields.
insert into public.project_metadata (slug, title, description, img, link, video, sort_order) values
  ('spray',
   'Spray & Field-Record Automation',
   'Turns messy field inputs — a photo of a handwritten spray log, a text, a voice note — into structured, compliant application records, automatically logged and threshold-checked.',
   '', '', '', 1),
  ('agronomy',
   'Agronomy Knowledge Assistant',
   'A chat tool that answers agronomy and compliance questions from a grower''s own documents — pesticide labels, crop guides, equipment manuals — with cited sources and a refuse-to-guess guardrail.',
   '', '', '', 2),
  ('fields',
   'Field Health & Operations Dashboard',
   'Pulls satellite crop-health (NDVI), weather, and commodity-price data per field and adds a plain-English weekly briefing: what changed, why, and what to do — grounded strictly in the data shown.',
   '', '', '', 3)
on conflict (slug) do nothing;
