"use client";

import { useCallback, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { polygonGeometrySchema, type PolygonGeometry } from "@/lib/fields/schema";

const DrawMap = dynamic(() => import("./DrawMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] items-center justify-center rounded-lg border border-cmd-line bg-cmd-surface2 text-body-md text-cmd-muted">
      Loading map…
    </div>
  ),
});

type Mode = "draw" | "paste";

/** Pull a Polygon geometry out of a pasted geometry / Feature / FeatureCollection. */
function extractPolygon(raw: unknown): PolygonGeometry | null {
  const obj = raw as {
    type?: string;
    geometry?: unknown;
    features?: { geometry?: unknown }[];
  };
  let candidate: unknown = raw;
  if (obj?.type === "FeatureCollection") candidate = obj.features?.[0]?.geometry;
  else if (obj?.type === "Feature") candidate = obj.geometry;
  const parsed = polygonGeometrySchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}

const inputCls =
  "w-full rounded-lg border border-cmd-line bg-cmd-bg px-3 py-2 text-body-md text-cmd-text placeholder:text-cmd-muted focus:border-cmd-accent focus:outline-none";

export default function FieldEditor() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("draw");
  const [name, setName] = useState("");
  const [crop, setCrop] = useState("");
  const [geometry, setGeometry] = useState<PolygonGeometry | null>(null);
  const [pasteText, setPasteText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrawChange = useCallback(
    (g: PolygonGeometry | null) => setGeometry(g),
    [],
  );

  function applyPaste(text: string) {
    setPasteText(text);
    setError(null);
    if (!text.trim()) {
      setGeometry(null);
      return;
    }
    try {
      const poly = extractPolygon(JSON.parse(text));
      if (!poly) {
        setGeometry(null);
        setError("No valid GeoJSON Polygon found.");
        return;
      }
      setGeometry(poly);
    } catch {
      setGeometry(null);
      setError("Invalid JSON.");
    }
  }

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) applyPaste(await file.text());
  }

  function switchMode(next: Mode) {
    setMode(next);
    setGeometry(null);
    setError(null);
  }

  async function save() {
    if (!name.trim()) {
      setError("Field name is required.");
      return;
    }
    if (!geometry) {
      setError("Draw or paste a field boundary first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          crop: crop.trim() || null,
          geometry,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Could not create field.");
      setName("");
      setCrop("");
      setGeometry(null);
      setPasteText("");
      setOpen(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create field.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-cmd-accent px-6 py-2.5 text-label-md text-cmd-on-accent transition-all hover:bg-cmd-accent-strong"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          add_location_alt
        </span>
        Add field
      </button>
    );
  }

  const pointCount = geometry?.coordinates?.[0]?.length ?? 0;

  return (
    <div className="w-full rounded-xl border border-cmd-line bg-cmd-surface p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-display text-headline-md font-bold text-cmd-text">
          Add a field
        </h3>
        <button
          onClick={() => setOpen(false)}
          className="text-label-md text-cmd-muted hover:text-cmd-accent"
        >
          Cancel
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-label-md text-cmd-text">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="North field"
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-label-md text-cmd-text">Crop</label>
          <input
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            placeholder="Soybeans"
            className={inputCls}
          />
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        {(["draw", "paste"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`rounded-full px-4 py-1.5 text-label-md transition-colors ${
              mode === m
                ? "bg-cmd-accent/15 text-cmd-accent border border-cmd-accent/30"
                : "border border-cmd-line text-cmd-muted hover:border-cmd-accent hover:text-cmd-accent"
            }`}
          >
            {m === "draw" ? "Draw on map" : "Paste / upload GeoJSON"}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {mode === "draw" ? (
          <DrawMap onChange={onDrawChange} />
        ) : (
          <div className="space-y-3">
            <textarea
              value={pasteText}
              onChange={(e) => applyPaste(e.target.value)}
              rows={6}
              placeholder='{"type":"Polygon","coordinates":[[[-60.5,-31.4],[-60.4,-31.4],[-60.4,-31.3],[-60.5,-31.3],[-60.5,-31.4]]]}'
              className={`${inputCls} font-mono text-label-sm`}
            />
            <label className="inline-block cursor-pointer rounded-full border border-cmd-line px-4 py-2 text-label-md text-cmd-text hover:border-cmd-accent hover:text-cmd-accent">
              Upload .geojson / .json
              <input
                type="file"
                accept=".json,.geojson,application/geo+json,application/json"
                className="hidden"
                onChange={onFile}
              />
            </label>
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          onClick={save}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-cmd-accent px-6 py-2.5 text-label-md text-cmd-on-accent transition-all hover:bg-cmd-accent-strong disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save field"}
        </button>
        <span className="font-mono text-label-sm text-cmd-muted">
          {geometry
            ? `Boundary captured (${pointCount} points)`
            : "No boundary yet"}
        </span>
        {error && <span className="text-label-sm text-cmd-danger">{error}</span>}
      </div>
    </div>
  );
}
