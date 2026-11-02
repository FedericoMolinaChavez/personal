"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { getAttribution } from "@/lib/marketing/attribution";

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
      remove: (id: string) => void;
    };
  }
}

const fieldClass =
  "w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";
const labelClass =
  "font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant";

export default function ReversePitch() {
  const [status, setStatus] = useState<Status>("idle");
  const [note, setNote] = useState<string | null>(null);
  const [token, setToken] = useState("");

  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const showForm = status !== "success";

  useEffect(() => {
    if (status === "success" && confirmationRef.current) {
      confirmationRef.current.focus({ preventScroll: true });
      confirmationRef.current.scrollIntoView({ block: "center", behavior: "instant" });
    }
  }, [status]);

  // Render the Cloudflare Turnstile widget when a site key is configured.
  useEffect(() => {
    if (!SITE_KEY || !showForm) return;

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
        callback: (t) => { if (!cancelled) setToken(t); },
        "expired-callback": () => { if (!cancelled) setToken(""); },
        "error-callback": () => { if (!cancelled) setToken(""); },
      });
    }

    const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${SRC}"]`,
    );
    if (window.turnstile) {
      render();
    } else if (!script) {
      script = document.createElement("script");
      script.src = SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script?.addEventListener("load", render);
    return () => {
      cancelled = true;
      script?.removeEventListener("load", render);
      if (widgetId.current) {
        window.turnstile?.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [showForm]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (SITE_KEY && !token) {
      setStatus("error");
      setNote("Please complete the verification below.");
      return;
    }

    setStatus("submitting");
    setNote(null);
    track("custom_engagement_attempt", getAttribution());

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/reverse-pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, token, attribution: getAttribution() }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        track("custom_engagement_submitted", getAttribution());
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
        <h2 className="font-display text-headline-lg md:text-[48px] text-on-background max-w-2xl">
          Have a different technical challenge?
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Request a custom engagement. Tell me the outcome you want, your
          constraints and an estimated budget range. I&apos;ll review the fit
          and we can agree the scope before you commit.
        </p>
      </div>

      <div className="bg-surface-container rounded-3xl p-8 md:p-12 max-w-3xl">
        {status === "success" ? (
          <div ref={confirmationRef} tabIndex={-1} role="status" className="flex flex-col items-center text-center gap-4 py-8">
            <span
              className="material-symbols-outlined text-[56px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              mark_email_read
            </span>
            <h3 className="font-display text-headline-md text-on-background">
              Enquiry received.
            </h3>
            <p className="text-on-surface-variant max-w-md">
              Thanks for sharing your project. I&apos;ll review your enquiry
              and reply by email about whether I can help and the next step.
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
              <span className={labelClass}>Estimated budget range *</span>
              <input
                name="budget"
                type="text"
                required
                className={fieldClass}
                placeholder="e.g. $2,000–$5,000, or still deciding"
              />
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                A planning range helps establish fit. It is not a price commitment.
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
                {status === "submitting" ? "Sending…" : "Request a custom engagement"}
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
