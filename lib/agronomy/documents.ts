import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/shared/supabase/server";

export type DocumentStatus = "pending" | "ingesting" | "ready" | "failed";

/**
 * Service-role client scoped to the `agronomy` schema. Cast to the default
 * (untyped) SupabaseClient so the query builder works before generated types
 * (`npm run db:types`) cover the per-tool schemas. Returns null in placeholder
 * mode. Mirrors sprayDb() in lib/spray/records.ts.
 */
function agronomyDb(): SupabaseClient | null {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  return supabase as unknown as SupabaseClient;
}

export async function createDocument(params: {
  tenantId: string;
  name: string;
  /** Storage path of the original file, used for citation source links. */
  source: string | null;
}): Promise<string | null> {
  const db = agronomyDb();
  if (!db) return null;
  const { data, error } = await db
    .schema("agronomy")
    .from("documents")
    .insert({
      tenant_id: params.tenantId,
      name: params.name,
      source: params.source,
      status: "pending",
    })
    .select("id")
    .single();
  if (error || !data) {
    throw new Error(`createDocument failed: ${error?.message ?? "no row"}`);
  }
  return data.id as string;
}

export async function setDocumentStatus(params: {
  tenantId: string;
  documentId: string;
  status: DocumentStatus;
  pageCount?: number | null;
}): Promise<void> {
  const db = agronomyDb();
  if (!db) return;
  const patch: Record<string, unknown> = { status: params.status };
  if (params.pageCount !== undefined) patch.page_count = params.pageCount;
  const { error } = await db
    .schema("agronomy")
    .from("documents")
    .update(patch)
    .eq("id", params.documentId)
    .eq("tenant_id", params.tenantId);
  if (error) throw new Error(`setDocumentStatus failed: ${error.message}`);
}

export type ChunkInsert = {
  content: string;
  page: number | null;
  section: string | null;
  embedding: number[];
};

/**
 * Bulk-insert chunks for a document. The embedding (number[]) is stored into the
 * pgvector column — PostgREST serializes the JSON array to pgvector's `[...]`
 * text form. Inserts in batches to keep the request payload bounded.
 */
export async function insertChunks(params: {
  tenantId: string;
  documentId: string;
  chunks: ChunkInsert[];
}): Promise<number> {
  const db = agronomyDb();
  if (!db) throw new Error("Supabase not configured");

  const BATCH = 100;
  let inserted = 0;
  for (let i = 0; i < params.chunks.length; i += BATCH) {
    const rows = params.chunks.slice(i, i + BATCH).map((c) => ({
      tenant_id: params.tenantId,
      document_id: params.documentId,
      content: c.content,
      page: c.page,
      section: c.section,
      embedding: c.embedding,
    }));
    const { error } = await db.schema("agronomy").from("chunks").insert(rows);
    if (error) throw new Error(`insertChunks failed: ${error.message}`);
    inserted += rows.length;
  }
  return inserted;
}

export type DocumentView = {
  id: string;
  name: string;
  status: DocumentStatus;
  pageCount: number | null;
  source: string | null;
  chunkCount: number;
  createdAt: string;
};

type DocumentRow = {
  id: string;
  name: string;
  status: DocumentStatus;
  page_count: number | null;
  source: string | null;
  created_at: string;
  chunks: { count: number }[] | null;
};

export async function listDocuments(
  tenantId: string,
): Promise<DocumentView[]> {
  const db = agronomyDb();
  if (!db) return [];
  const { data, error } = await db
    .schema("agronomy")
    .from("documents")
    .select("id,name,status,page_count,source,created_at,chunks(count)")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(`listDocuments failed: ${error.message}`);
  return ((data ?? []) as DocumentRow[]).map((d) => ({
    id: d.id,
    name: d.name,
    status: d.status,
    pageCount: d.page_count,
    source: d.source,
    chunkCount: d.chunks?.[0]?.count ?? 0,
    createdAt: d.created_at,
  }));
}

/**
 * Delete a document (chunks cascade via the FK) and its original file from
 * storage. Tenant-scoped so a caller can only delete their own documents.
 */
export async function deleteDocument(
  tenantId: string,
  documentId: string,
): Promise<void> {
  const db = agronomyDb();
  if (!db) throw new Error("Supabase not configured");

  const { data: doc } = await db
    .schema("agronomy")
    .from("documents")
    .select("source")
    .eq("id", documentId)
    .eq("tenant_id", tenantId)
    .single();

  const { error } = await db
    .schema("agronomy")
    .from("documents")
    .delete()
    .eq("id", documentId)
    .eq("tenant_id", tenantId);
  if (error) throw new Error(`deleteDocument failed: ${error.message}`);

  const source = (doc as { source?: string | null } | null)?.source;
  if (source) {
    const supabase = getSupabaseAdmin();
    await supabase?.storage.from("agronomy-docs").remove([source]);
  }
}
