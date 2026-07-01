import type { SupabaseClient } from "@supabase/supabase-js";
import { getLLM } from "@/lib/shared/llm";
import { logLlmCall } from "@/lib/shared/logging/llmLog";
import { getSupabaseAdmin } from "@/lib/shared/supabase/server";
import { computeFieldMetrics } from "./metrics";
import { briefingSchema, type Briefing, type FieldMetrics } from "./schema";

/**
 * P3 — grounded AI briefing built from the computed metric JSON (never raw
 * imagery). The model may cite only numbers present in the input; each briefing
 * is stored in fields.briefings alongside the metrics it was generated from for
 * auditability (brief §6). Server-only.
 */

const SYSTEM = `You are an agronomy operations assistant. You write a short weekly field-health briefing for a grower, grounded STRICTLY in the metrics JSON provided.

Rules:
- Use ONLY numbers that appear in the input JSON. Never invent or estimate an NDVI value, percentage, temperature, rainfall, or price. When you cite a number it must match the input exactly.
- Refer to each field by its "name".
- Flag any field whose NDVI is declining (negative ndvi.changePct); the larger the drop, the more urgent.
- Where the weather numbers plausibly explain a change (low rainfall, heat, high wind), say so; otherwise do not speculate about causes.
- Suggest 1-2 concrete actions for each field that needs attention: scout, irrigate, or hold/sell (use the price change to inform sell/hold). Healthy, stable fields need no action.
- If a field's data is insufficient (ndvi.sufficient is false), set its status to "insufficient_data" and say the coverage is too low to assess — do not guess.`;

export interface BriefingResult {
  summary: string;
  briefing: Briefing | null;
  metrics: FieldMetrics[];
}

export async function generateBriefing(
  tenantId: string,
): Promise<BriefingResult> {
  const metrics = await computeFieldMetrics(tenantId);

  const started = Date.now();
  const { data, usage } = await getLLM().extract({
    system: SYSTEM,
    text: `Field metrics JSON:\n${JSON.stringify(metrics, null, 2)}`,
    schema: briefingSchema,
  });

  await logLlmCall({
    tenantId,
    tool: "fields",
    model: usage.model,
    promptTokens: usage.promptTokens,
    completionTokens: usage.completionTokens,
    latencyMs: Date.now() - started,
  });

  const summary =
    data?.summary ??
    "Could not generate a briefing from the available data.";

  // Persist with the metrics JSON it was generated from (auditability).
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const db = supabase as unknown as SupabaseClient;
    const dates = metrics
      .map((m) => m.ndvi.capturedOn)
      .filter((d): d is string => !!d)
      .sort();
    await db.schema("fields").from("briefings").insert({
      tenant_id: tenantId,
      period_start: dates[0] ?? null,
      period_end: dates[dates.length - 1] ?? null,
      summary,
      metrics: { fields: metrics, briefing: data },
    });
  }

  return { summary, briefing: data, metrics };
}

export interface StoredBriefing {
  id: string;
  created_at: string;
  period_start: string | null;
  period_end: string | null;
  summary: string;
  metrics: { fields: FieldMetrics[]; briefing: Briefing | null } | null;
}

/** The most recent stored briefing for a tenant (for the dashboard). */
export async function getLatestBriefing(
  tenantId: string,
): Promise<StoredBriefing | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const db = supabase as unknown as SupabaseClient;
  const { data } = await db
    .schema("fields")
    .from("briefings")
    .select("id,created_at,period_start,period_end,summary,metrics")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as StoredBriefing) ?? null;
}
