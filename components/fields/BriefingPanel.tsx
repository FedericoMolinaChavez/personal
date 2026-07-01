"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Briefing } from "@/lib/fields/schema";

type Data = { summary: string; briefing: Briefing | null } | null;

const STATUS_CLS: Record<string, string> = {
  improving: "border border-cmd-accent/30 bg-cmd-accent/10 text-cmd-accent",
  stable: "border border-cmd-line bg-cmd-surface2 text-cmd-muted",
  declining: "border border-cmd-danger/30 bg-cmd-danger/10 text-cmd-danger",
  insufficient_data: "border border-cmd-amber/30 bg-cmd-amber/10 text-cmd-amber",
};

export default function BriefingPanel({ initial }: { initial: Data }) {
  const router = useRouter();
  const [data, setData] = useState<Data>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/fields/briefing", { method: "POST" });
      const json = (await res.json().catch(() => ({}))) as {
        summary?: string;
        briefing?: Briefing | null;
        error?: string;
      };
      if (!res.ok) throw new Error(json.error ?? "Briefing failed.");
      setData({ summary: json.summary ?? "", briefing: json.briefing ?? null });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Briefing failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-cmd-line bg-cmd-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-headline-md font-bold text-cmd-text">
          Weekly briefing
        </h2>
        <button
          onClick={generate}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-cmd-accent px-5 py-2 text-label-md text-cmd-on-accent transition-all hover:bg-cmd-accent-strong disabled:opacity-50"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            auto_awesome
          </span>
          {busy ? "Generating…" : "Generate briefing"}
        </button>
      </div>

      {error && <p className="mt-3 text-label-sm text-cmd-danger">{error}</p>}

      {data ? (
        <div className="mt-4 space-y-5">
          <p className="text-body-md text-cmd-text">{data.summary}</p>

          {data.briefing?.fields?.length ? (
            <ul className="space-y-3">
              {data.briefing.fields.map((f, i) => (
                <li
                  key={`${f.name}-${i}`}
                  className="rounded-lg border border-cmd-line bg-cmd-surface2 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-body-md font-medium text-cmd-text">
                      {f.name}
                    </p>
                    <span
                      className={`inline-block shrink-0 rounded-full px-3 py-1 font-mono text-label-sm ${
                        STATUS_CLS[f.status] ??
                        "border border-cmd-line bg-cmd-surface2 text-cmd-muted"
                      }`}
                    >
                      {f.status.replace("_", " ")}
                      {f.ndvi_change_pct != null
                        ? ` · ${f.ndvi_change_pct > 0 ? "+" : ""}${f.ndvi_change_pct}%`
                        : ""}
                    </span>
                  </div>
                  {f.drivers.length > 0 && (
                    <p className="mt-2 text-label-md text-cmd-muted">
                      {f.drivers.join(" · ")}
                    </p>
                  )}
                  {f.actions.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {f.actions.map((a, j) => (
                        <li
                          key={j}
                          className="text-body-md text-cmd-text before:mr-2 before:text-cmd-accent before:content-['→']"
                        >
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-body-md text-cmd-muted">
          No briefing yet — generate one to see which field needs attention this
          week.
        </p>
      )}
    </div>
  );
}
