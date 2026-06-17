"use client";

import { useState } from "react";

type Props = {
  className?: string;
  label?: string;
};

export default function HireMeButton({
  className = "",
  label = "Hire Me",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function handleClick() {
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
      {note && (
        <span className="font-label-sm text-label-sm text-on-surface-variant max-w-xs">
          {note}
        </span>
      )}
    </span>
  );
}
