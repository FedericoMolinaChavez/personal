import { getSupabaseAdmin } from "@/lib/shared/supabase/server";

export type LlmLogEntry = {
  tenantId: string | null;
  tool: "agronomy" | "spray" | "fields";
  model?: string;
  promptTokens?: number;
  completionTokens?: number;
  costUsd?: number;
  latencyMs?: number;
};

/**
 * Record one LLM call to public.llm_logs for cross-tool cost/latency
 * observability. No-op when Supabase isn't configured. Uses the service-role
 * client (bypasses RLS) — tenant_id is set explicitly by the caller.
 */
export async function logLlmCall(entry: LlmLogEntry): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  // Loose cast until generated types (db:types) cover the public schema tables.
  const sb = supabase as unknown as {
    from: (t: string) => { insert: (v: unknown) => Promise<{ error: unknown }> };
  };
  await sb.from("llm_logs").insert({
    tenant_id: entry.tenantId,
    tool: entry.tool,
    model: entry.model,
    prompt_tokens: entry.promptTokens,
    completion_tokens: entry.completionTokens,
    cost_usd: entry.costUsd,
    latency_ms: entry.latencyMs,
  });
}
