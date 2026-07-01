-- ============================================================================
-- P1 — Agronomy RAG: vector similarity search RPC.
-- supabase-js can't express the pgvector `<=>` operator through the query
-- builder, so retrieval goes through this function. The query embedding is
-- passed from the server (number[] -> vector) and the call is tenant-scoped via
-- p_tenant. SECURITY DEFINER so it can be called by the service-role retrieval
-- path; results are joined to documents to give citations a name + page/section.
-- ============================================================================

create or replace function agronomy.match_chunks(
  query_embedding extensions.vector(1536),
  match_count int,
  p_tenant uuid
)
returns table (
  id              bigint,
  document_id     uuid,
  document_name   text,
  document_source text,
  content         text,
  page            int,
  section         text,
  similarity      float
)
language sql
stable
security definer
set search_path = extensions, agronomy, public
as $$
  select
    c.id,
    c.document_id,
    d.name as document_name,
    d.source as document_source,
    c.content,
    c.page,
    c.section,
    1 - (c.embedding <=> query_embedding) as similarity
  from agronomy.chunks c
  join agronomy.documents d on d.id = c.document_id
  where c.tenant_id = p_tenant
    and c.embedding is not null
  order by c.embedding <=> query_embedding
  limit match_count
$$;

grant execute on function agronomy.match_chunks(extensions.vector, int, uuid)
  to authenticated, service_role;
