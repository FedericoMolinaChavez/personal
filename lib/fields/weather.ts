import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/shared/supabase/server";
import { listAllFields, listFields } from "./fields";

/**
 * P3 — recent + forecast daily weather per field from Open-Meteo (no API key)
 * into fields.weather_readings, keyed on the field centroid. Wind is stored in
 * km/h (Open-Meteo default). Server-only.
 */

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export interface WeatherRefreshResult {
  fieldsProcessed: number;
  readingsUpserted: number;
  errors: { fieldId: string; message: string }[];
}

interface OpenMeteoDaily {
  time: string[];
  temperature_2m_max: (number | null)[];
  precipitation_sum: (number | null)[];
  wind_speed_10m_max: (number | null)[];
}

export async function refreshWeather(opts?: {
  tenantId?: string;
}): Promise<WeatherRefreshResult> {
  const result: WeatherRefreshResult = {
    fieldsProcessed: 0,
    readingsUpserted: 0,
    errors: [],
  };
  const supabase = getSupabaseAdmin();
  if (!supabase) return result;
  const db = supabase as unknown as SupabaseClient;

  const fields = opts?.tenantId
    ? await listFields(opts.tenantId)
    : await listAllFields();
  const today = new Date().toISOString().slice(0, 10);

  for (const field of fields) {
    if (field.lat == null || field.lng == null) continue;
    try {
      const url = new URL(FORECAST_URL);
      url.searchParams.set("latitude", String(field.lat));
      url.searchParams.set("longitude", String(field.lng));
      url.searchParams.set(
        "daily",
        "temperature_2m_max,precipitation_sum,wind_speed_10m_max",
      );
      url.searchParams.set("past_days", "30");
      url.searchParams.set("forecast_days", "7");
      url.searchParams.set("timezone", "UTC");

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Open-Meteo failed: ${res.status}`);
      const json = (await res.json()) as { daily?: OpenMeteoDaily };
      const d = json.daily;
      if (!d?.time?.length) {
        result.fieldsProcessed++;
        continue;
      }

      const rows = d.time.map((day, i) => ({
        field_id: field.id,
        tenant_id: field.tenant_id,
        observed_on: day,
        temp_c: d.temperature_2m_max[i] ?? null,
        precip_mm: d.precipitation_sum[i] ?? null,
        wind_speed: d.wind_speed_10m_max[i] ?? null,
        forecast: day > today,
      }));

      const { error } = await db
        .schema("fields")
        .from("weather_readings")
        .upsert(rows, { onConflict: "field_id,observed_on,forecast" });
      if (error) throw new Error(error.message);
      result.readingsUpserted += rows.length;
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
