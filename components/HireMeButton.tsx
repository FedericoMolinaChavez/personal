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
   * where there is genuinely no room (the nav pill), and the same notice is
   * carried by the pricing section, the footer and the Terms.
   */
  disclosure?: boolean;
  /** Override the disclosure colour where the button sits on a dark surface. */
  disclosureClassName?: string;
};

export default function HireMeButton({
  className = "",
  label = "Book a session",
  disclosure = true,
  disclosureClassName = "text-on-surface-variant",
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
    <span className="inline-flex flex-col items-start gap-1">
      <button
        onClick={handleClick}
        disabled={loading}
        className={className}
        aria-busy={loading}
      >
        {loading ? "Redirecting…" : label}
      </button>
      {disclosure && (
        <span
          className={`font-label-sm text-label-sm max-w-xs ${disclosureClassName}`}
        >
          {paymentProcessorNotice}
        </span>
      )}
      {note && (
        <span className="font-label-sm text-label-sm text-on-surface-variant max-w-xs">
          {note}
        </span>
      )}
    </span>
  );
}
