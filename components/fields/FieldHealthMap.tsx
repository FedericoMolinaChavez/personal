"use client";

import dynamic from "next/dynamic";
import type { Health, PolygonGeometry } from "@/lib/fields/schema";

/**
 * Client wrapper that loads the Leaflet map only in the browser (ssr:false) —
 * Leaflet touches `window`, so it must never render on the server.
 */
const Inner = dynamic(() => import("./FieldHealthMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-xl border border-cmd-line bg-cmd-surface text-body-md text-cmd-muted">
      Loading map…
    </div>
  ),
});

export type FieldMapItem = {
  id: string;
  name: string;
  geometry: PolygonGeometry | null;
  health: Health;
};

export default function FieldHealthMap({ fields }: { fields: FieldMapItem[] }) {
  return <Inner fields={fields} />;
}
