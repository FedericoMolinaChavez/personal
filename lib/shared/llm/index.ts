/**
 * Provider-agnostic LLM wrapper used by every tool, so the provider can be
 * swapped in one place. This is a stub — wire a real provider when building
 * P1/P2.
 *
 * Default to the latest Anthropic Claude model. Before implementing the real
 * provider call, read the `claude-api` skill and AGENTS.md (this repo runs a
 * customized Next.js). Add the Anthropic SDK dependency at that point — it is
 * intentionally not a dependency yet.
 */

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export interface LLMProvider {
  chat(messages: ChatMessage[], opts?: { model?: string }): Promise<string>;
  embed(input: string | string[]): Promise<number[][]>;
}

class UnconfiguredProvider implements LLMProvider {
  async chat(): Promise<string> {
    throw new Error(
      "LLM provider not configured. Set LLM_PROVIDER/LLM_API_KEY and implement lib/shared/llm/providers.",
    );
  }
  async embed(): Promise<number[][]> {
    throw new Error("LLM provider not configured.");
  }
}

let provider: LLMProvider | null = null;

/** Returns the active LLM provider (a stub until one is implemented). */
export function getLLM(): LLMProvider {
  if (!provider) provider = new UnconfiguredProvider();
  return provider;
}
