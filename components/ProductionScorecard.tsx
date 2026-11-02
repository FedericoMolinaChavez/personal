"use client";

import { useState } from "react";
import Link from "next/link";
import { scorecardGroups, summarizeScorecard, type CheckAnswer } from "@/lib/marketing/scorecard";

export default function ProductionScorecard() {
  const [answers, setAnswers] = useState<Record<string, CheckAnswer>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const result = summarizeScorecard(answers);
  const selectedGaps = result.gaps.filter((gap) => selected.includes(gap.id));
  const emailBody = `I'd like to discuss these AI production risks:\n\n${selectedGaps.map((gap) => `- ${gap.text}`).join("\n")}\n\nSystem context:\n`;

  return (
    <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-16 pb-20 items-start">
      <div className="border-t border-outline-variant">
        {scorecardGroups.map((group, groupIndex) => (
          <details key={group.title} open={groupIndex === 0} className="border-b border-outline-variant py-5">
            <summary className="font-display text-2xl py-2">{group.title}</summary>
            <div className="pt-4 space-y-6">
              {group.checks.map((text, checkIndex) => {
                const id = `${groupIndex}-${checkIndex}`;
                return <fieldset key={id} className="pb-5 border-b last:border-0 border-outline-variant">
                  <legend className="mb-3 text-on-surface-variant">{text}</legend>
                  <div className="flex flex-wrap gap-2">
                    {([['yes', 'Confirmed'], ['no', 'Needs attention'], ['unknown', 'Not sure']] as const).map(([value, label]) => <label key={value} className="flex items-center gap-2 min-h-11 rounded-full border border-outline-variant px-3 cursor-pointer has-[:checked]:bg-secondary-container">
                      <input type="radio" name={`check-${id}`} value={value} checked={(answers[id] || "unknown") === value} onChange={() => {
                        setAnswers((current) => ({ ...current, [id]: value }));
                        if (value !== "no") setSelected((current) => current.filter((item) => item !== id));
                      }} className="accent-primary" />
                      <span className="text-sm">{label}</span>
                    </label>)}
                  </div>
                </fieldset>;
              })}
            </div>
          </details>
        ))}
      </div>
      <aside id="scorecard-results" className="bg-surface-container rounded-xl p-6 md:p-8 lg:sticky lg:top-28 scroll-mt-28">
        <h2 className="font-display text-3xl mb-5">Your review so far.</h2>
        <div role="status" aria-live="polite" aria-atomic="true" className="space-y-2 text-on-surface-variant">
          <p><strong className="text-on-surface">{result.confirmed} of {result.total}</strong> checks confirmed</p>
          <p>{result.gaps.length} need attention · {result.unknown} not yet confirmed</p>
        </div>
        <p className="text-sm text-on-surface-variant mt-4">This is a self-assessment checklist, not a validated readiness score, security audit or certification. Answers stay in this page and reset on reload.</p>
        <h3 className="font-display text-2xl mt-8 mb-3">Want me to review your three biggest risks?</h3>
        {result.gaps.length ? <>
          <p className="text-on-surface-variant text-sm mb-4">Choose up to three items to include in an optional email. Your results remain free.</p>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {result.gaps.map((gap) => <label key={gap.id} className="flex items-start gap-3 py-2 text-sm text-on-surface-variant">
              <input type="checkbox" checked={selected.includes(gap.id)} disabled={!selected.includes(gap.id) && selected.length >= 3} onChange={(event) => setSelected((current) => event.target.checked ? [...current, gap.id] : current.filter((id) => id !== gap.id))} className="mt-1 h-4 w-4 accent-primary" />
              {gap.text}
            </label>)}
          </div>
          {selectedGaps.length > 0 && <a href={`mailto:federicomolinachavez@gmail.com?subject=${encodeURIComponent("Review my AI production risks")}&body=${encodeURIComponent(emailBody)}`} className="button-primary mt-6">Email my selected risks</a>}
        </> : <p className="text-sm text-on-surface-variant">Mark a check as needing attention to include it in a review request.</p>}
        <Link href="/ai-systems-audit" className="block text-primary underline underline-offset-4 py-3 mt-3">Explore the AI systems audit</Link>
        <button type="button" className="text-sm underline underline-offset-4 py-3 text-on-surface-variant" onClick={() => { setAnswers({}); setSelected([]); }}>Reset my answers</button>
      </aside>
    </div>
  );
}
