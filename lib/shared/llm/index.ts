import type { ZodType } from "zod";
import { AnthropicProvider } from "./providers/anthropic";

/**
 * Provider-agnostic LLM wrapper used by every tool, so the provider can be
 * swapped in one place. The Anthropic provider (default) is implemented in
 * ./providers/anthropic.ts; consult the `claude-api` skill before changing it.
 * Server-only: importing this pulls in the Anthropic SDK, so never import it
 * from a Client Component.
 */

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

/** A base64-encoded image for vision extraction (media_type e.g. "image/jpeg"). */
export type LLMImage = { mediaType: string; base64: string };

export type ExtractParams<T> = {
  system?: string;
  text: string;
  images?: LLMImage[];
  schema: ZodType<T>;
  model?: string;
};

export type LLMUsage = {
  model: string;
  promptTokens: number;
  completionTokens: number;
};

export type ExtractResult<T> = {
  /** Parsed object, or null when the model refused / output didn't parse. */
  data: T | null;
  usage: LLMUsage;
};

export interface LLMProvider {
  chat(messages: ChatMessage[], opts?: { model?: string }): Promise<string>;
  embed(input: string | string[]): Promise<number[][]>;
  /** Structured extraction from text and/or images against a Zod schema. */
  extract<T>(params: ExtractParams<T>): Promise<ExtractResult<T>>;
}

class UnconfiguredProvider implements LLMProvider {
  async chat(): Promise<string> {
    throw new Error(
      "LLM provider not configured. Set LLM_PROVIDER=anthropic and LLM_API_KEY.",
    );
  }
  async embed(): Promise<number[][]> {
    throw new Error("LLM provider not configured.");
  }
  async extract<T>(): Promise<ExtractResult<T>> {
    throw new Error(
      "LLM provider not configured. Set LLM_PROVIDER=anthropic and LLM_API_KEY.",
    );
  }
}

let provider: LLMProvider | null = null;

/**
 * Returns the active LLM provider. Anthropic when configured, otherwise a stub
 * that throws (placeholder mode, matching the rest of the app).
 */
export function getLLM(): LLMProvider {
  if (provider) return provider;

  const apiKey = process.env.LLM_API_KEY;
  const wantsAnthropic =
    (process.env.LLM_PROVIDER ?? "anthropic").toLowerCase() === "anthropic";

  if (wantsAnthropic && apiKey) {
    const model = process.env.LLM_MODEL ?? "claude-sonnet-4-6";
    provider = new AnthropicProvider(apiKey, model);
  } else {
    provider = new UnconfiguredProvider();
  }
  return provider;
}
