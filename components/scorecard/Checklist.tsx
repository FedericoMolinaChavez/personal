import { pillars, TOTAL_CHECKS } from "@/lib/scorecard";

/**
 * Printable companion to the interactive scorecard. Renders the same pillar
 * and check copy from lib/scorecard.ts — never a parallel list that can drift.
 */
export default function Checklist() {
  return (
    <div className="checklist-body flex flex-col gap-8">
      <p className="checklist-meta font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
        {TOTAL_CHECKS} checks · {pillars.length} dimensions · tick only what is
        true today
      </p>

      <div className="flex flex-col gap-6">
        {pillars.map((pillar, pillarIndex) => (
          <section
            key={pillar.id}
            className="checklist-pillar bg-surface-container rounded-xl p-8 md:p-10 flex flex-col gap-6"
          >
            <header className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary whitespace-nowrap">
                    {String(pillarIndex + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-headline-md text-on-background">
                    {pillar.name}
                  </h2>
                </div>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant whitespace-nowrap pt-2">
                  ___/{pillar.checks.length}
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                {pillar.surface}
              </p>
            </header>

            <ul className="flex flex-col gap-1">
              {pillar.checks.map((check) => (
                <li key={check.id} className="checklist-item">
                  <label className="flex gap-4 items-start rounded-lg -mx-3 px-3 py-3">
                    <input
                      type="checkbox"
                      className="checklist-box mt-0.5 h-5 w-5 shrink-0 accent-primary"
                      aria-label={check.label}
                    />
                    <span className="font-body-md text-body-md text-on-surface-variant">
                      {check.label}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <aside className="checklist-tally border border-outline-variant/40 rounded-xl p-6 md:p-8 flex flex-col gap-4">
        <h2 className="font-display text-headline-md text-on-background">
          Tally
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Count the ticks, then enter them on the live scorecard to get the
          band and per-dimension breakdown. Bands: under 40% is demo stage;
          40–69% is fragile in production; 70%+ is production ready.
        </p>
        <p className="font-display text-headline-lg text-on-background">
          ___ / {TOTAL_CHECKS}
        </p>
      </aside>
    </div>
  );
}
