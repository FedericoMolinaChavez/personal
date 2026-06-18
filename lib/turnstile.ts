/**
 * Cloudflare Turnstile server-side verification.
 *
 * Mirrors the "placeholder mode" pattern used for Stripe/Resend: when
 * TURNSTILE_SECRET_KEY is not configured the check is skipped so the app keeps
 * working locally and in preview. A honeypot field still guards the form in
 * that case — see app/api/reverse-pitch/route.ts.
 */

const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type VerifyResult =
  | { ok: true; skipped: boolean }
  | { ok: false; reason: string };

/**
 * Verifies a Turnstile token against Cloudflare. Returns `{ ok: true, skipped:
 * true }` when no secret is configured, so callers can treat it as a soft pass.
 */
export async function verifyTurnstile(
  token: string | undefined | null,
  remoteIp?: string | null,
): Promise<VerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Not configured yet — let the request through (honeypot still applies).
  if (!secret) return { ok: true, skipped: true };

  if (!token) {
    return { ok: false, reason: "Missing verification token." };
  }

  const body = new URLSearchParams();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteIp) body.append("remoteip", remoteIp);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    if (data.success) return { ok: true, skipped: false };
    return { ok: false, reason: "Verification failed. Please try again." };
  } catch {
    return { ok: false, reason: "Could not reach verification service." };
  }
}
