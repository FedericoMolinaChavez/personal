import { NextResponse } from "next/server";

/**
 * P2 — intake webhook for photo/SMS/voice submissions. No logged-in user;
 * authenticate via SPRAY_WEBHOOK_SECRET and resolve tenant_id server-side
 * before writing with the service role. Stub.
 */
export async function POST() {
  return NextResponse.json({ error: "not_implemented" }, { status: 501 });
}
