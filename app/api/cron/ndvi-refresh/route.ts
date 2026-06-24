import { NextResponse, type NextRequest } from "next/server";

/**
 * P3 — scheduled NDVI refresh (Vercel Cron). Protected by CRON_SECRET sent as
 * `Authorization: Bearer <CRON_SECRET>`. Stub.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ error: "not_implemented" }, { status: 501 });
}
