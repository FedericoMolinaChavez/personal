/**
 * P1 — vector retrieval over agronomy.chunks. Embeds the query (OpenAI) and
 * calls the agronomy.match_chunks RPC (pgvector cosine, joined to documents for
 * citation names). The fts column remains for a later hybrid-search upgrade.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/shared/supabase/server";
import { getEmbeddings } from "@/lib/shared/llm/embeddings";
import { logLlmCall } from "@/lib/shared/logging/llmLog";
import { estimateCostUsd } from "@/lib/shared/llm/pricing";

export type RetrievedChunk = {
  id: number;
  documentId: string;
  documentName: string;
  documentSource: string | null;
  content: string;
  page: number | null;
  section: string | null;
  similarity: number;
};

type MatchRow = {
  id: number;
  document_id: string;
  document_name: string;
  document_source: string | null;
  content: string;
  page: number | null;
  section: string | null;
  similarity: number;
};

export async function retrieveChunks(params: {
  tenantId: string;
  query: string;
  k?: number;
}): Promise<RetrievedChunk[]> {
  const { tenantId, query } = params;
  const k = params.k ?? 20;

  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const started = Date.now();
  const { vectors, tokens, model } = await getEmbeddings().embed(query);
  await logLlmCall({
    tenantId,
    tool: "agronomy",
    model,
    promptTokens: tokens,
    costUsd: estimateCostUsd(model, tokens, 0),
    latencyMs: Date.now() - started,
  });

  const db = supabase as unknown as SupabaseClient;
  const { data, error } = await db.schema("agronomy").rpc("match_chunks", {
    query_embedding: vectors[0],
    match_count: k,
    p_tenant: tenantId,
  });
  if (error) throw new Error(`match_chunks failed: ${error.message}`);

  return ((data ?? []) as MatchRow[]).map((r) => ({
    id: r.id,
    documentId: r.document_id,
    documentName: r.document_name,
    documentSource: r.document_source,
    content: r.content,
    page: r.page,
    section: r.section,
    similarity: r.similarity,
  }));
}
