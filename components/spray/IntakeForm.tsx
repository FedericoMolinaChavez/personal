"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type SubmitResult = {
  status?: string;
  record?: Record<string, unknown> | null;
  issues?: string[];
};

const FIELD_ORDER = [
  "product",
  "epa_reg_no",
  "rate",
  "unit",
  "field_block",
  "acres",
  "applied_at",
  "applicator",
  "wind_speed",
  "target_pest",
] as const;

const FIELD_LABELS: Record<string, string> = {
  product: "Product",
  epa_reg_no: "EPA reg #",
  rate: "Rate",
  unit: "Unit",
  field_block: "Field / block",
  acres: "Acres",
  applied_at: "Applied at",
  applicator: "Applicator",
  wind_speed: "Wind (mph)",
  target_pest: "Target pest",
};

export default function IntakeForm() {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);

    const fd = new FormData();
    if (note.trim()) fd.set("note", note.trim());
    if (file) fd.set("photo", file);

    try {
      const res = await fetch("/api/spray/submit", { method: "POST", body: fd });
      const json = (await res.json().catch(() => ({}))) as SubmitResult & {
        error?: string;
      };
      if (!res.ok) throw new Error(json.error ?? "Submission failed.");
      setResult(json);
      setNote("");
      setFile(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-cmd-line bg-cmd-surface p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-label-md text-cmd-text">Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="e.g. Sprayed Roundup 32 oz/acre on north field, 40 ac, 6 mph wind, 6/24"
            className="w-full rounded-lg border border-cmd-line bg-cmd-bg px-3 py-2 text-body-md text-cmd-text placeholder:text-cmd-muted focus:border-cmd-accent focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-cmd-line px-4 py-2 text-label-md text-cmd-text transition-colors hover:border-cmd-accent hover:text-cmd-accent">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              photo_camera
            </span>
            {file ? "Change photo" : "Attach photo"}
            <input
              type="file"
              accept="image/*"
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
            disabled={busy}
            className="ml-auto inline-flex items-center gap-2 rounded-full bg-cmd-accent px-6 py-2 text-label-md text-cmd-on-accent transition-all hover:bg-cmd-accent-strong disabled:opacity-50"
          >
            {busy ? "Processing…" : "Submit record"}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-4 rounded-lg border border-cmd-danger/30 bg-cmd-danger/10 px-3 py-2 text-body-md text-cmd-danger">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-5 border-t border-cmd-line pt-5">
          <p className="mb-3 text-label-md text-cmd-text">
            Result:{" "}
            <span className="font-mono text-cmd-muted">
              {result.status === "needs_review"
                ? "Queued for review"
                : result.status === "parsed"
                  ? "Parsed cleanly"
                  : result.status}
            </span>
          </p>
          {result.record && (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              {FIELD_ORDER.map((k) => {
                const v = result.record?.[k];
                return (
                  <div key={k}>
                    <dt className="text-label-sm text-cmd-muted">
                      {FIELD_LABELS[k]}
                    </dt>
                    <dd className="font-mono text-body-md text-cmd-text">
                      {v == null || v === "" ? "—" : String(v)}
                    </dd>
                  </div>
                );
              })}
            </dl>
          )}
          {result.issues && result.issues.length > 0 && (
            <ul className="mt-4 space-y-1">
              {result.issues.map((issue, i) => (
                <li
                  key={i}
                  className="text-body-md text-cmd-amber before:mr-2 before:content-['⚠']"
                >
                  {issue}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
