/**
 * P1 — grounded answer + citations from retrieved chunks. The model answers only
 * from the numbered context and never invents a rate/REI/PHI/EPA number; when no
 * relevant context is found the route short-circuits to I_DONT_KNOW.
 */
import { getLLM, type ChatMessage, type ChatStream } from "@/lib/shared/llm";
import type { RetrievedChunk } from "./retrieve";
import type { StoredMessage } from "./conversations";

/** A source the answer can cite, by bracket marker [n]. */
export type Citation = {
  marker: number;
  documentId: string;
  documentName: string;
  /** Storage path of the original file (for a signed source link); may be null. */
  source: string | null;
  page: number | null;
  section: string | null;
};

export const I_DONT_KNOW =
  "I don't know — the documents provided don't contain information that answers that question.";

const SYSTEM = `You are an agronomy knowledge assistant. Answer the user's question using ONLY the numbered context passages provided.

Rules:
- If the answer is not contained in the context, say you don't know and that the documents don't cover it. Never use outside knowledge or guess.
- Never invent or alter a rate, re-entry interval (REI), pre-harvest interval (PHI), EPA registration number, or any other figure — quote it exactly as written in the context.
- Cite every factual claim with the bracketed source number(s) it came from, e.g. [1] or [2][3]. Only cite numbers that appear in the context.
- Be concise and practical.`;

/** Citation metadata for each retrieved chunk, numbered [1..n] in order. */
export function buildCitations(chunks: RetrievedChunk[]): Citation[] {
  return chunks.map((c, i) => ({
    marker: i + 1,
    documentId: c.documentId,
    documentName: c.documentName,
    source: c.documentSource,
    page: c.page,
    section: c.section,
  }));
}

function contextBlock(chunks: RetrievedChunk[]): string {
  return chunks
    .map((c, i) => {
      const loc = [
        c.documentName,
        c.page != null ? `p.${c.page}` : null,
        c.section,
      ]
        .filter(Boolean)
        .join(", ");
      return `[${i + 1}] ${loc}\n${c.content}`;
    })
    .join("\n\n");
}

/** Build the grounded message list: system + prior turns + context-wrapped question. */
export function buildMessages(params: {
  question: string;
  chunks: RetrievedChunk[];
  history?: StoredMessage[];
}): ChatMessage[] {
  const messages: ChatMessage[] = [{ role: "system", content: SYSTEM }];
  for (const m of params.history ?? []) {
    if (m.role === "user" || m.role === "assistant") {
      messages.push({ role: m.role, content: m.content });
    }
  }
  messages.push({
    role: "user",
    content: `Context:\n${contextBlock(params.chunks)}\n\nQuestion: ${params.question}`,
  });
  return messages;
}

/** Stream a grounded answer for the given messages. */
export function streamAnswer(messages: ChatMessage[]): ChatStream {
  return getLLM().stream(messages);
}
