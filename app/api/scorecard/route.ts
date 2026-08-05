import { NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyTurnstile } from "@/lib/turnstile";
import { checkRateLimit, clientIp } from "@/lib/shared/ratelimit";
import { checkIds, pillars, scoreFor, TOTAL_CHECKS } from "@/lib/scorecard";

type Payload = {
  email?: string;
  name?: string;
  company?: string;
  /** Ids of the checks the visitor ticked. Validated against lib/scorecard. */
  checked?: unknown;
  // Anti-bot
  token?: string; // Turnstile response token
  website?: string; // honeypot — must stay empty for humans
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = 5000;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX) : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Keeps only ids that exist in the scorecard. The submitted score is never
 * read from the request — it is recomputed here from the surviving ids, so a
 * tampered or stale client cannot report a number that isn't its answers.
 */
function validIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  for (const entry of value.slice(0, TOTAL_CHECKS * 2)) {
    if (typeof entry === "string" && checkIds.has(entry)) seen.add(entry);
  }
  return [...seen];
}

export async function POST(request: Request) {
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success so they don't retry,
  // but never deliver the message.
  if (clean(payload.website)) {
    return NextResponse.json({ ok: true });
  }

  const email = clean(payload.email);
  const name = clean(payload.name);
  const company = clean(payload.company);

  if (!email) {
    return NextResponse.json(
      { error: "Please enter an email address." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  // Bot verification (skipped automatically until TURNSTILE_SECRET_KEY is set).
  const remoteIp =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null;
  const verification = await verifyTurnstile(payload.token, remoteIp);
  if (!verification.ok) {
    return NextResponse.json({ error: verification.reason }, { status: 400 });
  }

  // Bounds abuse of a public endpoint that sends mail. Fails open when
  // Supabase isn't configured, so this is a no-op in placeholder mode.
  const limit = await checkRateLimit(`scorecard:${clientIp(request)}`);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  const checked = new Set(validIds(payload.checked));
  const result = scoreFor(checked);

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    // Match the rest of the app: feature degrades gracefully without keys.
    return NextResponse.json(
      {
        error:
          "Submissions aren't configured yet. Add RESEND_API_KEY to enable this form.",
      },
      { status: 501 },
    );
  }

  const resend = new Resend(resendKey);

  // Everything below comes from lib/scorecard.ts, not from the request. Only
  // name/company/email are visitor-supplied, and those are escaped.
  const breakdown = result.perPillar
    .map((p) => `<li><strong>${p.name}:</strong> ${p.score}/${p.total}</li>`)
    .join("");
  const gaps = pillars
    .map((pillar) => {
      const missing = pillar.checks.filter((c) => !checked.has(c.id));
      if (missing.length === 0) return "";
      return `<h4>${pillar.name}</h4><ul>${missing
        .map((c) => `<li>${c.label}</li>`)
        .join("")}</ul>`;
    })
    .join("");

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "notifications@thenomadhub.xyz",
      to: process.env.CONTACT_EMAIL ?? "federico@federicomolina.com",
      replyTo: email,
      subject: `Scorecard: ${result.score}/${result.total} (${result.band.name}) — ${email}`,
      html: `
        <h2>Production readiness scorecard submitted</h2>
        <ul>
          <li><strong>Name:</strong> ${escapeHtml(name || "—")}</li>
          <li><strong>Email:</strong> ${escapeHtml(email)}</li>
          <li><strong>Company:</strong> ${escapeHtml(company || "—")}</li>
          <li><strong>Score:</strong> ${result.score}/${result.total} (${result.pct}%) — ${result.band.name}</li>
        </ul>
        <h3>By pillar</h3>
        <ul>${breakdown}</ul>
        ${
          result.weakest.length
            ? `<p><strong>At or below 1/5:</strong> ${result.weakest
                .map((p) => p.name)
                .join(", ")}</p>`
            : ""
        }
        <h3>Unchecked items</h3>
        ${gaps || "<p>None — everything checked.</p>"}
        <p style="color:#888">Reply directly to this email to reach them.</p>
      `,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Could not send your results: ${message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
