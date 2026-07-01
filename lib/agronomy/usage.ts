import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/shared/supabase/server";
import { estimateCostUsd } from "@/lib/shared/llm/pricing";

export type UsageRow = {
  model: string | null;
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
  latencyMs: number | null;
  createdAt: string;
};

export type AgronomyUsage = {
  totalCalls: number;
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
  avgLatencyMs: number | null;
  recent: UsageRow[];
};

type LlmLogRow = {
  model: string | null;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  cost_usd: number | null;
  latency_ms: number | null;
  created_at: string;
};

const EMPTY: AgronomyUsage = {
  totalCalls: 0,
  promptTokens: 0,
  completionTokens: 0,
  costUsd: 0,
  avgLatencyMs: null,
  recent: [],
};

/**
 * Aggregate public.llm_logs for tool='agronomy' for a tenant: totals plus the
 * most recent calls. Cost falls back to the pricing table when cost_usd is null.
 */
export async function getAgronomyUsage(
  tenantId: string,
): Promise<AgronomyUsage> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return EMPTY;
  const db = supabase as unknown as SupabaseClient;

  const { data, error } = await db
    .from("llm_logs")
    .select("model,prompt_tokens,completion_tokens,cost_usd,latency_ms,created_at")
    .eq("tenant_id", tenantId)
    .eq("tool", "agronomy")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw new Error(`getAgronomyUsage failed: ${error.message}`);

  const rows = (data ?? []) as LlmLogRow[];
  let promptTokens = 0;
  let completionTokens = 0;
  let costUsd = 0;
  let latencySum = 0;
  let latencyCount = 0;

  const mapped: UsageRow[] = rows.map((r) => {
    const p = r.prompt_tokens ?? 0;
    const c = r.completion_tokens ?? 0;
    const cost = r.cost_usd ?? estimateCostUsd(r.model ?? "", p, c) ?? 0;
    promptTokens += p;
    completionTokens += c;
    costUsd += cost;
    if (r.latency_ms != null) {
      latencySum += r.latency_ms;
      latencyCount += 1;
    }
    return {
      model: r.model,
      promptTokens: p,
      completionTokens: c,
      costUsd: cost,
      latencyMs: r.latency_ms,
      createdAt: r.created_at,
    };
  });

  return {
    totalCalls: rows.length,
    promptTokens,
    completionTokens,
    costUsd,
    avgLatencyMs: latencyCount ? Math.round(latencySum / latencyCount) : null,
    recent: mapped.slice(0, 20),
  };
}
