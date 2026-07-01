import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/shared/supabase/server";

export type MessageRole = "user" | "assistant" | "system";

export type StoredMessage = {
  role: MessageRole;
  content: string;
  citations: unknown | null;
};

function agronomyDb(): SupabaseClient | null {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  return supabase as unknown as SupabaseClient;
}

/** Create a conversation thread for a tenant; returns its id (null in placeholder mode). */
export async function createConversation(
  tenantId: string,
): Promise<string | null> {
  const db = agronomyDb();
  if (!db) return null;
  const { data, error } = await db
    .schema("agronomy")
    .from("conversations")
    .insert({ tenant_id: tenantId })
    .select("id")
    .single();
  if (error || !data) {
    throw new Error(`createConversation failed: ${error?.message ?? "no row"}`);
  }
  return data.id as string;
}

/** Append one turn to a conversation. citations is stored as jsonb (assistant turns). */
export async function appendMessage(params: {
  conversationId: string;
  tenantId: string;
  role: MessageRole;
  content: string;
  citations?: unknown;
}): Promise<void> {
  const db = agronomyDb();
  if (!db) return;
  const { error } = await db
    .schema("agronomy")
    .from("messages")
    .insert({
      conversation_id: params.conversationId,
      tenant_id: params.tenantId,
      role: params.role,
      content: params.content,
      citations: params.citations ?? null,
    });
  if (error) throw new Error(`appendMessage failed: ${error.message}`);
}

/** Prior turns for a conversation, oldest first, tenant-scoped. */
export async function getMessages(
  conversationId: string,
  tenantId: string,
): Promise<StoredMessage[]> {
  const db = agronomyDb();
  if (!db) return [];
  const { data, error } = await db
    .schema("agronomy")
    .from("messages")
    .select("role,content,citations")
    .eq("conversation_id", conversationId)
    .eq("tenant_id", tenantId)
    .order("id", { ascending: true });
  if (error) throw new Error(`getMessages failed: ${error.message}`);
  return (data ?? []) as StoredMessage[];
}
