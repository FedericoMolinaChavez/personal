"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Status = "idle" | "submitting" | "success" | "error";

// Minimal typing for the Turnstile global injected by Cloudflare's script.
declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (id?: string) => void;
    };
  }
}

const fieldClass =
  "w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";
const labelClass =
  "font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant";

export default function ReversePitch() {
  const [status, setStatus] = useState<Status>("idle");
  const [note, setNote] = useState<string | null>(null);
  const [token, setToken] = useState("");

  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  // Render the Cloudflare Turnstile widget when a site key is configured.
  useEffect(() => {
    if (!SITE_KEY) return;

    let cancelled = false;

    function render() {
      if (
        cancelled ||
        widgetId.current ||
        !window.turnstile ||
        !widgetRef.current
      ) {
        return;
      }
      widgetId.current = window.turnstile.render(widgetRef.current, {
        sitekey: SITE_KEY!,
        theme: "auto",
        callback: (t) => setToken(t),
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    }

    if (window.turnstile) {
      render();
      return;
    }

    const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${SRC}"]`,
    );
    if (!script) {
      script = document.createElement("script");
      script.src = SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", render);
    return () => {
      cancelled = true;
      script?.removeEventListener("load", render);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (SITE_KEY && !token) {
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
      setNote("Network error. Please try again or email me directly.");
    } finally {
      if (SITE_KEY && window.turnstile && widgetId.current) {
        window.turnstile.reset(widgetId.current);
        setToken("");
      }
    }
  }

  return (
    <section id="pitch" className="py-32 scroll-mt-24 reveal">
      <div className="flex flex-col gap-4 mb-12">
        <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
          Pitch Me
        </span>
        <h2 className="font-display text-headline-lg md:text-[48px] text-on-background max-w-2xl">
          Flip the script — tell me what you need and name your price.
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Most hiring runs one way. Here it&apos;s reversed: describe the work,
          propose what it&apos;s worth to you, and I&apos;ll tell you honestly
          whether I can make it happen. No back-and-forth to get a number.
        </p>
      </div>

      <div className="bg-surface-container rounded-3xl p-8 md:p-12 max-w-3xl">
        {status === "success" ? (
          <div className="flex flex-col items-center text-center gap-4 py-8">
            <span
              className="material-symbols-outlined text-[56px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              mark_email_read
            </span>
            <h3 className="font-display text-headline-md text-on-background">
              Pitch received.
            </h3>
            <p className="text-on-surface-variant max-w-md">
              Thanks — your proposal landed in my inbox. If it&apos;s a fit,
              I&apos;ll get back to you directly. Otherwise you&apos;ll still
              hear from me.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-2 text-primary font-label-md text-label-md hover:underline cursor-pointer"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Timeline</span>
                <input
                  name="timeline"
                  type="text"
                  className={fieldClass}
                  placeholder="e.g. 6 weeks, ASAP, flexible"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>What do you need? *</span>
              <textarea
                name="project"
                required
                rows={5}
                className={`${fieldClass} resize-y`}
                placeholder="The problem, the outcome you want, any constraints or stack preferences…"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className={labelClass}>Your proposed price *</span>
              <input
                name="budget"
                type="text"
                required
                className={fieldClass}
                placeholder="e.g. $4,000 fixed, $120/hr, equity + cash…"
              />
              <span className="font-label-sm text-label-sm text-on-surface-variant">
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
            {SITE_KEY && <div ref={widgetRef} className="min-h-[65px]" />}

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                type="submit"
                disabled={status === "submitting"}
                aria-busy={status === "submitting"}
                className="bg-primary text-on-primary px-10 py-4 rounded-full font-label-md text-label-md hover:scale-95 transition-transform cursor-pointer disabled:opacity-70 disabled:hover:scale-100"
              >
                {status === "submitting" ? "Sending…" : "Send my pitch"}
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
        )}
      </div>
    </section>
  );
}
