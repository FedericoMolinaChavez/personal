"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Manually pull NDVI + weather + prices for the tenant (POST /api/fields/ndvi),
 * so a demo can populate data without waiting for the daily cron.
 */
export default function RefreshButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/fields/ndvi", { method: "POST" });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Refresh failed.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Refresh failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={refresh}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full border border-cmd-line px-4 py-2.5 text-label-md text-cmd-text transition-colors hover:border-cmd-accent hover:text-cmd-accent disabled:opacity-50"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          {busy ? "hourglass_empty" : "refresh"}
        </span>
        {busy ? "Refreshing…" : "Refresh data"}
      </button>
      {error && <span className="text-label-sm text-cmd-danger">{error}</span>}
    </div>
  );
}
