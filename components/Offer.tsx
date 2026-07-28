import HireMeButton from "./HireMeButton";
import ScheduleCallButton from "./ScheduleCallButton";
import { paymentProcessorNotice, tradingNameNotice } from "@/lib/company";

type Tier = {
  name: string;
  price: string;
  cadence: string;
  summary: string;
  includes: string[];
  note: string;
  featured: boolean;
};

const tiers: Tier[] = [
  {
    name: "Technical Strategy Session",
    price: "$300",
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
    name: "AI Systems Architecture Audit",
    price: "$2,500",
    cadence: "Two weeks · fixed scope",
    summary:
      "A fixed-scope review of an existing AI or agent system, ending in a report you can hand to your team and act on without me.",
    includes: [
      "Architecture and orchestration review",
      "Context and memory handling, token cost breakdown",
      "Observed production failure modes",
      "Security posture of the surrounding application",
      "Written report, prioritized 90-day roadmap, walkthrough call",
    ],
    note: "No follow-on commitment required. Scoped on a call, then invoiced.",
    featured: true,
  },
  {
    name: "Fractional CTO",
    price: "$4,000",
    cadence: "Per month · cancel with 30 days",
    summary:
      "Ongoing technical leadership for teams shipping AI systems, at roughly 20 hours a month.",
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
    <section id="offer" className="py-32 scroll-mt-24 reveal">
      <div className="flex flex-col gap-4 mb-16">
        <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
          Pricing
        </span>
        <h2 className="font-display text-headline-lg md:text-[48px] text-on-background max-w-3xl">
          Fixed prices, published up front.
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          No discovery call to find out what something costs. Three ways to work
          together, priced in USD, each with a defined scope and a defined end.
          If none of them fit, tell me what you need and name your price below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`p-10 rounded-xl flex flex-col gap-6 h-full transition-colors ${
              tier.featured
                ? "bg-secondary-container text-on-secondary-container"
                : "bg-surface-container hover:bg-surface-container-high"
            }`}
          >
            <div className="flex flex-col gap-2">
              {tier.featured && (
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
                  Most common starting point
                </span>
              )}
              <h4 className="font-display text-headline-md">{tier.name}</h4>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-headline-lg font-extrabold">
                  {tier.price}
                </span>
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                {tier.cadence}
              </span>
            </div>

            <p className="text-on-surface-variant">{tier.summary}</p>

            <ul className="flex flex-col gap-3">
              {tier.includes.map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <span translate="no" className="material-symbols-outlined text-[20px] text-primary shrink-0">
                    check_small
                  </span>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-col gap-3 pt-2">
              {tier.name === "Technical Strategy Session" ? (
                <HireMeButton
                  label="Book the session — $300"
                  className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-label-md text-label-md text-center hover:scale-95 transition-transform cursor-pointer disabled:opacity-70"
                />
              ) : (
                <ScheduleCallButton
                  label="Book a scoping call"
                  className="border border-outline-variant text-on-surface px-8 py-3.5 rounded-full font-label-md text-label-md text-center hover:bg-surface-container-high transition-colors"
                />
              )}
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {tier.note}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-3 max-w-2xl">
        <p className="font-body-md text-body-md text-on-surface-variant">
          The audit and the retainer are scoped on a call and invoiced
          afterwards — buying either cold, without a conversation about your
          system first, works out badly for both of us.
        </p>
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          All prices in USD. {paymentProcessorNotice} {tradingNameNotice} See
          the{" "}
          <a
            href="/terms"
            className="text-primary hover:underline underline-offset-4"
          >
            Terms of Service
          </a>{" "}
          for scope, payment and refund terms.
        </p>
      </div>
    </section>
  );
}
