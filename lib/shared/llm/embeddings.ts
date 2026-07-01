import OpenAI from "openai";

/**
 * Embeddings provider for P1 (agronomy RAG). The Anthropic Messages API has no
 * embeddings endpoint, so document + query embeddings use OpenAI. The default
 * model `text-embedding-3-small` is 1536-dim, matching agronomy.chunks.embedding.
 * Server-only: never import from a Client Component (OPENAI_API_KEY is not
 * NEXT_PUBLIC_). Returns a stub that throws when the key is absent, mirroring the
 * UnconfiguredProvider pattern in ./index.ts.
 */

export type EmbedResult = {
  /** One vector per input, in the same order as the inputs. */
  vectors: number[][];
  /** Total tokens billed across all batches (for cost logging). */
  tokens: number;
  model: string;
};

export interface EmbeddingsProvider {
  embed(input: string | string[]): Promise<EmbedResult>;
}

/** OpenAI accepts large input arrays; batch to stay well within request limits. */
const BATCH_SIZE = 256;

class OpenAIEmbeddings implements EmbeddingsProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async embed(input: string | string[]): Promise<EmbedResult> {
    const texts = Array.isArray(input) ? input : [input];
    const vectors: number[][] = [];
    let tokens = 0;

    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const slice = texts.slice(i, i + BATCH_SIZE);
      const res = await this.client.embeddings.create({
        model: this.model,
        input: slice,
      });
      // res.data is ordered to match the input array.
      for (const d of res.data) vectors.push(d.embedding as number[]);
      tokens += res.usage?.total_tokens ?? 0;
    }

    return { vectors, tokens, model: this.model };
  }
}

class UnconfiguredEmbeddings implements EmbeddingsProvider {
  async embed(): Promise<EmbedResult> {
    throw new Error(
      "Embeddings provider not configured. Set OPENAI_API_KEY (and optionally EMBEDDING_MODEL).",
    );
  }
}

let provider: EmbeddingsProvider | null = null;

/**
 * Returns the active embeddings provider. OpenAI when OPENAI_API_KEY is set,
 * otherwise a stub that throws (placeholder mode, matching the rest of the app).
 */
export function getEmbeddings(): EmbeddingsProvider {
  if (provider) return provider;

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    const model = process.env.EMBEDDING_MODEL ?? "text-embedding-3-small";
    provider = new OpenAIEmbeddings(apiKey, model);
  } else {
    provider = new UnconfiguredEmbeddings();
  }
  return provider;
}
