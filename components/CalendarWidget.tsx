"use client";

import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import type { EmbedEvent } from "@calcom/embed-core";
import { track } from "@vercel/analytics";
import type { Attribution } from "@/lib/marketing/attribution";
import type { ServiceId } from "@/lib/marketing/offers";

export default function CalendarWidget({ calLink, service, attribution }: { calLink: string; service: ServiceId; attribution: Attribution }) {
  const [state, setState] = useState<"loading" | "ready" | "slow" | "failed" | "booked" | "requested">("loading");
  const namespace = `consulting-${service}`;

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const timer = window.setTimeout(() => { if (!disposed) setState((current) => current === "loading" ? "slow" : current); }, 15000);
    const seen = new Set<string>();
    async function subscribe() {
      try {
        const cal = await getCalApi({ namespace });
        if (disposed) return;
        cal("ui", { theme: "light", cssVarsPerTheme: { light: { "cal-brand": "#8f4538" }, dark: { "cal-brand": "#8f4538" } }, layout: "month_view" });
        const ready = () => { if (!disposed) setState("ready"); window.clearTimeout(timer); };
        const failed = () => { if (!disposed) setState("failed"); window.clearTimeout(timer); };
        const booked = (event: EmbedEvent<"bookingSuccessfulV2">) => {
          if (disposed) return;
          const data = event.detail.data;
          const accepted = data.status?.toUpperCase() === "ACCEPTED" && !data.paymentRequired;
          setState(accepted ? "booked" : "requested");
          const key = `${accepted ? "accepted" : "requested"}:${data.uid || "current"}`;
          if (seen.has(key)) return;
          seen.add(key);
          try {
            if (data.uid && sessionStorage.getItem(`consulting-booking:${key}`)) return;
            if (data.uid) sessionStorage.setItem(`consulting-booking:${key}`, "1");
          } catch { /* In-memory deduplication remains available. */ }
          // Never send the booking payload, UID, contact fields or meeting URL.
          track(accepted ? "booking_completed" : "booking_requested", { ...attribution, service });
        };
        cal("on", { action: "linkReady", callback: ready });
        cal("on", { action: "linkFailed", callback: failed });
        cal("on", { action: "bookingSuccessfulV2", callback: booked });
        cleanup = () => {
          cal("off", { action: "linkReady", callback: ready });
          cal("off", { action: "linkFailed", callback: failed });
          cal("off", { action: "bookingSuccessfulV2", callback: booked });
        };
      } catch { if (!disposed) setState("failed"); }
    }
    void subscribe();
    return () => { disposed = true; window.clearTimeout(timer); cleanup?.(); };
  }, [namespace, service, attribution]);

  return (
    <div>
      {state === "loading" && <p role="status" className="mb-5 text-on-surface-variant">Loading available times…</p>}
      {(state === "slow" || state === "failed") && <p role="status" className="mb-5 text-on-surface-variant">The calendar is taking longer than expected. Use the direct calendar link or email below if it does not load.</p>}
      {state === "booked" && <p role="status" className="mb-5 font-semibold text-secondary">Your call is booked. Look for the confirmation from Cal.com.</p>}
      {state === "requested" && <p role="status" className="mb-5 text-on-surface-variant">Your request was received. Check Cal.com&apos;s confirmation for any remaining steps.</p>}
      <Cal namespace={namespace} calLink={calLink} style={{ width: "100%", minHeight: "600px" }} config={{ layout: "month_view", ...attribution, "metadata[service]": service }} />
    </div>
  );
}
