import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/shared/auth/dal";
import { guardTool } from "@/lib/shared/toolGate";
import { refreshNdvi } from "@/lib/fields/ndvi";
import { refreshWeather } from "@/lib/fields/weather";
import { refreshPrices } from "@/lib/fields/prices";

/**
 * Manual data refresh for the signed-in tenant — pulls NDVI + weather for this
 * tenant's fields and the benchmark prices, so a demo can populate everything
 * without waiting for the daily cron. The cron routes do the same unattended.
 */
export async function POST(request: Request) {
  const blocked = await guardTool(request);
  if (blocked) return blocked;
  const { tenantId } = await requireTenant();
  try {
    const [ndvi, weather, prices] = await Promise.all([
      refreshNdvi({ tenantId }),
      refreshWeather({ tenantId }),
      refreshPrices(tenantId),
    ]);
    return NextResponse.json({ ndvi, weather, prices });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Refresh failed." },
      { status: 500 },
    );
  }
}
