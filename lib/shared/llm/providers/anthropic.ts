import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type {
  ChatMessage,
  ExtractParams,
  ExtractResult,
  LLMProvider,
} from "../index";

type ImageMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

/**
 * Anthropic implementation of the shared LLMProvider. Uses the Messages API:
 * `messages.parse` + `zodOutputFormat` for structured extraction (vision + text).
 * No `temperature`/`budget_tokens` — removed on Claude 4.x; thinking is omitted
 * (off by default) to keep extraction latency low.
 */
export class AnthropicProvider implements LLMProvider {
  private client: Anthropic;
  private defaultModel: string;

  constructor(apiKey: string, defaultModel: string) {
    this.client = new Anthropic({ apiKey });
    this.defaultModel = defaultModel;
  }

  async chat(
    messages: ChatMessage[],
    opts?: { model?: string },
  ): Promise<string> {
    const model = opts?.model ?? this.defaultModel;
    const system =
      messages
        .filter((m) => m.role === "system")
        .map((m) => m.content)
        .join("\n\n") || undefined;
    const turns = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    const res = await this.client.messages.create({
      model,
      max_tokens: 4096,
      system,
      messages: turns,
    });
    return res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
  }

  async embed(): Promise<number[][]> {
    throw new Error(
      "Anthropic provider has no embeddings endpoint; wire a dedicated embeddings provider for P1.",
    );
  }

  async extract<T>(p: ExtractParams<T>): Promise<ExtractResult<T>> {
    const model = p.model ?? this.defaultModel;

    const content: Anthropic.ContentBlockParam[] = [];
    for (const img of p.images ?? []) {
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: img.mediaType as ImageMediaType,
          data: img.base64,
        },
      });
    }
    content.push({ type: "text", text: p.text });

    const res = await this.client.messages.parse({
      model,
      max_tokens: 4096,
      system: p.system,
      messages: [{ role: "user", content }],
      output_config: { format: zodOutputFormat(p.schema) },
    });

    return {
      data: (res.parsed_output as T | null) ?? null,
      usage: {
        model,
        promptTokens: res.usage.input_tokens,
        completionTokens: res.usage.output_tokens,
      },
    };
  }
}
