/**
 * P1 — LLM re-rank pass over vector candidates. Scores each passage's relevance
 * to the question and keeps the top-K above a floor; an empty result drives the
 * "I don't know" guardrail in the chat route. A dedicated reranker
 * (Cohere/Voyage) is the future upgrade.
 */
import { z } from "zod";
import { getLLM } from "@/lib/shared/llm";
import { logLlmCall } from "@/lib/shared/logging/llmLog";
import { estimateCostUsd } from "@/lib/shared/llm/pricing";
import type { RetrievedChunk } from "./retrieve";

const rankSchema = z.object({
  rankings: z.array(
    z.object({
      index: z.number().int(),
      relevance: z.number(),
    }),
  ),
});

const SYSTEM = `You are a retrieval re-ranker for an agronomy Q&A system. Score how well each numbered passage helps answer the question, from 0 (irrelevant) to 1 (directly answers it). Judge only whether the passage contains the information needed — do not use outside knowledge. Return a score for every passage index.`;

export async function rerankChunks(params: {
  tenantId: string;
  query: string;
  candidates: RetrievedChunk[];
  topK?: number;
  floor?: number;
}): Promise<RetrievedChunk[]> {
  const topK = params.topK ?? 6;
  const floor = params.floor ?? 0.5;
  const { candidates } = params;
  if (candidates.length === 0) return [];

  const list = candidates
    .map((c, i) => {
      const loc = [c.documentName, c.page != null ? `p.${c.page}` : null]
        .filter(Boolean)
        .join(", ");
      return `[${i}] (${loc})\n${c.content.slice(0, 1200)}`;
    })
    .join("\n\n");

  const text = `Question:\n${params.query}\n\nPassages:\n${list}`;

  const started = Date.now();
  const { data, usage } = await getLLM().extract({
    system: SYSTEM,
    text,
    schema: rankSchema,
  });
  await logLlmCall({
    tenantId: params.tenantId,
    tool: "agronomy",
    model: usage.model,
    promptTokens: usage.promptTokens,
    completionTokens: usage.completionTokens,
    costUsd: estimateCostUsd(usage.model, usage.promptTokens, usage.completionTokens),
    latencyMs: Date.now() - started,
  });

  // Fallback to vector order if the re-rank call didn't parse.
  if (!data) return candidates.slice(0, topK);

  return data.rankings
    .filter((r) => r.index >= 0 && r.index < candidates.length)
    .map((r) => ({ chunk: candidates[r.index], relevance: r.relevance }))
    .filter((r) => r.relevance >= floor)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, topK)
    .map((r) => r.chunk);
}
