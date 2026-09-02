import HireMeButton from "./HireMeButton";
import ScheduleCallButton from "./ScheduleCallButton";
import { Check } from "./dive/Icon";
import {
  ControlArrow,
  primaryControl,
  secondaryControl,
} from "./dive/Instrument";
import { paymentProcessorNotice, tradingNameNotice } from "@/lib/company";

/**
 * 60 TURNAROUND — maximum depth. Gas is finite, so this is where you decide.
 *
 * Prices are published because publishing them is the position: no discovery
 * call to find out what something costs.
 */
type Tier = {
  name: string;
  price: string;
  unit: string;
  cadence: string;
  summary: string;
  includes: string[];
  note: string;
  featured: boolean;
};

const tiers: Tier[] = [
  {
    name: "Technical strategy session",
    price: "300",
    unit: "USD",
    cadence: "90 minutes · one-time",
    summary:
      "One focused working session on a single technical decision: architecture, stack selection, agent design, or a system that isn't behaving in production.",
    includes: [
      "90-minute working session",
      "Written summary with concrete recommendations within 48 hours",
      "Credited in full against any engagement booked within 30 days",
    ],
    note: "Book and pay now — no call required first.",
    featured: false,
  },
  {
    name: "AI systems architecture audit",
    price: "2,500",
    unit: "USD",
    cadence: "Two weeks · fixed scope",
    summary:
      "A fixed-scope review of an existing AI or agent system, ending in a report you can hand to your team and act on without me.",
    includes: [
      "Architecture and orchestration review",
      "Context and memory handling, token cost breakdown",
      "Observed production failure modes",
      "Security posture of the surrounding application",
      "Written report, prioritised 90-day roadmap, walkthrough call",
    ],
    note: "No follow-on commitment. Scoped on a call, then invoiced.",
    featured: true,
  },
  {
    name: "Fractional CTO",
    price: "4,000",
    unit: "USD / MO",
    cadence: "≈20 hours · cancel with 30 days",
    summary:
      "Ongoing technical leadership for teams shipping AI systems, at roughly twenty hours a month.",
    includes: [
      "Architecture decisions and technical direction",
      "Code and PR review",
      "Vendor and hiring evaluation",
      "Hands-on implementation where that's faster than delegating",
    ],
    note: "Starts after a scoping call.",
    featured: false,
  },
];

export default function Offer() {
  return (
    <section id="offer" className="scroll-mt-16 py-24 md:py-32">
      <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="max-w-[14ch] font-display text-stage uppercase text-snow">
            Turnaround depth
          </h2>
        </div>
        <div className="lg:col-span-7">
          <p className="max-w-measure font-body text-lede text-snow-dim">
            Three ways to work together, priced in USD, each with a defined
            scope and a defined end. No discovery call to find out what
            something costs — that is the whole point of putting the numbers
            here.
          </p>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
        {tiers.map((tier) => (
          <article
            key={tier.name}
            className={`module flex flex-col ${tier.featured ? "module-lit" : ""}`}
          >
            <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-3">
              <span className="font-data text-[0.5625rem] uppercase tracking-[0.14em] text-snow-faint">
                {tier.cadence}
              </span>
              {tier.featured && (
                <span className="font-data text-[0.5625rem] uppercase tracking-[0.14em] text-thermocline">
                  Most common
                </span>
              )}
            </div>

            <div className="px-5 pb-6 pt-6">
              <h3 className="font-display text-[1.375rem] uppercase leading-tight text-snow">
                {tier.name}
              </h3>

              {/* The number at readout scale — this world's loudest element. */}
              <p className="mt-5 flex items-baseline gap-2">
                <span className="font-data tabular text-[2.5rem] leading-none tracking-[-0.04em] text-thermocline">
                  <span className="text-[0.5em] align-baseline">$</span>
                  {tier.price}
                </span>
                <span className="font-data text-[0.5625rem] uppercase tracking-[0.14em] text-snow-faint">
                  {tier.unit}
                </span>
              </p>

              <p className="mt-5 font-body text-[0.9375rem] leading-relaxed text-snow-dim">
                {tier.summary}
              </p>

              <ul className="mt-6 flex flex-col gap-3">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check
                      size={15}
                      className="mt-1 shrink-0 text-thermocline"
                    />
                    <span className="font-body text-[0.875rem] leading-relaxed text-snow-dim">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto flex flex-col gap-3 border-t border-hairline px-5 py-5">
              {tier.price === "300" ? (
                <HireMeButton
                  label="Buy the session"
                  className={`${primaryControl} w-full`}
                  disclosure={false}
                >
                  <ControlArrow />
                </HireMeButton>
              ) : (
                <ScheduleCallButton
                  label="Book a scoping call"
                  className={`${secondaryControl} w-full`}
                >
                  <ControlArrow />
                </ScheduleCallButton>
              )}
              <span className="font-body text-[0.75rem] leading-relaxed text-snow-faint">
                {tier.note}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 flex max-w-measure flex-col gap-3">
        <p className="font-body text-[0.875rem] leading-relaxed text-snow-dim">
          The audit and the retainer are scoped on a call and invoiced
          afterwards — buying either cold, without a conversation about your
          system first, works out badly for both of us.
        </p>
        <p className="font-data text-[0.625rem] leading-relaxed tracking-[0.06em] text-snow-faint">
          All prices in USD. {paymentProcessorNotice} {tradingNameNotice} See
          the{" "}
          <a
            href="/terms"
            className="text-thermocline underline decoration-thermocline/40 hover:decoration-thermocline"
          >
            Terms of Service
          </a>{" "}
          for scope, payment and refund terms.
        </p>
      </div>
    </section>
  );
}
