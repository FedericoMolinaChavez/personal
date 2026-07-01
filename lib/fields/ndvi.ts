import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/shared/supabase/server";
import { fetchNdviStats } from "./sentinel";
import { listAllFields, listFields } from "./fields";
import type { FieldRow, StatisticalResponse } from "./schema";

/**
 * P3 — fetch + cloud-mask + per-field aggregate NDVI (Sentinel-2), cached into
 * fields.ndvi_readings. toReadings flattens the Statistical API response
 * (brief §4.2); refreshNdvi requests only the window since each field's last
 * reading and upserts. Server-only.
 */

const MIN_COVERAGE = 0.5; // discard heavily-clouded / sparse intervals
const DEFAULT_LOOKBACK_DAYS = 90; // initial window for a brand-new field
const DAY_MS = 86_400_000;

export interface NdviReadingRow {
  field_id: string;
  tenant_id: string;
  captured_on: string;
  ndvi_mean: number;
  ndvi_min: number;
  ndvi_max: number;
  ndvi_std: number;
  cloud_pct: number;
  valid_coverage: number;
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

/** Flatten non-empty, well-covered intervals into ndvi_readings rows. */
export function toReadings(
  fieldId: string,
  tenantId: string,
  res: StatisticalResponse,
): NdviReadingRow[] {
  return res.data
    // Drop empty intervals (no acquisition) and fully-masked ones, where the
    // Statistical API returns mean as the string "NaN" rather than a number.
    .filter((b) => b.outputs.ndvi && Number.isFinite(b.outputs.ndvi.bands.B0.stats.mean))
    .map((b) => {
      const s = b.outputs.ndvi!.bands.B0.stats;
      // Coverage = share of sampled pixels that survived the cloud/shadow mask.
      // The response has no geometryPixelCount field; sampleCount is the total
      // pixels in the interval and noDataCount how many the mask excluded.
      const validPct = s.sampleCount
        ? clamp01((s.sampleCount - s.noDataCount) / s.sampleCount)
        : 0;
      return {
        field_id: fieldId,
        tenant_id: tenantId,
        captured_on: b.interval.from.slice(0, 10),
        ndvi_mean: s.mean,
        ndvi_min: s.min,
        ndvi_max: s.max,
        ndvi_std: s.stDev,
        cloud_pct: 1 - validPct,
        valid_coverage: validPct,
      };
    })
    .filter((r) => r.valid_coverage >= MIN_COVERAGE);
}

export interface NdviRefreshResult {
  fieldsProcessed: number;
  readingsUpserted: number;
  errors: { fieldId: string; message: string }[];
}

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

async function lastCapturedOn(
  db: SupabaseClient,
  fieldId: string,
): Promise<string | null> {
  const { data } = await db
    .schema("fields")
    .from("ndvi_readings")
    .select("captured_on")
    .eq("field_id", fieldId)
    .order("captured_on", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.captured_on as string) ?? null;
}

/**
 * Refresh NDVI for every field (or one tenant's fields). For each field,
 * request the window since its last reading, normalize, and upsert. Never
 * throws for a single field — failures are collected per field.
 */
export async function refreshNdvi(opts?: {
  tenantId?: string;
}): Promise<NdviRefreshResult> {
  const result: NdviRefreshResult = {
    fieldsProcessed: 0,
    readingsUpserted: 0,
    errors: [],
  };
  const supabase = getSupabaseAdmin();
  if (!supabase) return result;
  const db = supabase as unknown as SupabaseClient;

  const fields: FieldRow[] = opts?.tenantId
    ? await listFields(opts.tenantId)
    : await listAllFields();

  for (const field of fields) {
    if (!field.geometry) continue;
    try {
      const last = await lastCapturedOn(db, field.id);
      const fromDate = last
        ? new Date(new Date(last).getTime() + DAY_MS)
        : new Date(Date.now() - DEFAULT_LOOKBACK_DAYS * DAY_MS);
      const toDate = new Date();
      if (fromDate >= toDate) {
        result.fieldsProcessed++;
        continue; // already up to date
      }

      const res = await fetchNdviStats(
        field.geometry,
        `${isoDay(fromDate)}T00:00:00Z`,
        `${isoDay(toDate)}T00:00:00Z`,
      );
      const rows = toReadings(field.id, field.tenant_id, res);
      if (rows.length) {
        const { error } = await db
          .schema("fields")
          .from("ndvi_readings")
          .upsert(rows, { onConflict: "field_id,captured_on" });
        if (error) throw new Error(error.message);
        result.readingsUpserted += rows.length;
      }
      result.fieldsProcessed++;
    } catch (err) {
      result.errors.push({
        fieldId: field.id,
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }
  return result;
}
