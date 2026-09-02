import Link from "next/link";
import { pillars, TOTAL_CHECKS } from "@/lib/scorecard";
import { ControlArrow, primaryControl } from "./dive/Instrument";

/**
 * 36 ASCENT STOP 1 — score your own app.
 *
 * A safety stop is mandatory and free. So is this: the same checklist that
 * runs inside a paid audit, ungated, with no email required to see a score.
 */
export default function ScorecardTeaser() {
  return (
    <section id="scorecard" className="scroll-mt-16 py-24 md:py-32">
      <div className="module">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline px-6 py-3.5">
          <span className="font-data text-[0.5625rem] uppercase tracking-[0.16em] text-thermocline">
            Ascent stop · 36 M · Hold 3 min
          </span>
          <span className="font-data tabular text-[0.5625rem] uppercase tracking-[0.14em] text-snow-faint">
            {TOTAL_CHECKS} checks · {pillars.length} dimensions
          </span>
        </div>

        <div className="grid grid-cols-1 gap-x-14 gap-y-10 px-6 py-12 md:px-10 md:py-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="max-w-[18ch] font-display text-stage uppercase text-snow">
              Score your app before I do
            </h2>
            <p className="mt-6 max-w-measure font-body text-lede text-snow-dim">
              Anything built fast — with Cursor, v0, Replit, Lovable, Bolt, or
              by hand — optimises for &ldquo;it ran once and looked
              right.&rdquo; {TOTAL_CHECKS} yes/no checks across{" "}
              {pillars.length} dimensions, tallied as you go.
            </p>
            <p className="mt-4 font-body text-[0.875rem] text-snow-faint">
              Ungated, and no email required to see your score. It is the same
              checklist I run inside a paid audit.
            </p>

            <div className="mt-9">
              <Link href="/scorecard" className={primaryControl}>
                <span>Score my app</span>
                <ControlArrow />
              </Link>
            </div>
          </div>

          {/* The six dimensions as a gauge list, not a pill cloud. */}
          <div className="lg:col-span-5">
            <ol className="border-t border-hairline">
              {pillars.map((pillar, i) => (
                <li
                  key={pillar.id}
                  className="flex items-center justify-between gap-4 border-b border-hairline py-3"
                >
                  <span className="flex items-center gap-3.5">
                    <span className="font-data tabular text-[0.5625rem] tracking-[0.12em] text-thermocline">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-body text-[0.875rem] text-snow">
                      {pillar.name}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 bg-hairline"
                  />
                  <span className="font-data text-[0.5625rem] uppercase tracking-[0.14em] text-snow-faint">
                    Unscored
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
