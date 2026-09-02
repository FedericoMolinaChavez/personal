"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { paymentProcessorNotice } from "@/lib/company";

type Props = {
  className?: string;
  label?: string;
  /**
   * Show the "Payments processed by …" line under the button. On by default —
   * the disclosure belongs next to anything that takes money. Turned off only
   * where there is genuinely no room (the nav control), and the same notice is
   * carried by the pricing stage, the footer and the Terms.
   */
  disclosure?: boolean;
  /** Override the disclosure colour where the control sits on a lit surface. */
  disclosureClassName?: string;
  /** Trailing instrument glyph — usually <ControlArrow />. */
  children?: React.ReactNode;
};

export default function HireMeButton({
  className = "",
  label = "Book a session",
  disclosure = true,
  disclosureClassName = "text-snow-faint",
  children,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function handleClick() {
    track("hire_me_click");
    setLoading(true);
    setNote(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setNote(
        data.error || "Something went wrong. Please try again or email me.",
      );
    } catch {
      setNote("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className={className}
        aria-busy={loading}
      >
        <span>{loading ? "Opening checkout…" : label}</span>
        {children}
      </button>
      {disclosure && (
        <span
          className={`max-w-xs font-data text-[0.5625rem] uppercase tracking-[0.12em] ${disclosureClassName}`}
        >
          {paymentProcessorNotice}
        </span>
      )}
      {note && (
        <span
          role="alert"
          className="max-w-xs font-body text-[0.8125rem] text-coral"
        >
          {note}
        </span>
      )}
    </span>
  );
}
