"use client";

import { useMemo, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { pillars, scoreFor, TOTAL_CHECKS } from "@/lib/scorecard";
import ScorecardEmail from "./ScorecardEmail";

export default function Scorecard() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  // Analytics fire on transitions, not on every render.
  const started = useRef(false);
  const lastBand = useRef<string | null>(null);

  const result = useMemo(() => scoreFor(checked), [checked]);
  const perPillar = useMemo(
    () => new Map(result.perPillar.map((p) => [p.id, p])),
    [result],
  );

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);

      if (!started.current) {
        started.current = true;
        track("scorecard_start");
      }

      // There is no "finished" signal on a checklist — nothing distinguishes
      // "no" from "not answered yet" — so report band changes instead.
      const band = scoreFor(next).band;
      if (band.id !== lastBand.current) {
        lastBand.current = band.id;
        track("scorecard_band", { band: band.id, score: next.size });
      }
      return next;
    });
  }

  function reset() {
    setChecked(new Set());
    lastBand.current = null;
  }

  const answered = checked.size > 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Running total. Sticks below the 5rem nav so the number stays visible
          while working down the list. */}
      <div className="sticky top-20 z-40 -mx-margin-mobile md:-mx-margin-desktop px-margin-mobile md:px-margin-desktop py-4 bg-surface/90 backdrop-blur-md border-b border-outline-variant/40">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-headline-md font-extrabold text-primary">
              {result.score}
              <span className="text-on-surface-variant">/{TOTAL_CHECKS}</span>
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
              {answered ? result.band.name : "Nothing checked yet"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="h-2 w-32 sm:w-48 rounded-full bg-surface-container-high overflow-hidden"
              role="progressbar"
              aria-valuenow={result.score}
              aria-valuemin={0}
              aria-valuemax={TOTAL_CHECKS}
              aria-label="Checks passed"
            >
              <div
                className="h-full bg-primary transition-[width] duration-300"
                style={{ width: `${result.pct}%` }}
              />
            </div>
            {answered && (
              <button
                type="button"
                onClick={reset}
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {pillars.map((pillar) => {
          const score = perPillar.get(pillar.id);
          return (
            <fieldset
              key={pillar.id}
              className="bg-surface-container rounded-xl p-8 md:p-10 flex flex-col gap-6"
            >
              <legend className="contents">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        translate="no"
                        className="material-symbols-outlined text-[28px] text-primary shrink-0"
                      >
                        {pillar.icon}
                      </span>
                      <h3 className="font-display text-headline-md text-on-background">
                        {pillar.name}
                      </h3>
                    </div>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant whitespace-nowrap pt-2">
                      {score?.score ?? 0}/{pillar.checks.length}
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                    {pillar.surface}
                  </p>
                </div>
              </legend>

              <ul className="flex flex-col gap-1">
                {pillar.checks.map((check) => (
                  <li key={check.id}>
                    <label className="flex gap-4 items-start cursor-pointer rounded-lg -mx-3 px-3 py-3 hover:bg-surface-container-high transition-colors">
                      <input
                        type="checkbox"
                        checked={checked.has(check.id)}
                        onChange={() => toggle(check.id)}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-primary cursor-pointer"
                      />
                      <span className="font-body-md text-body-md text-on-surface-variant">
                        {check.label}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
          );
        })}
      </div>

      {/* Verdict. Rendered only once something is checked — a 0/30 verdict on
          arrival would just be noise. */}
      {answered && (
        <div className="flex flex-col gap-6" aria-live="polite">
          <div className="bg-secondary-container text-on-secondary-container rounded-3xl p-8 md:p-12 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
                Your result
              </span>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 className="font-display text-headline-lg md:text-[48px] font-extrabold">
                  {result.score}/{TOTAL_CHECKS}
                </h2>
                <span className="font-display text-headline-md">
                  {result.pct}% — {result.band.name}
                </span>
              </div>
            </div>

            <p className="font-body-lg text-body-lg max-w-2xl">
              {result.band.verdict}
            </p>

            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {result.perPillar.map((pillar) => (
                <div key={pillar.id} className="flex flex-col gap-1">
                  <dt className="font-label-sm text-label-sm uppercase tracking-widest opacity-70">
                    {pillar.name}
                  </dt>
                  <dd className="font-display text-headline-md font-extrabold">
                    {pillar.score}/{pillar.total}
                  </dd>
                </div>
              ))}
            </dl>

            {result.weakest.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-on-secondary-container/20 pt-6">
                <p className="font-body-md text-body-md">
                  <strong>Start here:</strong>{" "}
                  {result.weakest.map((p) => p.name).join(", ")}.
                </p>
                <p className="font-body-md text-body-md opacity-80 max-w-2xl">
                  A pillar at zero matters more than the total does. An even
                  spread degrades under load; a pillar with nothing in it is a
                  single incident waiting for the traffic to arrive.
                </p>
              </div>
            )}
          </div>

          <ScorecardEmail checked={[...checked]} />
        </div>
      )}
    </div>
  );
}
