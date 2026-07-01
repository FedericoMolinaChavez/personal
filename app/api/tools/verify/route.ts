import { NextResponse } from "next/server";
import {
  attachGateCookie,
  gateConfigured,
  isVerified,
  verifyHumanToken,
} from "@/lib/shared/toolGate";

export const dynamic = "force-dynamic";

/** Report whether the gate is configured and whether this client is verified. */
export async function GET() {
  return NextResponse.json({
    configured: gateConfigured(),
    verified: await isVerified(),
  });
}

/** Verify a Turnstile token; on success set the human-gate cookie. */
export async function POST(request: Request) {
  let body: { token?: string };
  try {
    body = (await request.json()) as { token?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = await verifyHumanToken(body.token, request);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.reason ?? "Verification failed." },
      { status: 400 },
    );
  }

  return attachGateCookie(NextResponse.json({ verified: true }));
}
