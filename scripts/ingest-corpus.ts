/**
 * Bulk-ingest the corn RAG corpus (corn-rag-corpus/) into agronomy.chunks on the
 * configured Supabase, reusing the real P1 pipeline. Idempotent: re-running
 * replaces documents with the same filename. Run with:
 *
 *   npm run ingest:corpus
 *   (= node --env-file=.env.local --import tsx scripts/ingest-corpus.ts)
 *
 * Stores under DEMO_TENANT_ID so /tools/agronomy (demo bypass) sees the docs.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { getSupabaseAdmin } from "@/lib/shared/supabase/server";
import {
  createDocument,
  deleteDocument,
  listDocuments,
} from "@/lib/agronomy/documents";
import { extOf, ingestDocument } from "@/lib/agronomy/ingest";
import { uploadDocument } from "@/lib/agronomy/storage";

const CORPUS_DIR = path.resolve(process.cwd(), "corn-rag-corpus");
const BUCKET = "agronomy-docs";

/** Create the private docs bucket if it doesn't exist (idempotent). */
async function ensureBucket(): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: false,
  });
  if (error && !/exist/i.test(error.message)) {
    console.warn(`  (bucket note: ${error.message})`);
  }
}

/** All supported corpus files, recursively, excluding the README. */
function corpusFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        walk(full);
      } else if (
        e.name.toLowerCase() !== "readme.md" &&
        extOf(e.name) !== null
      ) {
        out.push(full);
      }
    }
  };
  walk(CORPUS_DIR);
  return out.sort();
}

async function main(): Promise<void> {
  const tenantId = process.env.DEMO_TENANT_ID;
  if (!tenantId) throw new Error("DEMO_TENANT_ID is not set (check .env.local).");
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set.");
  if (!getSupabaseAdmin()) {
    throw new Error("Supabase admin client not configured (check .env.local).");
  }

  await ensureBucket();

  const files = corpusFiles();
  console.log(`Ingesting ${files.length} files under tenant ${tenantId}\n`);

  const existing = await listDocuments(tenantId);
  let total = 0;

  for (const file of files) {
    const name = path.basename(file);

    // Idempotent: drop any prior copy with the same name (chunks cascade).
    for (const dup of existing.filter((d) => d.name === name)) {
      await deleteDocument(tenantId, dup.id);
    }

    const bytes = readFileSync(file);
    const f = new File([bytes], name);

    let source: string | null = null;
    try {
      source = await uploadDocument(tenantId, f);
    } catch (e) {
      console.warn(
        `  (original not stored: ${e instanceof Error ? e.message : String(e)})`,
      );
    }

    const documentId = await createDocument({ tenantId, name, source });
    if (!documentId) throw new Error(`createDocument returned null for ${name}`);

    const chunks = await ingestDocument({ tenantId, documentId, file: f });
    total += chunks;
    console.log(`✓ ${name} → ${chunks} chunks`);
  }

  console.log(`\nDone. ${files.length} documents, ${total} chunks stored.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err instanceof Error ? err.stack ?? err.message : err);
    process.exit(1);
  });
