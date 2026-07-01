import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/shared/supabase/server";

/**
 * P3 — per-field time-series reads for the detail page (NDVI + weather).
 * Service-role client scoped explicitly by tenant_id. Server-only.
 */

export interface NdviPoint {
  captured_on: string;
  ndvi_mean: number | null;
  ndvi_min: number | null;
  ndvi_max: number | null;
  valid_coverage: number | null;
}

export interface WeatherPoint {
  observed_on: string;
  temp_c: number | null;
  precip_mm: number | null;
  wind_speed: number | null;
  forecast: boolean;
}

const DAY_MS = 86_400_000;

function db(): SupabaseClient | null {
  const s = getSupabaseAdmin();
  return s ? (s as unknown as SupabaseClient) : null;
}

export async function getNdviSeries(
  tenantId: string,
  fieldId: string,
): Promise<NdviPoint[]> {
  const d = db();
  if (!d) return [];
  const { data } = await d
    .schema("fields")
    .from("ndvi_readings")
    .select("captured_on,ndvi_mean,ndvi_min,ndvi_max,valid_coverage")
    .eq("tenant_id", tenantId)
    .eq("field_id", fieldId)
    .order("captured_on", { ascending: true });
  return (data ?? []) as NdviPoint[];
}

export async function getWeatherSeries(
  tenantId: string,
  fieldId: string,
): Promise<WeatherPoint[]> {
  const d = db();
  if (!d) return [];
  const since = new Date(Date.now() - 30 * DAY_MS).toISOString().slice(0, 10);
  const { data } = await d
    .schema("fields")
    .from("weather_readings")
    .select("observed_on,temp_c,precip_mm,wind_speed,forecast")
    .eq("tenant_id", tenantId)
    .eq("field_id", fieldId)
    .gte("observed_on", since)
    .order("observed_on", { ascending: true });
  return (data ?? []) as WeatherPoint[];
}
