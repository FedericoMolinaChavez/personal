import { NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyTurnstile } from "@/lib/turnstile";

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  project?: string;
  budget?: string;
  timeline?: string;
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

  const name = clean(payload.name);
  const email = clean(payload.email);
  const company = clean(payload.company);
  const project = clean(payload.project);
  const budget = clean(payload.budget);
  const timeline = clean(payload.timeline);

  if (!name || !email || !project || !budget) {
    return NextResponse.json(
      { error: "Please fill in your name, email, what you need, and a price." },
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
  const rows: Array<[string, string]> = [
    ["Name", name],
    ["Email", email],
    ["Company", company || "—"],
    ["Proposed price", budget],
    ["Timeline", timeline || "—"],
  ];

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "notifications@thenomadhub.xyz",
      to: process.env.CONTACT_EMAIL ?? "federicomolinachavez@gmail.com",
      replyTo: email,
      subject: `New pitch: ${name}${company ? ` (${company})` : ""} — ${budget}`,
      html: `
        <h2>You got pitched 👋</h2>
        <p>Someone wants to hire you and proposed their own terms.</p>
        <ul>
          ${rows
            .map(
              ([label, value]) =>
                `<li><strong>${label}:</strong> ${escapeHtml(value)}</li>`,
            )
            .join("")}
        </ul>
        <h3>What they need</h3>
        <p style="white-space:pre-wrap">${escapeHtml(project)}</p>
        <p style="color:#888">Reply directly to this email to reach ${escapeHtml(name)}.</p>
      `,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Could not send your pitch: ${message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
