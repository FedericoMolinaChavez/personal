import { getLLM, type LLMImage } from "@/lib/shared/llm";
import { logLlmCall } from "@/lib/shared/logging/llmLog";
import { sprayRecordSchema, type SprayRecordDraft } from "./schema";

const SYSTEM = `You extract pesticide / spray application records from messy field inputs: a photo of a paper log, a typed note, or both.

Rules:
- Return ONLY fields you can actually read or confidently infer. If a field is absent or illegible, set it to null — never guess a product name, rate, EPA number, or date.
- Capture rates as a number plus a separate unit (e.g. "16 oz/acre" -> rate 16, unit "oz/acre").
- Set "confidence" to your overall confidence (0-1) that the record is correct; lower it when handwriting is unclear or required fields are missing.
- Put anything ambiguous or illegible in "notes".`;

export type ExtractInput = {
  tenantId: string;
  text?: string;
  image?: LLMImage;
};

/**
 * Extract a structured spray record from a note and/or photo using the shared
 * LLM provider, logging the call to public.llm_logs. Returns null when the model
 * declines or the output doesn't parse.
 */
export async function extractRecord(
  input: ExtractInput,
): Promise<SprayRecordDraft | null> {
  const userText = input.text?.trim()
    ? `Operator note:\n${input.text.trim()}`
    : "Extract the spray application record from the attached photo.";

  const started = Date.now();
  const { data, usage } = await getLLM().extract({
    system: SYSTEM,
    text: userText,
    images: input.image ? [input.image] : undefined,
    schema: sprayRecordSchema,
  });

  await logLlmCall({
    tenantId: input.tenantId,
    tool: "spray",
    model: usage.model,
    promptTokens: usage.promptTokens,
    completionTokens: usage.completionTokens,
    latencyMs: Date.now() - started,
  });

  return data;
}
