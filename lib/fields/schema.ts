import { z } from "zod";

/**
 * P3 — Field Health Dashboard: shared types + Zod schemas.
 * Mirrors lib/spray/schema.ts. Sentinel response types come from the
 * Statistical API (project3-detailed-brief.md §4.1); the briefing schema
 * constrains the grounded LLM output.
 */

// ---------------------------------------------------------------------------
// Sentinel Hub Statistical API response shape (brief §4.1)
// ---------------------------------------------------------------------------
export interface NdviStats {
  min: number;
  max: number;
  mean: number;
  stDev: number;
  sampleCount: number;
  noDataCount: number;
  percentiles?: Record<string, number>;
}

export interface StatBlock {
  interval: { from: string; to: string };
  outputs: {
    ndvi?: { bands: { B0: { stats: NdviStats } } };
  };
}

export interface StatisticalResponse {
  data: StatBlock[];
  status: string;
}

// ---------------------------------------------------------------------------
// Field boundary input (API) — a GeoJSON Polygon geometry object
// ---------------------------------------------------------------------------
export const polygonGeometrySchema = z.object({
  type: z.literal("Polygon"),
  // rings of [lng, lat] positions; a closed ring needs >= 4 positions
  coordinates: z.array(z.array(z.array(z.number()).min(2)).min(4)).min(1),
});
export type PolygonGeometry = z.infer<typeof polygonGeometrySchema>;

export const fieldCreateSchema = z.object({
  name: z.string().trim().min(1, "Field name is required").max(120),
  crop: z.string().trim().max(80).nullable().optional(),
  geometry: polygonGeometrySchema,
});
export type FieldCreateInput = z.infer<typeof fieldCreateSchema>;

/** A row from the fields.field_list view (geometry as GeoJSON + centroid). */
export interface FieldRow {
  id: string;
  tenant_id: string;
  name: string;
  crop: string | null;
  created_at: string;
  geometry: PolygonGeometry | null;
  lat: number | null;
  lng: number | null;
}

// ---------------------------------------------------------------------------
// Computed per-field metrics — the single source for the map, cards, briefing
// ---------------------------------------------------------------------------
export type Health = "green" | "orange" | "red" | "unknown";

export interface FieldMetrics {
  fieldId: string;
  name: string;
  crop: string | null;
  health: Health;
  ndvi: {
    latest: number | null;
    previous: number | null;
    changePct: number | null;
    capturedOn: string | null;
    validCoverage: number | null;
    sufficient: boolean;
  };
  weather: {
    precipMm7d: number | null;
    maxTempC7d: number | null;
    maxWindKph7d: number | null;
  };
  price: {
    commodity: string | null;
    latest: number | null;
    previous: number | null;
    changePct: number | null;
  };
}

// ---------------------------------------------------------------------------
// Grounded AI briefing output (brief §6)
// ---------------------------------------------------------------------------
export const briefingFieldSchema = z.object({
  name: z.string().describe("Field name exactly as it appears in the metrics JSON"),
  status: z
    .enum(["improving", "stable", "declining", "insufficient_data"])
    .describe("Overall trajectory for this field based on its NDVI change"),
  ndvi_change_pct: z
    .number()
    .nullable()
    .describe("Period-over-period NDVI % change copied from the input; null if coverage is insufficient"),
  drivers: z
    .array(z.string())
    .describe("Likely drivers grounded in the weather/price numbers present; empty if none apply"),
  actions: z
    .array(z.string())
    .max(2)
    .describe("1-2 concrete actions (scout, irrigate, hold/sell). Empty when the field is healthy or data is insufficient"),
});

export const briefingSchema = z.object({
  summary: z
    .string()
    .describe("2-4 sentence plain-English overview naming the field(s) that need attention, using only numbers present in the input"),
  fields: z.array(briefingFieldSchema),
});
export type Briefing = z.infer<typeof briefingSchema>;
