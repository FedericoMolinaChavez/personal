import { NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyTurnstile } from "@/lib/turnstile";
import { sanitizeAttribution } from "@/lib/marketing/attribution";

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  project?: string;
  budget?: string;
  timeline?: string;
  attribution?: unknown;
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

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Invalid enquiry. Please check the form and try again." }, { status: 400 });
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
      { error: "Please fill in your name, email, what you need, and an estimated budget range." },
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
          "The enquiry form is unavailable right now. Please email Federico directly at federicomolinachavez@gmail.com.",
      },
      { status: 501 },
    );
  }

  const resend = new Resend(resendKey);
  const rows: Array<[string, string]> = [
    ["Name", name],
    ["Email", email],
    ["Company", company || "—"],
    ["Estimated budget range", budget],
    ["Timeline", timeline || "—"],
    ...Object.entries(sanitizeAttribution(payload.attribution)),
  ];

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "notifications@thenomadhub.xyz",
      to: process.env.CONTACT_EMAIL ?? "federicomolinachavez@gmail.com",
      replyTo: email,
      subject: `Custom engagement: ${name}${company ? ` (${company})` : ""} — ${budget}`,
      html: `
        <h2>New custom engagement enquiry</h2>
        <p>A visitor shared their desired outcome and estimated budget.</p>
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
    if (result.error) throw new Error("Email delivery was not accepted.");
  } catch (err) {
    console.error("Custom engagement delivery failed", err instanceof Error ? err.name : "Unknown error");
    return NextResponse.json(
      { error: "Your enquiry could not be sent. Please try again or email Federico directly at federicomolinachavez@gmail.com." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
