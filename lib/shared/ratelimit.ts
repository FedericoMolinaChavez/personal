import { getSupabaseAdmin } from "@/lib/shared/supabase/server";

/**
 * Per-IP rate limiting for the public-facing tools, backed by public.rate_limits
 * (see the rate_limits migration). Two windows — a per-minute burst limit and a
 * per-day cap — bound how much LLM cost a single IP can run up. Tunable via env.
 * Fails open on error / when Supabase isn't configured, so a limiter hiccup
 * never takes the app down (the Turnstile gate is the primary bot filter).
 */

const PER_MIN = Number(process.env.RATE_LIMIT_PER_MIN ?? 3);
const PER_DAY = Number(process.env.RATE_LIMIT_PER_DAY ?? 20);

/** Best-effort client IP from the platform headers (Cloudflare / Vercel). */
export function clientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export type RateResult = { ok: true } | { ok: false; retryAfterSec: number };

function secondsUntilNextDayUtc(now: Date): number {
  const next = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  );
  return Math.max(1, Math.ceil((next - now.getTime()) / 1000));
}

/**
 * Record one hit for `key` and decide whether it's allowed. `key` is typically
 * `tools:<ip>` so the daily cap is a combined budget across all tools per IP.
 */
export async function checkRateLimit(key: string): Promise<RateResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: true }; // placeholder mode — no limiter

  const now = new Date();
  const minuteStart = new Date(Math.floor(now.getTime() / 60000) * 60000);
  const dayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  const db = supabase as unknown as {
    rpc: (
      fn: string,
      args: Record<string, unknown>,
    ) => Promise<{ data: unknown; error: unknown }>;
  };

  const { data, error } = await db.rpc("rate_limit_hit", {
    p_key: key,
    p_minute_start: minuteStart.toISOString(),
    p_day_start: dayStart.toISOString(),
  });
  // Fail open: a limiter error must not break the tools.
  if (error || !data) return { ok: true };

  const row = (Array.isArray(data) ? data[0] : data) as
    | { min_count?: number; day_count?: number }
    | undefined;
  const minCount = row?.min_count ?? 0;
  const dayCount = row?.day_count ?? 0;

  if (minCount > PER_MIN) {
    return { ok: false, retryAfterSec: 60 - now.getSeconds() };
  }
  if (dayCount > PER_DAY) {
    return { ok: false, retryAfterSec: secondsUntilNextDayUtc(now) };
  }
  return { ok: true };
}
