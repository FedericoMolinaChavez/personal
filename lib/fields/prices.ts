import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/shared/supabase/server";
import { requireEnv } from "@/lib/shared/env";

/**
 * P3 — benchmark commodity prices from USDA NASS QuickStats into
 * fields.price_readings. NASS is US-centric and reports "price received"
 * (monthly $/bu for grains, annual $/ton for sugarcane) rather than daily
 * futures (brief §2 prices note), but it's the free, keyed reference most LATAM
 * growers still track. Per-commodity query config lives in NASS_CONFIGS.
 * Server-only.
 */

const NASS_URL = "https://quickstats.nass.usda.gov/api/api_GET/";

const MONTHS: Record<string, string> = {
  JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
  JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12",
};

interface NassConfig {
  /** NASS commodity_desc — also the value stored in fields.price_readings. */
  commodity: string;
  /** freq_desc — grains report MONTHLY; sugarcane only ANNUAL. */
  freq: "MONTHLY" | "ANNUAL";
  /**
   * unit_desc filter. NASS returns each period in several units (e.g. $ / BU
   * AND PCT OF PARITY); without this filter the rows collapse to the same
   * (commodity, observed_on) and the upsert fails with "ON CONFLICT ... cannot
   * affect row a second time". Pinning the unit also keeps the value a real
   * price rather than the parity index.
   */
  unit: string;
  /** year__GE lookback. ANNUAL needs a wider window to get more than one point. */
  yearsBack: number;
}

const NASS_CONFIGS: NassConfig[] = [
  { commodity: "SOYBEANS", freq: "MONTHLY", unit: "$ / BU", yearsBack: 1 },
  { commodity: "CORN", freq: "MONTHLY", unit: "$ / BU", yearsBack: 1 },
  { commodity: "WHEAT", freq: "MONTHLY", unit: "$ / BU", yearsBack: 1 },
  { commodity: "SUGARCANE", freq: "ANNUAL", unit: "$ / TON", yearsBack: 5 },
];

/** Map a field's free-text crop (EN/ES) to a NASS benchmark commodity. */
const CROP_TO_COMMODITY: Record<string, string> = {
  soy: "SOYBEANS", soya: "SOYBEANS", soybean: "SOYBEANS", soybeans: "SOYBEANS", soja: "SOYBEANS",
  corn: "CORN", maize: "CORN", maiz: "CORN", "maíz": "CORN",
  wheat: "WHEAT", trigo: "WHEAT",
  sugar: "SUGARCANE", "sugar cane": "SUGARCANE", sugarcane: "SUGARCANE",
  "caña": "SUGARCANE", "caña de azucar": "SUGARCANE", "caña de azúcar": "SUGARCANE",
};

export function commodityForCrop(crop: string | null): string | null {
  if (!crop) return null;
  return CROP_TO_COMMODITY[crop.trim().toLowerCase()] ?? null;
}

interface NassRecord {
  Value: string;
  year: number;
  reference_period_desc: string;
}

export interface PricesRefreshResult {
  commoditiesProcessed: number;
  readingsUpserted: number;
  errors: { commodity: string; message: string }[];
}

export async function refreshPrices(tenantId: string): Promise<PricesRefreshResult> {
  const result: PricesRefreshResult = {
    commoditiesProcessed: 0,
    readingsUpserted: 0,
    errors: [],
  };
  const supabase = getSupabaseAdmin();
  if (!supabase) return result;
  const { NASS_API_KEY } = requireEnv(["NASS_API_KEY"]);
  const db = supabase as unknown as SupabaseClient;
  const thisYear = new Date().getFullYear();

  for (const cfg of NASS_CONFIGS) {
    try {
      const url = new URL(NASS_URL);
      url.searchParams.set("key", NASS_API_KEY);
      url.searchParams.set("commodity_desc", cfg.commodity);
      url.searchParams.set("statisticcat_desc", "PRICE RECEIVED");
      url.searchParams.set("freq_desc", cfg.freq);
      url.searchParams.set("agg_level_desc", "NATIONAL");
      url.searchParams.set("class_desc", "ALL CLASSES");
      url.searchParams.set("unit_desc", cfg.unit);
      url.searchParams.set("year__GE", String(thisYear - cfg.yearsBack));
      url.searchParams.set("format", "JSON");

      const res = await fetch(url);
      if (!res.ok) throw new Error(`NASS failed: ${res.status}`);
      const json = (await res.json()) as { data?: NassRecord[] };

      // Dedupe by observed_on (last wins) — guards against any residual
      // preliminary/revised duplicate re-triggering the ON CONFLICT error.
      const byDate = new Map<string, { tenant_id: string; commodity: string; observed_on: string; price: number }>();
      for (const rec of json.data ?? []) {
        const period = (rec.reference_period_desc ?? "").trim().toUpperCase();
        // MONTHLY rows carry a month name; ANNUAL rows carry "MARKETING YEAR".
        const observedOn =
          cfg.freq === "MONTHLY"
            ? MONTHS[period] && `${rec.year}-${MONTHS[period]}-01`
            : `${rec.year}-01-01`;
        const price = Number(String(rec.Value).replace(/,/g, ""));
        if (!observedOn || !Number.isFinite(price)) continue; // skip "(D)" / off-cycle rows
        byDate.set(observedOn, {
          tenant_id: tenantId,
          commodity: cfg.commodity,
          observed_on: observedOn,
          price,
        });
      }
      const rows = [...byDate.values()];

      if (rows.length) {
        const { error } = await db
          .schema("fields")
          .from("price_readings")
          .upsert(rows, { onConflict: "tenant_id,commodity,observed_on" });
        if (error) throw new Error(error.message);
        result.readingsUpserted += rows.length;
      }
      result.commoditiesProcessed++;
    } catch (err) {
      result.errors.push({
        commodity: cfg.commodity,
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }
  return result;
}
