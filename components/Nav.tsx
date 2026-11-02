"use client";

import Link from "next/link";
import { useState } from "react";
import ScheduleCallButton from "./ScheduleCallButton";
import type { ServiceId } from "@/lib/marketing/offers";

const links = [
  { href: "/ai-systems-audit", label: "AI systems audit" },
  { href: "/fractional-cto", label: "Fractional CTO" },
  { href: "/#work", label: "Work" },
  { href: "/#offer", label: "Build plan" },
];

export default function Nav({ service = "general", focused = false }: { service?: ServiceId; focused?: boolean }) {
  const [open, setOpen] = useState(false);
  const bookingHref = focused ? "#booking" : "/#booking";
  const visibleLinks = focused ? [{ href: "/#work", label: "Selected work" }] : links;
  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <nav aria-label="Main navigation" className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex min-h-20 items-center justify-between gap-4">
          <Link href="/" aria-label="CTO + AI home" className="font-display text-headline-md font-extrabold text-primary shrink-0">CTO + AI</Link>
          <div className="hidden xl:flex items-center gap-6">
            {visibleLinks.map((link) => <Link key={link.href} href={link.href} className="text-label-md hover:text-primary">{link.label}</Link>)}
          </div>
          <div className="flex items-center gap-3">
            <ScheduleCallButton href={bookingHref} service={service} label={focused ? "Book a scoping call" : "Book a free call"} className="button-primary hidden sm:inline-flex" />
            <button type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} className="xl:hidden min-h-11 px-3 text-label-md border border-outline-variant rounded-full">{open ? "Close" : "Menu"}</button>
          </div>
        </div>
        {open && (
          <div id="mobile-navigation" className="xl:hidden flex flex-col gap-1 border-t border-outline-variant py-4" onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}>
            {visibleLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="py-3 hover:text-primary">{link.label}</Link>)}
            <div onClick={() => setOpen(false)}><ScheduleCallButton href={bookingHref} service={service} label="Book a free 15-minute call" className="button-primary mt-2" /></div>
          </div>
        )}
      </nav>
    </header>
  );
}
