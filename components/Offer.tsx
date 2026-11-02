import HireMeButton from "./HireMeButton";
import ScheduleCallButton from "./ScheduleCallButton";
import { getBuildPlanOffer } from "@/lib/marketing/offers";

export default function Offer() {
  const offer = getBuildPlanOffer();
  return (
    <section id="offer" className="py-20 md:py-28 scroll-mt-24 border-t border-outline-variant">
      <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20">
        <div>
          <h2 className="font-display text-4xl md:text-5xl mb-6">Start with a plan you can keep.</h2>
          <p className="text-body-lg text-on-surface-variant max-w-xl">A focused starting engagement to turn an idea into a written build plan: scope, architecture, milestones and a definition of done.</p>
          <p className="font-display text-4xl text-primary mt-8">{offer.formattedPrice} <span className="text-base font-normal text-on-surface-variant">USD to begin</span></p>
          <div className="mt-8 flex flex-col items-start gap-4">
            <HireMeButton label={`Start the ${offer.formattedPrice} build plan`} className="button-primary" />
            <ScheduleCallButton href="#booking" service="build-plan" label="Agree the scope on a free call first" className="text-primary underline underline-offset-4 py-2" />
          </div>
        </div>
        <div className="space-y-7">
          <div><h3 className="font-display text-2xl mb-2">A written plan + working time</h3><p className="text-on-surface-variant">Three working sessions to shape the roadmap, or a basic MVP if you&apos;re starting from scratch. We agree the option and its boundaries before work begins.</p></div>
          <div><h3 className="font-display text-2xl mb-2">A defined starting point</h3><p className="text-on-surface-variant">We agree session length, delivery dates, MVP features and exclusions together. A basic MVP is a limited first version; ongoing development, hosting and third-party services need a separate scope.</p></div>
          <div><h3 className="font-display text-2xl mb-2">Your next step stays open</h3><p className="text-on-surface-variant">Keep the plan whether or not we continue. If we move into a larger project, this payment is credited toward that engagement. Further work is quoted separately.</p></div>
        </div>
      </div>
    </section>
  );
}
