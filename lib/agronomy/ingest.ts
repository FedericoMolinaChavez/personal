/**
 * P1 — Agronomy Knowledge Assistant: parse + chunk + embed documents into
 * agronomy.chunks. Runs inline in the upload request, driving the document
 * status lifecycle (pending -> ingesting -> ready | failed). May import from
 * lib/shared and lib/agronomy only (never other tools).
 */
import mammoth from "mammoth";
import { getEmbeddings } from "@/lib/shared/llm/embeddings";
import { estimateCostUsd } from "@/lib/shared/llm/pricing";
import { logLlmCall } from "@/lib/shared/logging/llmLog";
import { insertChunks, setDocumentStatus } from "./documents";

/** A parsed unit of a document carrying citation metadata. */
type ParsedBlock = { page: number | null; section: string | null; text: string };

/** Target/overlap sizing in characters (~4 chars/token → ~500–800 tokens). */
const TARGET_CHARS = 3000;
const OVERLAP_CHARS = 400;

export type SupportedExt = "pdf" | "docx" | "txt" | "md";

export function extOf(fileName: string): SupportedExt | null {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf" || ext === "docx" || ext === "txt" || ext === "md") {
    return ext;
  }
  return null;
}

async function parsePdf(
  bytes: Uint8Array,
): Promise<{ blocks: ParsedBlock[]; pageCount: number }> {
  // pdf-parse v2 is ESM + pdfjs-based; import dynamically so it isn't pulled
  // into the edge/client bundle. getText() returns per-page text.
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: bytes });
  try {
    const result = await parser.getText();
    const blocks: ParsedBlock[] = result.pages
      .filter((p) => p.text && p.text.trim())
      .map((p) => ({ page: p.num, section: null, text: p.text }));
    return { blocks, pageCount: result.total };
  } finally {
    await parser.destroy();
  }
}

async function parseDocx(buffer: Buffer): Promise<ParsedBlock[]> {
  const { value } = await mammoth.extractRawText({ buffer });
  if (!value.trim()) return [];
  return [{ page: null, section: null, text: value }];
}

/** Markdown: split into sections by ATX headings so chunks get a section label. */
function parseMarkdown(text: string): ParsedBlock[] {
  const lines = text.split(/\r?\n/);
  const blocks: ParsedBlock[] = [];
  let section: string | null = null;
  let buf: string[] = [];
  const flush = () => {
    const body = buf.join("\n").trim();
    if (body) blocks.push({ page: null, section, text: body });
    buf = [];
  };
  for (const line of lines) {
    const heading = /^#{1,6}\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      section = heading[1].trim();
    } else {
      buf.push(line);
    }
  }
  flush();
  return blocks.length ? blocks : [{ page: null, section: null, text }];
}

/** Split one block's text into overlapping, paragraph-aware chunks. */
function chunkBlock(block: ParsedBlock): ParsedBlock[] {
  const units: string[] = [];
  const paras = block.text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  for (const p of paras) {
    if (p.length <= TARGET_CHARS) {
      units.push(p);
    } else {
      for (let i = 0; i < p.length; i += TARGET_CHARS) {
        units.push(p.slice(i, i + TARGET_CHARS));
      }
    }
  }

  const chunks: ParsedBlock[] = [];
  let cur = "";
  for (const u of units) {
    if (cur && cur.length + 1 + u.length > TARGET_CHARS) {
      chunks.push({ page: block.page, section: block.section, text: cur });
      const tail = cur.slice(Math.max(0, cur.length - OVERLAP_CHARS));
      cur = `${tail} ${u}`;
    } else {
      cur = cur ? `${cur} ${u}` : u;
    }
  }
  if (cur.trim()) {
    chunks.push({ page: block.page, section: block.section, text: cur.trim() });
  }
  return chunks;
}

/**
 * Parse, chunk, embed, and store a document. Drives the status lifecycle and
 * logs embedding cost. Throws (after marking the document failed) on any error
 * so the route can surface it. Returns the number of chunks stored.
 */
export async function ingestDocument(params: {
  tenantId: string;
  documentId: string;
  file: File;
}): Promise<number> {
  const { tenantId, documentId, file } = params;
  const ext = extOf(file.name);
  if (!ext) throw new Error(`Unsupported file type: ${file.name}`);

  try {
    await setDocumentStatus({ tenantId, documentId, status: "ingesting" });

    const arrayBuffer = await file.arrayBuffer();
    let blocks: ParsedBlock[] = [];
    let pageCount: number | null = null;

    if (ext === "pdf") {
      const parsed = await parsePdf(new Uint8Array(arrayBuffer));
      blocks = parsed.blocks;
      pageCount = parsed.pageCount;
    } else if (ext === "docx") {
      blocks = await parseDocx(Buffer.from(arrayBuffer));
    } else {
      const text = Buffer.from(arrayBuffer).toString("utf-8");
      blocks = ext === "md" ? parseMarkdown(text) : [{ page: null, section: null, text }];
    }

    const chunks = blocks.flatMap(chunkBlock).filter((c) => c.text.trim());
    if (chunks.length === 0) {
      throw new Error("No extractable text found in the document.");
    }

    const started = Date.now();
    const { vectors, tokens, model } = await getEmbeddings().embed(
      chunks.map((c) => c.text),
    );
    if (vectors.length !== chunks.length) {
      throw new Error("Embedding count did not match chunk count.");
    }

    await logLlmCall({
      tenantId,
      tool: "agronomy",
      model,
      promptTokens: tokens,
      costUsd: estimateCostUsd(model, tokens, 0),
      latencyMs: Date.now() - started,
    });

    const stored = await insertChunks({
      tenantId,
      documentId,
      chunks: chunks.map((c, i) => ({
        content: c.text,
        page: c.page,
        section: c.section,
        embedding: vectors[i],
      })),
    });

    await setDocumentStatus({
      tenantId,
      documentId,
      status: "ready",
      pageCount,
    });
    return stored;
  } catch (err) {
    await setDocumentStatus({
      tenantId,
      documentId,
      status: "failed",
    }).catch(() => {});
    throw err;
  }
}
