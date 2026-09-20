import Link from "next/link";
import ScheduleCallButton from "./ScheduleCallButton";
import { ControlArrow, secondaryControl } from "./dive/Instrument";
import { getPostPath } from "@/lib/blog/posts";

/**
 * 18 THERMOCLINE — where the demo stops holding.
 *
 * The lead proof. With no testimonials and no client logos, the only
 * credibility available is naming the reader's failure more precisely than
 * they can. So this stage is the diagnosis, stated as observed conditions:
 * what they see, and what it actually is.
 */
const observations = [
  {
    code: "TH-01",
    depth: "18",
    seen: "It worked all week, then fell over on Tuesday.",
    is: "Your agent loop has no idempotency and no cap. One upstream timeout became a retry, the retry re-entered the same tool, and the loop paid for it four hundred times before anyone noticed.",
  },
  {
    code: "TH-02",
    depth: "24",
    seen: "The model got worse and we didn't change anything.",
    is: "Your context window is being packed by a retriever nobody has evaluated since the first week. Relevant chunks are getting pushed out by boilerplate, and quality drops silently because nothing measures it.",
  },
  {
    code: "TH-03",
    depth: "31",
    seen: "The bill tripled and we can't see why.",
    is: "Token spend is unattributed. No per-request accounting, no per-feature ceiling, and a prompt that grew every sprint because appending to it is always the cheapest fix in the moment.",
  },
  {
    code: "TH-04",
    depth: "38",
    seen: "It's fine — we tested it.",
    is: "You tested a happy path by hand. There is no eval set, so every deploy is a guess, and a regression only surfaces when a customer describes it badly in a support ticket.",
  },
  {
    code: "TH-05",
    depth: "47",
    seen: "Two agents got into an argument and burned an hour.",
    is: "Orchestration has no termination condition and no shared state discipline. Each agent is individually reasonable; the system has no rule about who decides, so it never converges.",
  },
  {
    code: "TH-06",
    depth: "55",
    seen: "It's an AI problem, so it's the model's fault.",
    is: "It usually isn't. It's an unauthenticated route, a key in the client bundle, or a prompt that will happily read a record belonging to somebody else. Most AI incidents are ordinary application security, shipped fast.",
  },
];

export default function Thermocline() {
  return (
    <section id="break" className="scroll-mt-16 py-24 md:py-32">
      {/* The boundary itself: the brightest line on the page. The spacer holds
          the vertical space; the band inside it bleeds to the full width of
          the water column. */}
      <div className="mb-20 h-24">
        <div className="bleed h-24">
          <div
            aria-hidden="true"
            className="thermocline-band absolute inset-0"
          />
          <div className="absolute inset-0 flex items-center justify-center px-margin-mobile">
            {/* Short on narrow screens, so the label never covers the line it
                is labelling. */}
            <span className="bg-sea-cold px-3 font-data text-[0.5625rem] uppercase tracking-[0.18em] text-thermocline sm:hidden">
              Thermocline · 18 M
            </span>
            <span className="hidden bg-sea-cold px-4 font-data text-[0.625rem] uppercase tracking-[0.2em] text-thermocline sm:inline">
              Thermocline · 18 M · Temperature drops 9 °C
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="max-w-[16ch] font-display text-stage uppercase text-snow">
            I already know what yours looks like
          </h2>
        </div>
        <div className="lg:col-span-7">
          <p className="max-w-measure font-body text-lede text-snow-dim">
            Six conditions, in the order they usually appear. If more than two
            of these describe your system, the diagnosis is not the hard part
            and you do not need to pay me to find out which.
          </p>
        </div>
      </div>

      {/* Observations: a log, not a card grid. */}
      <ol className="mt-16 border-t border-hairline">
        {observations.map((o) => (
          <li
            key={o.code}
            className="group grid grid-cols-1 gap-x-10 gap-y-4 border-b border-hairline py-8 transition-colors duration-200 hover:bg-sea-cold/40 md:grid-cols-12 md:py-9"
          >
            <div className="flex items-baseline gap-4 md:col-span-2 md:flex-col md:gap-2">
              <span className="font-data tabular text-[0.6875rem] tracking-[0.12em] text-thermocline">
                {o.code}
              </span>
              <span className="font-data tabular text-[0.5625rem] tracking-[0.14em] text-snow-faint">
                {o.depth} M
              </span>
            </div>

            <p className="font-display text-[1.375rem] uppercase leading-tight text-snow md:col-span-4 md:text-[1.5rem]">
              &ldquo;{o.seen}&rdquo;
            </p>

            <p className="max-w-measure font-body text-prose text-snow-dim md:col-span-6">
              {o.is}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center">
        <ScheduleCallButton
          label="Tell me which two"
          className={secondaryControl}
        >
          <ControlArrow />
        </ScheduleCallButton>
        <p className="max-w-measure font-body text-[0.875rem] text-snow-faint">
          Fifteen minutes, free. If it turns out this isn&apos;t work I should
          be doing, I will say so on the call rather than scope it.
        </p>
      </div>

      <p className="mt-10 font-data text-[0.625rem] uppercase tracking-[0.14em] text-snow-faint">
        From the depth ·{" "}
        <Link
          href={getPostPath("why-the-demo-passed-and-production-didnt")}
          className="text-thermocline transition-colors hover:text-snow"
        >
          Why the demo passed and production didn&apos;t
        </Link>
      </p>
    </section>
  );
}
