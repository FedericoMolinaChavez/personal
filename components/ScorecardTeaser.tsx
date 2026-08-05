import Link from "next/link";
import { pillars, TOTAL_CHECKS } from "@/lib/scorecard";

export default function ScorecardTeaser() {
  return (
    <section id="scorecard" className="py-32 scroll-mt-24 reveal">
      <div className="bg-secondary-container text-on-secondary-container rounded-3xl p-10 md:p-16 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
            Free diagnostic
          </span>
          <h2 className="font-display text-headline-lg md:text-[48px] max-w-3xl">
            Is your AI app production ready? Score it in 10 minutes.
          </h2>
          <p className="font-body-lg text-body-lg max-w-2xl">
            Anything built fast — with Cursor, v0, Replit, Lovable, Bolt, or by
            hand — optimises for &ldquo;it ran once and looked right.&rdquo;{" "}
            {TOTAL_CHECKS} yes/no checks across six dimensions, tallied as you
            go. No email required to see your score.
          </p>
        </div>

        <ul className="flex flex-wrap gap-3">
          {pillars.map((pillar) => (
            <li
              key={pillar.id}
              className="flex items-center gap-2 bg-surface-container-lowest/60 rounded-full px-4 py-2"
            >
              <span
                translate="no"
                className="material-symbols-outlined text-[18px] text-primary"
              >
                {pillar.icon}
              </span>
              <span className="font-label-sm text-label-sm">{pillar.name}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Link
            href="/scorecard"
            className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-label-md text-label-md text-center hover:scale-95 transition-transform"
          >
            Score my app
          </Link>
          <span className="font-label-sm text-label-sm opacity-80">
            Ungated. The same checklist I run in a paid audit.
          </span>
        </div>
      </div>
    </section>
  );
}
