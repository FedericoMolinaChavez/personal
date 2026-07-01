import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/shared/auth/dal";
import { guardTool } from "@/lib/shared/toolGate";
import { extOf, ingestDocument } from "@/lib/agronomy/ingest";
import {
  createDocument,
  deleteDocument,
  setDocumentStatus,
} from "@/lib/agronomy/documents";
import { uploadDocument } from "@/lib/agronomy/storage";

// Ingestion runs inline (parse + embed); always run fresh, and allow headroom
// for large PDFs (the host plan caps this if it's lower).
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/** P1 — upload + ingest a document (parse, chunk, embed) inline. */
export async function POST(request: Request) {
  const blocked = await guardTool(request);
  if (blocked) return blocked;
  const { tenantId } = await requireTenant();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "Attach a document file." },
      { status: 400 },
    );
  }
  if (!extOf(file.name)) {
    return NextResponse.json(
      { error: "Unsupported type. Use PDF, DOCX, TXT, or Markdown." },
      { status: 400 },
    );
  }

  // 1. Store the original (best effort) + create the document row (pending).
  let documentId: string | null = null;
  try {
    const source = await uploadDocument(tenantId, file);
    documentId = await createDocument({ tenantId, name: file.name, source });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Could not save the document.",
      },
      { status: 500 },
    );
  }
  if (!documentId) {
    return NextResponse.json(
      { error: "Database is not configured." },
      { status: 501 },
    );
  }

  // 2. Ingest inline. ingestDocument marks the row failed on error.
  try {
    const chunkCount = await ingestDocument({ tenantId, documentId, file });
    return NextResponse.json({ documentId, status: "ready", chunkCount });
  } catch (err) {
    await setDocumentStatus({
      tenantId,
      documentId,
      status: "failed",
    }).catch(() => {});
    return NextResponse.json(
      {
        documentId,
        status: "failed",
        error:
          err instanceof Error
            ? `Ingestion failed: ${err.message}`
            : "Ingestion failed.",
      },
      { status: 422 },
    );
  }
}

/** P1 — delete a document (chunks cascade) and its stored original. */
export async function DELETE(request: Request) {
  const blocked = await guardTool(request, { rateLimit: false });
  if (blocked) return blocked;
  const { tenantId } = await requireTenant();

  let body: { documentId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON body." }, { status: 400 });
  }
  if (!body.documentId) {
    return NextResponse.json({ error: "Missing documentId." }, { status: 400 });
  }

  try {
    await deleteDocument(tenantId, body.documentId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Delete failed." },
      { status: 500 },
    );
  }
}
