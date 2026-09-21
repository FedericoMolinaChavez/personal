import MaterialSymbols from "@/components/MaterialSymbols";
import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HireMeButton from "@/components/HireMeButton";
import ScheduleCallButton from "@/components/ScheduleCallButton";
import Scorecard from "@/components/scorecard/Scorecard";
import { TOTAL_CHECKS } from "@/lib/scorecard";

export const metadata: Metadata = {
  title: "Is Your AI App Production Ready?",
  description: `A ${TOTAL_CHECKS}-point diagnostic across security, data contracts, prompt injection, rate limiting, tokenomics and scaling. Score it in 10 minutes. No email required.`,
  alternates: { canonical: "/scorecard" },
};

// This page inherits the dive palette through the remapped legacy tokens in
// tailwind.config.ts; the landing page owns the full Mesophotic Descent world.

export default function ScorecardPage() {
  return (
    <>
      <MaterialSymbols />
      <span id="top" />
      <Nav />
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <article className="py-24 max-w-4xl flex flex-col gap-16">
          <header className="flex flex-col gap-6 max-w-3xl">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
              Free diagnostic
            </span>
            <h1 className="font-display text-headline-lg md:text-[48px] text-on-background">
              Is your AI app production ready?
            </h1>
            <div className="flex flex-col gap-4 font-body-lg text-body-lg text-on-surface-variant">
              <p>
                Tools that build fast optimise for one thing: it ran once and it
                looked right. That is a real milestone and it is not the same as
                being ready for real traffic, real users, and someone who is
                actively trying to make your system do something it
                shouldn&apos;t.
              </p>
              <p>
                The gap is specific, not vague. A support bot that reads a
                customer&apos;s email and can also call tools will do what that
                email tells it to, if nothing structurally stops it. An agent
                that retries on failure and re-sends its full history each time
                can burn a month of token budget in an afternoon without a
                single error being logged. Neither of these shows up in a demo.
                Both show up in week one.
              </p>
              <p className="text-on-background">
                Production readiness is measurable across six dimensions. Most
                fast-built apps score well on &ldquo;it works&rdquo; and near
                zero on several of the rest. Below are {TOTAL_CHECKS} yes/no
                checks. Tick what is genuinely true today — not what is on the
                roadmap.
              </p>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Prefer paper first?{" "}
              <Link
                href="/scorecard/checklist"
                className="text-primary hover:underline underline-offset-4"
              >
                Printable checklist
              </Link>{" "}
              — same {TOTAL_CHECKS} checks, then come back here to score.
            </p>
          </header>

          <Scorecard />

          <section className="flex flex-col gap-6 border-t border-outline-variant/40 pt-16">
            <h2 className="font-display text-headline-lg text-on-background max-w-2xl">
              Most of this stays invisible until it fails.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              That is exactly why it gets skipped under time pressure — nothing
              on this list makes the demo better, and every item on it costs a
              day you don&apos;t have. It only becomes urgent at the point where
              it is also expensive.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              I do this work for a living: agent architecture, production
              reliability, and the app around the model. If you want the same
              checklist run against your actual codebase rather than from
              memory, that is the audit — a written report and a prioritised
              roadmap you can hand to your team.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 pt-2">
              <ScheduleCallButton
                label="Book a scoping call"
                href="/#booking"
                className="inline-block bg-primary text-on-primary px-8 py-3.5 rounded-full font-label-md text-label-md text-center hover:scale-95 transition-transform"
              />
              <HireMeButton
                label="Or book a $300 session now"
                className="border border-outline-variant text-on-surface px-8 py-3.5 rounded-full font-label-md text-label-md text-center hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-70"
              />
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Pricing for both is published on the{" "}
              <Link
                href="/#offer"
                className="text-primary hover:underline underline-offset-4"
              >
                home page
              </Link>
              .
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
