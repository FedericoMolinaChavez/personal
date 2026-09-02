"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { useTurnstile } from "@/lib/use-turnstile";
import { Check } from "./dive/Icon";
import { ControlArrow, primaryControl } from "./dive/Instrument";

/**
 * 06 ASCENT STOP 2 — name your own price.
 *
 * Most hiring runs one way. Here it is reversed: the visitor describes the
 * work and proposes what it is worth to them.
 */
type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "w-full border border-hairline bg-sea-deep px-4 py-3 font-body text-[0.9375rem] text-snow placeholder:text-snow-faint/70 transition-colors focus:border-thermocline focus:outline-none focus:ring-1 focus:ring-thermocline";
const labelClass =
  "font-data text-[0.5625rem] uppercase tracking-[0.16em] text-snow-faint";

export default function ReversePitch() {
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
    track("reverse_pitch_submit");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/reverse-pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, token }),
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
      setNote("Network error. Please try again, or email me directly.");
    } finally {
      reset();
    }
  }

  return (
    <section id="pitch" className="scroll-mt-16 py-24 md:py-32">
      <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="max-w-[15ch] font-display text-stage uppercase text-snow">
            Flip it — name your price
          </h2>
        </div>
        <div className="lg:col-span-7">
          <p className="max-w-measure font-body text-lede text-snow-dim">
            Describe the work, propose what it&apos;s worth to you, and
            I&apos;ll tell you honestly whether I can make it happen. No
            back-and-forth to arrive at a number.
          </p>
        </div>
      </div>

      <div className="module mt-14 max-w-3xl">
        <div className="flex items-center justify-between gap-4 border-b border-hairline px-6 py-3.5">
          <span className="font-data text-[0.5625rem] uppercase tracking-[0.16em] text-snow-faint">
            Ascent stop · 06 M
          </span>
          <span className="font-data text-[0.5625rem] uppercase tracking-[0.14em] text-thermocline">
            {status === "success" ? "Logged" : "Open"}
          </span>
        </div>

        <div className="px-6 py-10 md:px-10">
          {status === "success" ? (
            <div className="flex flex-col items-start gap-5 py-4">
              <Check size={30} className="text-thermocline" />
              <h3 className="font-display text-[1.75rem] uppercase leading-none text-snow">
                Pitch logged
              </h3>
              <p className="max-w-measure font-body text-prose text-snow-dim">
                Your proposal landed in my inbox. If it&apos;s a fit, I&apos;ll
                come back to you directly — and if it isn&apos;t, you&apos;ll
                still hear from me.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-1 cursor-pointer font-data text-[0.625rem] uppercase tracking-[0.14em] text-thermocline hover:underline"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-7"
              noValidate
            >
              <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                <label className="flex flex-col gap-2.5">
                  <span className={labelClass}>Your name *</span>
                  <input
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className={fieldClass}
                    placeholder="Jane Founder"
                  />
                </label>
                <label className="flex flex-col gap-2.5">
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
              </div>

              <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                <label className="flex flex-col gap-2.5">
                  <span className={labelClass}>Company</span>
                  <input
                    name="company"
                    type="text"
                    autoComplete="organization"
                    className={fieldClass}
                    placeholder="Optional"
                  />
                </label>
                <label className="flex flex-col gap-2.5">
                  <span className={labelClass}>Timeline</span>
                  <input
                    name="timeline"
                    type="text"
                    className={fieldClass}
                    placeholder="6 weeks, ASAP, flexible…"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2.5">
                <span className={labelClass}>What do you need? *</span>
                <textarea
                  name="project"
                  required
                  rows={5}
                  className={`${fieldClass} resize-y`}
                  placeholder="The problem, the outcome you want, any constraints or stack preferences…"
                />
              </label>

              <label className="flex flex-col gap-2.5">
                <span className={labelClass}>Your proposed price *</span>
                <input
                  name="budget"
                  type="text"
                  required
                  className={fieldClass}
                  placeholder="$4,000 fixed · $120/hr · equity + cash…"
                />
                <span className="font-body text-[0.75rem] text-snow-faint">
                  Name a number or a range — whatever the work is worth to you.
                </span>
              </label>

              {/* Honeypot: hidden from humans, tempting to bots. Leave empty. */}
              <div aria-hidden="true" className="hidden">
                <label>
                  Website
                  <input
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>

              {/* Cloudflare Turnstile mounts here when a site key is set. */}
              {siteKey && <div ref={widgetRef} className="min-h-[65px]" />}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  aria-busy={status === "submitting"}
                  className={primaryControl}
                >
                  <span>
                    {status === "submitting" ? "Sending…" : "Send my pitch"}
                  </span>
                  <ControlArrow />
                </button>
                {note && (
                  <span
                    role="alert"
                    className="max-w-sm font-body text-[0.8125rem] text-coral"
                  >
                    {note}
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
