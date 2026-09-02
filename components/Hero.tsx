import ScheduleCallButton from "./ScheduleCallButton";
import HireMeButton from "./HireMeButton";
import {
  ControlArrow,
  primaryControl,
  secondaryControl,
} from "./dive/Instrument";
import { ArrowDown } from "./dive/Icon";

/**
 * 00 SURFACE — enter water, check systems.
 *
 * The first viewport is the thesis: the whole practice stated as a depth
 * problem, with the primary action lit and the descent already legible.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[86vh] scroll-mt-16 flex-col justify-center py-20 md:py-28"
    >
      {/* Sunlight only exists up here. */}
      <div
        aria-hidden="true"
        className="light-shafts pointer-events-none absolute inset-x-0 -top-16 h-[130%]"
      />

      <div className="relative">
        <h1 className="max-w-[19ch] font-display text-hero uppercase text-snow">
          Everything holds
          <br />
          in the shallows
        </h1>

        <p className="mt-8 max-w-measure font-body text-lede text-snow-dim">
          Your agents pass the demo because a demo is one request, in daylight,
          with a warm cache and nobody watching. Production is forty metres
          down: concurrent traffic, cold context, a retry storm at 3am, and a
          token bill that nobody has read since launch. I go down and find out
          what actually broke.
        </p>

        <p className="mt-5 max-w-measure font-body text-prose text-snow-faint">
          I&apos;m Federico — fractional CTO and AI systems architect. Eight
          years on production systems, the last stretch almost entirely on LLM
          and agent systems.
        </p>

        <div className="mt-11 flex flex-col items-start gap-x-5 gap-y-6 sm:flex-row sm:items-start">
          <ScheduleCallButton
            label="Book a 15-minute call"
            className={primaryControl}
          >
            <ControlArrow />
          </ScheduleCallButton>

          <HireMeButton
            label="Or buy 90 minutes — $300"
            className={secondaryControl}
          >
            <ControlArrow />
          </HireMeButton>
        </div>
      </div>

      {/* One instrument line, not a stat grid. Three figures, all of them
          literally true; the dive is the page's metaphor and never gets to
          pose as a measured quantity next to them. */}
      <dl className="relative mt-16 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-5 border-t border-hairline pt-5 font-data text-[0.6875rem] uppercase tracking-[0.14em] sm:grid-cols-3">
        {[
          { v: "08", u: "yr", k: "building production systems" },
          { v: "05", u: "", k: "products shipped — one shut down" },
          { v: "500", u: "k/mo", k: "leads attributed via Attribute.ai" },
        ].map((item) => (
          <div key={item.k} className="flex items-baseline gap-2.5">
            <dt className="sr-only">{item.k}</dt>
            <dd className="flex items-baseline gap-2.5">
              <span className="tabular shrink-0 text-[1.125rem] leading-none text-thermocline">
                {item.v}
                {item.u && (
                  <span className="ml-0.5 text-[0.5rem] text-snow-faint">
                    {item.u}
                  </span>
                )}
              </span>
              <span className="text-snow-faint" aria-hidden="true">
                {item.k}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <a
        href="#break"
        className="relative mt-14 inline-flex items-center gap-3 self-start font-data text-[0.625rem] uppercase tracking-[0.16em] text-snow-faint transition-colors hover:text-thermocline"
      >
        <ArrowDown size={16} />
        Descend to the thermocline
      </a>
    </section>
  );
}
