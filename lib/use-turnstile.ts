"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Cloudflare Turnstile widget lifecycle for client forms.
 *
 * Mirrors the placeholder-mode pattern used elsewhere: when
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset, `siteKey` is undefined, nothing is
 * injected, and callers skip the widget entirely. The server side soft-passes
 * to match — see lib/turnstile.ts.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

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

export type Turnstile = {
  /** Undefined until a site key is configured; gate the widget div on this. */
  siteKey: string | undefined;
  /** Empty until the visitor solves the challenge. Send it with the request. */
  token: string;
  /** Attach to the element the widget should mount into. */
  widgetRef: React.RefObject<HTMLDivElement | null>;
  /** Clear the solved token so a second submission gets a fresh challenge. */
  reset: () => void;
};

export function useTurnstile(): Turnstile {
  const [token, setToken] = useState("");

  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

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

  const reset = useCallback(() => {
    if (!SITE_KEY) return;
    if (window.turnstile && widgetId.current) {
      window.turnstile.reset(widgetId.current);
    }
    setToken("");
  }, []);

  return { siteKey: SITE_KEY, token, widgetRef, reset };
}
