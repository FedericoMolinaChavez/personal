import { requireTenant } from "@/lib/shared/auth/dal";
import { guardTool } from "@/lib/shared/toolGate";
import { retrieveChunks } from "@/lib/agronomy/retrieve";
import { rerankChunks } from "@/lib/agronomy/rerank";
import {
  buildCitations,
  buildMessages,
  streamAnswer,
  I_DONT_KNOW,
} from "@/lib/agronomy/answer";
import {
  appendMessage,
  createConversation,
  getMessages,
} from "@/lib/agronomy/conversations";
import { signedDocUrl } from "@/lib/agronomy/storage";
import { logLlmCall } from "@/lib/shared/logging/llmLog";
import { estimateCostUsd } from "@/lib/shared/llm/pricing";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * P1 — grounded chat over the document library, streamed as Server-Sent Events:
 *   event: meta    -> { conversationId }
 *   event: sources -> [{ marker, documentName, page, section, url }]
 *   event: token   -> { text }   (repeated)
 *   event: done    -> {}
 *   event: error   -> { message }
 * Retrieve -> re-rank -> stream a grounded answer (or "I don't know" when nothing
 * relevant survives the re-rank floor). Persists both turns and logs cost.
 */
export async function POST(request: Request) {
  const blocked = await guardTool(request);
  if (blocked) return blocked;
  const { tenantId } = await requireTenant();

  let body: { conversationId?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Expected JSON body." }, { status: 400 });
  }
  const message = (body.message ?? "").trim();
  if (!message) {
    return Response.json({ error: "Message is required." }, { status: 400 });
  }

  // Resolve the conversation and load prior turns (before this message).
  const conversationId =
    body.conversationId ?? (await createConversation(tenantId));
  const history = conversationId
    ? await getMessages(conversationId, tenantId)
    : [];
  if (conversationId) {
    await appendMessage({
      conversationId,
      tenantId,
      role: "user",
      content: message,
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );

      try {
        send("meta", { conversationId });

        const candidates = await retrieveChunks({
          tenantId,
          query: message,
          k: 20,
        });
        const ranked = await rerankChunks({
          tenantId,
          query: message,
          candidates,
          topK: 6,
        });

        const citations = buildCitations(ranked);
        const sources = await Promise.all(
          citations.map(async (c) => ({
            marker: c.marker,
            documentName: c.documentName,
            page: c.page,
            section: c.section,
            url: c.source ? await signedDocUrl(c.source) : null,
          })),
        );
        send("sources", sources);

        // Guardrail: nothing relevant -> decline rather than hallucinate.
        if (ranked.length === 0) {
          send("token", { text: I_DONT_KNOW });
          if (conversationId) {
            await appendMessage({
              conversationId,
              tenantId,
              role: "assistant",
              content: I_DONT_KNOW,
              citations: [],
            });
          }
          send("done", {});
          controller.close();
          return;
        }

        const messages = buildMessages({ question: message, chunks: ranked, history });
        const started = Date.now();
        const { textStream, usage } = streamAnswer(messages);

        let full = "";
        for await (const delta of textStream) {
          full += delta;
          send("token", { text: delta });
        }

        const u = await usage;
        await logLlmCall({
          tenantId,
          tool: "agronomy",
          model: u.model,
          promptTokens: u.promptTokens,
          completionTokens: u.completionTokens,
          costUsd: estimateCostUsd(u.model, u.promptTokens, u.completionTokens),
          latencyMs: Date.now() - started,
        });

        if (conversationId) {
          await appendMessage({
            conversationId,
            tenantId,
            role: "assistant",
            content: full,
            citations,
          });
        }

        send("done", {});
        controller.close();
      } catch (err) {
        send("error", {
          message: err instanceof Error ? err.message : "Something went wrong.",
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
