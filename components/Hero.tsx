import HireMeButton from "./HireMeButton";
import ScheduleCallButton from "./ScheduleCallButton";

export default function Hero() {
  return (
    <section className="py-24 md:py-32 flex flex-col items-start gap-8 reveal">
      <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-widest">
        <span className="material-symbols-outlined text-[14px]">bolt</span>
        Available for new projects
      </div>
      <h1 className="font-display text-[56px] md:text-[84px] leading-[1.1] text-on-background max-w-4xl tracking-tighter">
        Your agents work in the demo and{" "}
        <span className="text-primary italic">break in production</span>.
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
        I&apos;m Federico — fractional CTO and AI systems architect. I work on
        one thing: LLM and agent systems that shipped fast and now can&apos;t be
        trusted. Orchestration, context and memory, token cost, the failure
        modes that only appear under real traffic, and the security of the app
        around them.
      </p>
      <div className="flex flex-wrap gap-4">
        <HireMeButton
          label="Book a $300 strategy session"
          className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-label-md text-label-md hover:scale-95 transition-transform cursor-pointer disabled:opacity-70"
        />
        <ScheduleCallButton
          label="Or book a free 15-min call"
          className="border border-outline-variant text-on-surface px-8 py-3.5 rounded-full font-label-md text-label-md hover:bg-surface-container transition-colors"
        />
      </div>
      <div className="flex flex-wrap gap-8 md:gap-12 mt-4">
        <div className="flex flex-col gap-1">
          <span className="font-display text-headline-lg md:text-[40px] text-primary font-extrabold">
            ~500K
          </span>
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant max-w-[16ch]">
            leads attributed / month via Attribute.ai
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-display text-headline-lg md:text-[40px] text-primary font-extrabold">
            5
          </span>
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant max-w-[18ch]">
            products shipped across fintech, legal tech &amp; AI marketing
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-display text-headline-lg md:text-[40px] text-primary font-extrabold">
            8
          </span>
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant max-w-[18ch]">
            years building and running production systems
          </span>
        </div>
      </div>
    </section>
  );
}
