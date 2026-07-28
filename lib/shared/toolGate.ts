import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { checkRateLimit, clientIp } from "@/lib/shared/ratelimit";

/**
 * Human-verification gate for the public-facing tools. A one-time Cloudflare
 * Turnstile challenge (see /api/tools/verify) sets a short-lived, HMAC-signed
 * httpOnly cookie; the tool routes require it via guardTool(). The gate is a
 * no-op until TURNSTILE_SECRET_KEY is set (matches the app's graceful
 * degradation), so local/dev keeps working without a challenge.
 */

export const GATE_COOKIE = "tg";
const GATE_TTL_MS = 60 * 60 * 1000; // 1 hour
export const GATE_MAX_AGE = GATE_TTL_MS / 1000;

/** True once Turnstile is configured — only then is the gate enforced. */
export function gateConfigured(): boolean {
  return !!process.env.TURNSTILE_SECRET_KEY;
}

function gateSecret(): string {
  return (
    process.env.TOOLS_GATE_SECRET || process.env.TURNSTILE_SECRET_KEY || ""
  );
}

function sign(expMs: number): string {
  return createHmac("sha256", gateSecret()).update(String(expMs)).digest("hex");
}

/** Cookie value = `<expiryMs>.<hmac>`. */
export function signedGateValue(): string {
  const exp = Date.now() + GATE_TTL_MS;
  return `${exp}.${sign(exp)}`;
}

function isValidGateValue(value: string | undefined): boolean {
  if (!value) return false;
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return false;
  const expPart = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const exp = Number(expPart);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = sign(exp);
  if (expected.length !== sig.length) return false;
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

/** Whether the current request carries a valid human-gate cookie (or gate is off). */
export async function isVerified(): Promise<boolean> {
  if (!gateConfigured()) return true;
  const store = await cookies();
  return isValidGateValue(store.get(GATE_COOKIE)?.value);
}

/** Attach the signed gate cookie to a response (after a passing Turnstile check). */
export function attachGateCookie(res: NextResponse): NextResponse {
  res.cookies.set(GATE_COOKIE, signedGateValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GATE_MAX_AGE,
  });
  return res;
}

/**
 * Guard a tool route: require a valid human-gate cookie, then apply the per-IP
 * rate limit. Returns a Response to short-circuit (401/429), or null to proceed.
 * Pass { rateLimit: false } for cheap write routes that only need the bot gate.
 */
export async function guardTool(
  request: Request,
  opts?: { rateLimit?: boolean },
): Promise<Response | null> {
  if (!(await isVerified())) {
    return NextResponse.json(
      {
        error: "human_verification_required",
        message: "Please complete the human verification to use the tools.",
      },
      { status: 401 },
    );
  }

  if (opts?.rateLimit !== false) {
    const rl = await checkRateLimit(`tools:${clientIp(request)}`);
    if (!rl.ok) {
      return NextResponse.json(
        {
          error: "rate_limited",
          message:
            "You've hit the demo rate limit for the tools. Please try again shortly.",
        },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
      );
    }
  }

  return null;
}

/** Verify a Turnstile token (used by /api/tools/verify). */
export async function verifyHumanToken(
  token: string | undefined | null,
  request: Request,
): Promise<{ ok: boolean; reason?: string }> {
  const result = await verifyTurnstile(token, clientIp(request));
  return result.ok ? { ok: true } : { ok: false, reason: result.reason };
}
