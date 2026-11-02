"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import { getAttribution } from "@/lib/marketing/attribution";
import type { ServiceId } from "@/lib/marketing/offers";

type Props = { className?: string; label?: string; href?: string; service?: ServiceId };

export default function ScheduleCallButton({
  className = "button-primary", label = "Book a free 15-minute call",
  href = "/#booking", service = "general",
}: Props) {
  return (
    <Link href={href} onClick={() => {
      try { sessionStorage.setItem("consulting-booking-service", service); } catch { /* Storage is optional. */ }
      track("schedule_call_click", { ...getAttribution(), service });
    }} className={className}>
      {label}
    </Link>
  );
}
