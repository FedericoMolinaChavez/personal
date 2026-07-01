import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/shared/supabase/server";
import { listFields } from "./fields";
import { commodityForCrop } from "./prices";
import type { FieldMetrics, Health } from "./schema";

/**
 * P3 — compute the per-field metric JSON that drives the map coloring, the
 * dashboard cards, AND the grounded AI briefing. Reads only from the cached
 * fields.* tables (never live APIs). Numbers are rounded so the values the UI
 * shows are exactly the values the briefing is allowed to cite. Server-only.
 */

const MIN_COVERAGE = 0.5;
const DAY_MS = 86_400_000;

function round(n: number | null | undefined, dp: number): number | null {
  if (n == null || !Number.isFinite(n)) return null;
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}

function pctChange(latest: number | null, previous: number | null): number | null {
  if (latest == null || previous == null || previous === 0) return null;
  return ((latest - previous) / previous) * 100;
}

function sumNullable(xs: (number | null | undefined)[] | undefined): number | null {
  if (!xs?.length) return null;
  const vals = xs.filter((x): x is number => x != null);
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0);
}

function maxNullable(xs: (number | null | undefined)[] | undefined): number | null {
  if (!xs?.length) return null;
  const vals = xs.filter((x): x is number => x != null);
  if (!vals.length) return null;
  return Math.max(...vals);
}

/** Color a field by NDVI level + period-over-period trend. */
function classifyHealth(
  latest: number | null,
  changePct: number | null,
  sufficient: boolean,
): Health {
  if (!sufficient || latest == null) return "unknown";
  if ((changePct != null && changePct <= -15) || latest < 0.35) return "red";
  if ((changePct != null && changePct <= -7) || latest < 0.6) return "orange";
  return "green";
}

export async function computeFieldMetrics(
  tenantId: string,
): Promise<FieldMetrics[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const db = supabase as unknown as SupabaseClient;
  const fields = await listFields(tenantId);

  const out: FieldMetrics[] = [];
  for (const field of fields) {
    // --- NDVI: latest two readings ---
    const { data: ndviRows } = await db
      .schema("fields")
      .from("ndvi_readings")
      .select("captured_on,ndvi_mean,valid_coverage")
      .eq("field_id", field.id)
      .order("captured_on", { ascending: false })
      .limit(2);
    const latestN = ndviRows?.[0];
    const prevN = ndviRows?.[1];
    const latest = latestN?.ndvi_mean ?? null;
    const previous = prevN?.ndvi_mean ?? null;
    const changePct = pctChange(latest, previous);
    const validCoverage = latestN?.valid_coverage ?? null;
    const sufficient =
      latest != null && (validCoverage == null || validCoverage >= MIN_COVERAGE);

    // --- Weather: last 7 observed days ---
    const since = new Date(Date.now() - 7 * DAY_MS).toISOString().slice(0, 10);
    const { data: wxRows } = await db
      .schema("fields")
      .from("weather_readings")
      .select("temp_c,precip_mm,wind_speed")
      .eq("field_id", field.id)
      .eq("forecast", false)
      .gte("observed_on", since);

    // --- Price: commodity benchmark, latest two points ---
    const commodity = commodityForCrop(field.crop);
    let priceLatest: number | null = null;
    let pricePrev: number | null = null;
    if (commodity) {
      const { data: pRows } = await db
        .schema("fields")
        .from("price_readings")
        .select("price")
        .eq("commodity", commodity)
        .order("observed_on", { ascending: false })
        .limit(2);
      priceLatest = pRows?.[0]?.price ?? null;
      pricePrev = pRows?.[1]?.price ?? null;
    }

    out.push({
      fieldId: field.id,
      name: field.name,
      crop: field.crop,
      health: classifyHealth(latest, changePct, sufficient),
      ndvi: {
        latest: round(latest, 3),
        previous: round(previous, 3),
        changePct: round(changePct, 1),
        capturedOn: latestN?.captured_on ?? null,
        validCoverage: round(validCoverage, 2),
        sufficient,
      },
      weather: {
        precipMm7d: round(sumNullable(wxRows?.map((w) => w.precip_mm)), 1),
        maxTempC7d: round(maxNullable(wxRows?.map((w) => w.temp_c)), 1),
        maxWindKph7d: round(maxNullable(wxRows?.map((w) => w.wind_speed)), 1),
      },
      price: {
        commodity,
        latest: round(priceLatest, 2),
        previous: round(pricePrev, 2),
        changePct: round(pctChange(priceLatest, pricePrev), 1),
      },
    });
  }
  return out;
}
