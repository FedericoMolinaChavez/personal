import HireMeButton from "./HireMeButton";
import ScheduleCallButton from "./ScheduleCallButton";

const steps = [
  {
    icon: "description",
    title: "A written build plan",
    body: "Scope, architecture, milestones, and a clear definition of done — delivered as a document you keep, whether or not we continue.",
  },
  {
    icon: "groups",
    title: "3 working sessions — or an MVP",
    body: "Three focused sessions to pressure-test the idea and shape the roadmap. Starting from scratch? I'll build you a basic MVP instead.",
  },
  {
    icon: "trending_up",
    title: "A clear path forward",
    body: "If you accept the plan, we keep building together at a full project quote or hourly rate. The $500 is your starting point, not a dead end.",
  },
];

export default function Offer() {
  return (
    <section id="offer" className="py-32 scroll-mt-24 reveal">
      <div className="flex flex-col gap-4 mb-16">
        <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
          The Engagement
        </span>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2 className="font-display text-headline-lg md:text-[48px] text-on-background max-w-2xl">
            Start with a plan, not a leap of faith.
          </h2>
          <div className="inline-flex items-baseline gap-2 self-start md:self-auto px-5 py-2 rounded-full bg-secondary-container text-on-secondary-container">
            <span className="font-display text-headline-md font-extrabold">
              $500
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest">
              to begin
            </span>
          </div>
        </div>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Before any big commitment, I map out exactly what we&apos;d build and
          how. You walk away with a concrete plan either way — and an easy way
          to keep going if it&apos;s the right fit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step) => (
          <div
            key={step.title}
            className="p-10 bg-surface-container rounded-xl flex flex-col gap-4 hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[40px] text-primary">
              {step.icon}
            </span>
            <h4 className="font-display text-headline-md">{step.title}</h4>
            <p className="text-on-surface-variant">{step.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
        <HireMeButton
          label="Book the $500 plan"
          className="bg-primary text-on-primary px-10 py-4 rounded-full font-label-md text-label-md hover:scale-95 transition-transform cursor-pointer disabled:opacity-70"
        />
        <ScheduleCallButton
          label="Talk it through first"
          className="border border-outline-variant text-on-surface px-10 py-4 rounded-full font-label-md text-label-md hover:bg-surface-container transition-colors"
        />
      </div>
    </section>
  );
}
