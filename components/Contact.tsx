import BookingEmbed from "./BookingEmbed";
import HireMeButton from "./HireMeButton";
import ScheduleCallButton from "./ScheduleCallButton";
import {
  ControlArrow,
  primaryControl,
  secondaryControl,
} from "./dive/Instrument";

/**
 * 00 SURFACE & LOG — book the call.
 *
 * The ascent completes: light comes back, the ground returns to the sunlit
 * tint, and the page ends on the one action it was built around.
 */
export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 pb-28 pt-24 md:pt-32">
      <div className="relative">
        {/* Surfacing: the light returns. */}
        <div
          aria-hidden="true"
          className="light-shafts pointer-events-none absolute inset-x-0 -top-10 h-[120%] opacity-70"
        />

        <div className="relative flex flex-col items-start gap-8 border-y border-thermocline/40 py-16 md:py-20">
          <h2 className="max-w-[15ch] font-display text-hero uppercase text-snow">
            Tell me what&apos;s breaking
          </h2>

          <p className="max-w-measure font-body text-lede text-snow-dim">
            Fifteen minutes, free, to work out whether this is work I should be
            doing. Or skip it and put ninety minutes straight against the
            decision you&apos;re stuck on.
          </p>

          <div className="mt-2 flex flex-col items-start gap-x-5 gap-y-6 sm:flex-row">
            <ScheduleCallButton
              label="Book a 15-minute call"
              className={primaryControl}
            >
              <ControlArrow />
            </ScheduleCallButton>
            <HireMeButton
              label="Buy 90 minutes — $300"
              className={secondaryControl}
            >
              <ControlArrow />
            </HireMeButton>
          </div>
        </div>
      </div>

      {/* The booking instrument itself. */}
      <div id="booking" className="mt-20 scroll-mt-16">
        <div className="mb-8 flex items-baseline justify-between gap-6 border-b border-hairline pb-4">
          <h3 className="font-display text-[1.5rem] uppercase leading-none text-snow md:text-[2rem]">
            Pick a time
          </h3>
          <span className="font-data text-[0.5625rem] uppercase tracking-[0.14em] text-snow-faint">
            15 min · No charge
          </span>
        </div>
        <BookingEmbed />
      </div>
    </section>
  );
}
