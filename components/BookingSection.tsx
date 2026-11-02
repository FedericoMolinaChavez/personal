import BookingEmbed from "./BookingEmbed";
import type { ServiceId } from "@/lib/marketing/offers";

export default function BookingSection({ service = "general", title = "Let's work out your next step." }: { service?: ServiceId; title?: string }) {
  return (
    <section id="booking" className="py-20 md:py-28 scroll-mt-24 border-t border-outline-variant">
      <div className="max-w-2xl mb-10">
        <h2 className="font-display text-4xl md:text-5xl mb-5">{title}</h2>
        <p className="text-body-lg text-on-surface-variant">A free 15-minute conversation about your priorities, constraints and whether I can help. No obligation to start an engagement.</p>
      </div>
      <BookingEmbed service={service} />
    </section>
  );
}
