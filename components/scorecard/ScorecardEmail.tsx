"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { useTurnstile } from "@/lib/use-turnstile";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";
const labelClass =
  "font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant";

/**
 * Optional capture below the results. The score is already on screen — this
 * only offers to send the written breakdown, so nothing is gated behind it.
 * `checked` is sent as ids; the server rescores them itself.
 */
export default function ScorecardEmail({ checked }: { checked: string[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [note, setNote] = useState<string | null>(null);
  const { siteKey, token, widgetRef, reset } = useTurnstile();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (siteKey && !token) {
      setStatus("error");
      setNote("Please complete the verification below.");
      return;
    }

    setStatus("submitting");
    setNote(null);
    track("scorecard_email_submit");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/scorecard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, checked, token }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("success");
        form.reset();
        return;
      }
      setStatus("error");
      setNote(json.error || "Something went wrong. Please try again.");
    } catch {
      setStatus("error");
      setNote("Network error. Please try again or email me directly.");
    } finally {
      reset();
    }
  }

  if (status === "success") {
    return (
      <div className="bg-surface-container rounded-3xl p-8 md:p-12">
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <span
            translate="no"
            className="material-symbols-outlined text-[56px] text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            mark_email_read
          </span>
          <h3 className="font-display text-headline-md text-on-background">
            Score received.
          </h3>
          <p className="text-on-surface-variant max-w-md">
            I&apos;ll send the breakdown — which pillars are weakest and what to
            fix in what order — to that address. Reply to it if you want to talk
            through any of it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container rounded-3xl p-8 md:p-12">
      <div className="flex flex-col gap-2 mb-8">
        <h3 className="font-display text-headline-md text-on-background">
          Want the written breakdown?
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Optional. Your score is already above — this sends you the same
          result with the reasoning: which pillars are weakest, what usually
          breaks first, and the order I&apos;d fix them in. No list, no
          sequence, no follow-up you didn&apos;t ask for.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Email *</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
            placeholder="jane@company.com"
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Your name</span>
            <input
              name="name"
              type="text"
              autoComplete="name"
              className={fieldClass}
              placeholder="Optional"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Company</span>
            <input
              name="company"
              type="text"
              autoComplete="organization"
              className={fieldClass}
              placeholder="Optional"
            />
          </label>
        </div>

        {/* Honeypot: hidden from humans, tempting to bots. Leave empty. */}
        <div aria-hidden="true" className="hidden">
          <label>
            Website
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {/* Cloudflare Turnstile mounts here when a site key is set. */}
        {siteKey && <div ref={widgetRef} className="min-h-[65px]" />}

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            type="submit"
            disabled={status === "submitting"}
            aria-busy={status === "submitting"}
            className="bg-primary text-on-primary px-10 py-4 rounded-full font-label-md text-label-md hover:scale-95 transition-transform cursor-pointer disabled:opacity-70 disabled:hover:scale-100"
          >
            {status === "submitting" ? "Sending…" : "Send me the breakdown"}
          </button>
          {note && (
            <span
              role="alert"
              className="font-label-sm text-label-sm text-error max-w-sm"
            >
              {note}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
