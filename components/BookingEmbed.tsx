"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { getAttribution } from "@/lib/marketing/attribution";
import type { Attribution } from "@/lib/marketing/attribution";
import type { ServiceId } from "@/lib/marketing/offers";

const Calendar = dynamic(() => import("./CalendarWidget"), {
  ssr: false,
  loading: () => <p role="status" className="p-8 text-on-surface-variant">Loading available times…</p>,
});

const configuredLink = (process.env.NEXT_PUBLIC_CALCOM_LINK || "").trim().replace(/^https:\/\/cal\.com\//, "").replace(/\/$/, "");
const calLink = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_/-]+$/.test(configuredLink) && !configuredLink.startsWith("placeholder/")
  ? configuredLink : "";

export default function BookingEmbed({ service = "general" }: { service?: ServiceId }) {
  const [context, setContext] = useState<{ attribution: Attribution; service: ServiceId } | null>(null);
  function openCalendar() {
    let selected = service;
    try {
      const saved = sessionStorage.getItem("consulting-booking-service");
      if (service === "general" && ["ai-systems-audit", "fractional-cto", "build-plan"].includes(saved || "")) selected = saved as ServiceId;
    } catch { /* Booking also works with browser storage disabled. */ }
    setContext({ service: selected, attribution: getAttribution() });
  }

  return (
    <div className="rounded-xl bg-surface-container-low p-6 md:p-10">
      {!calLink ? (
        <div className="max-w-xl">
          <h3 className="font-display text-2xl mb-3">Arrange a time by email.</h3>
          <p className="text-on-surface-variant mb-5">Online scheduling is currently unavailable. Send me a short note about what you need and we can find a time to talk.</p>
          <a href={`mailto:federicomolinachavez@gmail.com?subject=${encodeURIComponent("Scoping call: " + service)}`} className="button-primary">Email Federico to arrange a call</a>
        </div>
      ) : (
        <>
          {!context ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <button type="button" onClick={openCalendar} className="button-primary">Show available times</button>
              <p className="text-sm text-on-surface-variant max-w-md">The calendar loads from Cal.com when you open it. Choose a time in your local time zone.</p>
            </div>
          ) : <Calendar calLink={calLink} service={context.service} attribution={context.attribution} />}
          <p className="text-sm text-on-surface-variant mt-6">
            Prefer another way? <a className="underline underline-offset-4" href={`https://cal.com/${calLink}`} target="_blank" rel="noopener noreferrer">Open the calendar in a new tab</a>
            {" "}or <a href="mailto:federicomolinachavez@gmail.com" className="underline underline-offset-4">email me</a>.
          </p>
        </>
      )}
    </div>
  );
}
