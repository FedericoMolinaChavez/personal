-- ============================================================================
-- P1 — Agronomy Knowledge Assistant (RAG). Schema: agronomy.
-- ============================================================================

create table agronomy.documents (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references public.tenants(id) on delete cascade,
  name       text not null,
  source     text,
  status     text not null default 'pending',  -- pending | ingesting | ready | failed
  page_count int,
  created_at timestamptz not null default now()
);
create index agronomy_documents_tenant_idx on agronomy.documents(tenant_id);

create table agronomy.chunks (
  id          bigint generated always as identity primary key,
  document_id uuid not null references agronomy.documents(id) on delete cascade,
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  content     text not null,
  page        int,
  section     text,
  embedding   extensions.vector(1536),   -- 1536-dim model (e.g. text-embedding-3-small)
  -- generated tsvector for the keyword half of hybrid search
  fts         tsvector generated always as (to_tsvector('english', content)) stored
);
create index agronomy_chunks_tenant_idx on agronomy.chunks(tenant_id);
create index agronomy_chunks_document_idx on agronomy.chunks(document_id);
create index agronomy_chunks_embedding_idx
  on agronomy.chunks using hnsw (embedding extensions.vector_cosine_ops);
create index agronomy_chunks_fts_idx on agronomy.chunks using gin (fts);

create table agronomy.conversations (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references public.tenants(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index agronomy_conversations_tenant_idx on agronomy.conversations(tenant_id);

create table agronomy.messages (
  id              bigint generated always as identity primary key,
  conversation_id uuid not null references agronomy.conversations(id) on delete cascade,
  tenant_id       uuid not null references public.tenants(id) on delete cascade,
  role            text not null check (role in ('user','assistant','system')),
  content         text not null,
  citations       jsonb,
  created_at      timestamptz not null default now()
);
create index agronomy_messages_conversation_idx on agronomy.messages(conversation_id);
create index agronomy_messages_tenant_idx on agronomy.messages(tenant_id);

-- --- RLS: tenant isolation on every table ---
alter table agronomy.documents     enable row level security;
alter table agronomy.chunks        enable row level security;
alter table agronomy.conversations enable row level security;
alter table agronomy.messages      enable row level security;

create policy tenant_select on agronomy.documents
  for select using (tenant_id = public.current_tenant_id());
create policy tenant_select on agronomy.chunks
  for select using (tenant_id = public.current_tenant_id());
create policy tenant_select on agronomy.conversations
  for select using (tenant_id = public.current_tenant_id());
create policy tenant_select on agronomy.messages
  for select using (tenant_id = public.current_tenant_id());

-- --- Grants: tools are behind auth, so the authenticated role (RLS-scoped) and
-- the service role get access; anon does not touch tool schemas. ---
grant usage on schema agronomy to authenticated, service_role;
grant select, insert, update, delete on all tables in schema agronomy
  to authenticated, service_role;
alter default privileges in schema agronomy
  grant select, insert, update, delete on tables to authenticated, service_role;
