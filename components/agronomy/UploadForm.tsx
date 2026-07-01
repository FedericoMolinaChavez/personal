"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type UploadResult = {
  status?: string;
  chunkCount?: number;
  error?: string;
};

export default function UploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);

    const fd = new FormData();
    fd.set("file", file);

    try {
      const res = await fetch("/api/agronomy/ingest", {
        method: "POST",
        body: fd,
      });
      const json = (await res.json().catch(() => ({}))) as UploadResult;
      if (!res.ok) throw new Error(json.error ?? "Upload failed.");
      setResult(json);
      setFile(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-cmd-line bg-cmd-surface p-6">
      <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-4">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-cmd-line px-4 py-2.5 text-label-md text-cmd-text transition-colors hover:border-cmd-accent hover:text-cmd-accent">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            attach_file
          </span>
          {file ? "Change file" : "Choose document"}
          <input
            type="file"
            accept=".pdf,.docx,.txt,.md,application/pdf,text/plain,text/markdown"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {file && (
          <span className="truncate font-mono text-label-sm text-cmd-muted">
            {file.name}
          </span>
        )}
        <button
          type="submit"
          disabled={busy || !file}
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-cmd-accent px-6 py-2.5 text-label-md text-cmd-on-accent transition-all hover:bg-cmd-accent-strong disabled:pointer-events-none disabled:opacity-50"
        >
          {busy ? "Ingesting…" : "Upload & ingest"}
        </button>
      </form>

      <p className="mt-3 font-mono text-label-sm text-cmd-muted">
        PDF, DOCX, TXT, or Markdown. Large PDFs may take a few seconds to parse and
        embed.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-cmd-danger/30 bg-cmd-danger/10 px-3 py-2 text-body-md text-cmd-danger">
          {error}
        </p>
      )}
      {result?.status === "ready" && (
        <p className="mt-4 rounded-lg border border-cmd-accent/30 bg-cmd-accent/10 px-3 py-2 text-body-md text-cmd-accent">
          Ingested into {result.chunkCount} chunks.
        </p>
      )}
    </div>
  );
}
