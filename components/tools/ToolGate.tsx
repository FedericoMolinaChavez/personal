"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileApi = {
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

function getTurnstile(): TurnstileApi | undefined {
  return (window as unknown as { turnstile?: TurnstileApi }).turnstile;
}

type State = "checking" | "verified" | "challenge";

/**
 * One-time human gate for the tools. When Turnstile is configured
 * (NEXT_PUBLIC_TURNSTILE_SITE_KEY set), it checks the server for an existing
 * gate cookie and, if absent, shows a Cloudflare Turnstile challenge; on pass it
 * POSTs the token to /api/tools/verify (which sets the httpOnly cookie the API
 * routes require) and reveals the tools. No key configured → renders children.
 */
export default function ToolGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(SITE_KEY ? "checking" : "verified");
  const [error, setError] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  // 1) Check current verification status once.
  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/tools/verify");
        const json = (await res.json().catch(() => ({}))) as {
          verified?: boolean;
        };
        if (!cancelled) setState(json.verified ? "verified" : "challenge");
      } catch {
        if (!cancelled) setState("challenge");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Render the Turnstile widget while challenging.
  useEffect(() => {
    if (state !== "challenge" || !SITE_KEY) return;
    let cancelled = false;

    async function onToken(token: string) {
      setError(null);
      try {
        const res = await fetch("/api/tools/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(j.error ?? "Verification failed.");
        }
        if (!cancelled) setState("verified");
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Verification failed.");
          getTurnstile()?.reset(widgetId.current ?? undefined);
        }
      }
    }

    function render() {
      const ts = getTurnstile();
      if (cancelled || widgetId.current || !ts || !widgetRef.current) return;
      widgetId.current = ts.render(widgetRef.current, {
        sitekey: SITE_KEY!,
        theme: "dark",
        callback: onToken,
        "expired-callback": () => {},
        "error-callback": () => setError("Verification error — please retry."),
      });
    }

    if (getTurnstile()) {
      render();
      return () => {
        cancelled = true;
      };
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
  }, [state]);

  if (state === "verified") return <>{children}</>;

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-cmd-line bg-cmd-surface p-8 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cmd-surface2 text-cmd-accent">
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
            verified_user
          </span>
        </span>
        <p className="mt-5 font-mono text-label-sm uppercase tracking-[0.2em] text-cmd-amber">
          Human check
        </p>
        <h2 className="mt-2 font-display text-headline-md font-bold text-cmd-text">
          Quick verification
        </h2>
        <p className="mt-2 text-body-md text-cmd-muted">
          These tools call AI models, so we confirm you&apos;re human before you
          start. One check unlocks them for a while.
        </p>
        {state === "checking" ? (
          <p className="mt-5 font-mono text-label-sm text-cmd-muted">Checking…</p>
        ) : (
          <div ref={widgetRef} className="mt-5 flex min-h-[70px] justify-center" />
        )}
        {error && <p className="mt-3 text-label-sm text-cmd-danger">{error}</p>}
      </div>
    </div>
  );
}
