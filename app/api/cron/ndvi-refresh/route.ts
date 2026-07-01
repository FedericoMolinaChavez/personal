import { NextResponse, type NextRequest } from "next/server";
import { refreshNdvi } from "@/lib/fields/ndvi";

/**
 * P3 — scheduled NDVI refresh (Vercel Cron). Protected by CRON_SECRET sent as
 * `Authorization: Bearer <CRON_SECRET>`. Refreshes every field across tenants.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const result = await refreshNdvi();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
