import { NextResponse, type NextRequest } from "next/server";
import { refreshPrices } from "@/lib/fields/prices";
import { refreshWeather } from "@/lib/fields/weather";
import { listAllFields } from "@/lib/fields/fields";

/**
 * P3 — scheduled non-NDVI refresh (Vercel Cron): benchmark commodity prices
 * plus daily weather for every field. Protected by CRON_SECRET sent as
 * `Authorization: Bearer <CRON_SECRET>`.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const allFields = await listAllFields();
    const tenantIds = [...new Set(allFields.map((f) => f.tenant_id as string))];
    const [priceResults, weather] = await Promise.all([
      Promise.all(tenantIds.map((id) => refreshPrices(id))),
      refreshWeather(),
    ]);
    const prices = priceResults.reduce(
      (acc, r) => ({
        commoditiesProcessed: acc.commoditiesProcessed + r.commoditiesProcessed,
        readingsUpserted: acc.readingsUpserted + r.readingsUpserted,
        errors: acc.errors.concat(r.errors),
      }),
      { commoditiesProcessed: 0, readingsUpserted: 0, errors: [] as typeof priceResults[0]["errors"] },
    );
    return NextResponse.json({ ok: true, prices, weather });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
