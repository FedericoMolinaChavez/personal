"use client";

import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics";
import { getAttribution } from "@/lib/marketing/attribution";
import type { Attribution } from "@/lib/marketing/attribution";

// Only mounted after the server has verified the Stripe session as paid.
export default function PaymentConfirmation({ sessionId, amount, currency, attribution }: { sessionId: string; amount: number; currency: string; attribution: Attribution }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    try {
      if (sessionStorage.getItem(`consulting-payment:${sessionId}`)) return;
      sessionStorage.setItem(`consulting-payment:${sessionId}`, "1");
    } catch { /* The ref still deduplicates within this mount. */ }
    track("build_plan_paid", { ...getAttribution(), ...attribution, service: "build-plan", amount, currency });
  }, [sessionId, amount, currency, attribution]);
  return null;
}
