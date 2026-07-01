/**
 * Per-model USD pricing, in dollars per 1M tokens, used to populate
 * public.llm_logs.cost_usd so the usage dashboard can show spend. Embedding
 * models have no output price. Keep these in sync with provider pricing pages;
 * an unknown model returns undefined (cost_usd stays null).
 */
type Pricing = { inputPerMTok: number; outputPerMTok: number };

const PRICING: Record<string, Pricing> = {
  // Anthropic (chat / rerank)
  "claude-opus-4-8": { inputPerMTok: 5, outputPerMTok: 25 },
  "claude-sonnet-4-6": { inputPerMTok: 3, outputPerMTok: 15 },
  "claude-haiku-4-5": { inputPerMTok: 1, outputPerMTok: 5 },
  // OpenAI (embeddings)
  "text-embedding-3-small": { inputPerMTok: 0.02, outputPerMTok: 0 },
  "text-embedding-3-large": { inputPerMTok: 0.13, outputPerMTok: 0 },
};

/**
 * Estimate the USD cost of a single model call. Returns undefined for an unknown
 * model so callers can omit cost_usd rather than log a wrong number.
 */
export function estimateCostUsd(
  model: string,
  promptTokens = 0,
  completionTokens = 0,
): number | undefined {
  const p = PRICING[model];
  if (!p) return undefined;
  return (
    (promptTokens * p.inputPerMTok + completionTokens * p.outputPerMTok) /
    1_000_000
  );
}
