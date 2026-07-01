"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DocumentView } from "@/lib/agronomy/documents";
import StatusPill from "@/components/tools/StatusPill";

export default function DocumentRow({ doc }: { doc: DocumentView }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDelete() {
    if (!confirm(`Delete "${doc.name}" and its chunks?`)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/agronomy/ingest", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: doc.id }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? "Delete failed.");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
      setBusy(false);
    }
  }

  const meta = [
    doc.pageCount != null ? `${doc.pageCount} pages` : null,
    `${doc.chunkCount} chunks`,
    new Date(doc.createdAt).toLocaleDateString(),
  ]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-cmd-line bg-cmd-surface p-4 transition-colors hover:border-cmd-line-strong">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cmd-surface2 text-cmd-muted">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            description
          </span>
        </span>
        <div className="min-w-0">
          <p className="truncate text-body-md font-medium text-cmd-text">
            {doc.name}
          </p>
          <p className="font-mono text-label-sm text-cmd-muted">{meta}</p>
          {error && <p className="text-label-sm text-cmd-danger">{error}</p>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <StatusPill status={doc.status} />
        <button
          onClick={onDelete}
          disabled={busy}
          aria-label={`Delete ${doc.name}`}
          className="inline-flex items-center rounded-full border border-cmd-line p-2 text-cmd-muted transition-colors hover:border-cmd-danger hover:text-cmd-danger disabled:opacity-50"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            {busy ? "hourglass_empty" : "delete"}
          </span>
        </button>
      </div>
    </div>
  );
}
