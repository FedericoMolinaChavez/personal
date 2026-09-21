import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HireMeButton from "@/components/HireMeButton";
import ScheduleCallButton from "@/components/ScheduleCallButton";
import Checklist from "@/components/scorecard/Checklist";
import PrintChecklistButton from "@/components/scorecard/PrintChecklistButton";
import { TOTAL_CHECKS } from "@/lib/scorecard";

const title = "AI App Production Checklist";
const description = `Printable ${TOTAL_CHECKS}-check companion to the production readiness scorecard — same six dimensions, same yes/no checks. Prep offline, then score live at /scorecard. No email gate.`;
const path = "/scorecard/checklist";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    type: "website",
    url: path,
    title,
    description,
    siteName: "Federico Molina",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

/**
 * Downloadable / printable companion to the ungated interactive scorecard.
 * Check copy is imported from lib/scorecard.ts so it cannot drift from the
 * live scorer. PDF is browser print ("Save as PDF") — no generation dependency.
 */
export default function ScorecardChecklistPage() {
  return (
    <>
      <span id="top" />
      <div className="checklist-screen-only">
        <Nav />
      </div>
      <main className="checklist-page max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <article className="py-24 max-w-4xl flex flex-col gap-16">
          <header className="flex flex-col gap-6 max-w-3xl">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
              Printable companion
            </span>
            <h1 className="font-display text-headline-lg md:text-[48px] text-on-background">
              AI app production checklist
            </h1>
            <div className="flex flex-col gap-4 font-body-lg text-body-lg text-on-surface-variant">
              <p>
                The same {TOTAL_CHECKS} yes/no checks as the live{" "}
                <Link
                  href="/scorecard"
                  className="text-primary hover:underline underline-offset-4"
                >
                  production readiness scorecard
                </Link>
                — six dimensions, no email gate. Use this page to prep offline
                or in a meeting; then tick the answers into the scorer for the
                band and per-dimension breakdown.
              </p>
              <p className="text-on-background">
                Tick only what is genuinely true today. Roadmap items do not
                count.
              </p>
            </div>

            <div className="checklist-screen-only flex flex-col sm:flex-row sm:items-start gap-4 pt-2">
              <Link
                href="/scorecard"
                className="inline-block bg-primary text-on-primary px-8 py-3.5 rounded-full font-label-md text-label-md text-center hover:scale-95 transition-transform"
              >
                Run the live scorecard
              </Link>
              <PrintChecklistButton className="border border-outline-variant text-on-surface px-8 py-3.5 rounded-full font-label-md text-label-md text-center hover:bg-surface-container-high transition-colors cursor-pointer" />
            </div>
            <p className="checklist-screen-only font-label-sm text-label-sm text-on-surface-variant">
              Print opens your browser dialog — choose &ldquo;Save as PDF&rdquo;
              if you want a file.
            </p>
          </header>

          <Checklist />

          <section className="checklist-screen-only flex flex-col gap-6 border-t border-outline-variant/40 pt-16">
            <h2 className="font-display text-headline-lg text-on-background max-w-2xl">
              Done ticking? Score it live.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              The interactive scorecard tallies the same checks, shows the band,
              and highlights the weakest dimensions. Still ungated — no email
              required to see a score.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 pt-2">
              <Link
                href="/scorecard"
                className="inline-block bg-primary text-on-primary px-8 py-3.5 rounded-full font-label-md text-label-md text-center hover:scale-95 transition-transform"
              >
                Open the scorecard
              </Link>
              <ScheduleCallButton
                label="Book a free 15-minute intake"
                href="/#booking"
                className="inline-block border border-outline-variant text-on-surface px-8 py-3.5 rounded-full font-label-md text-label-md text-center hover:bg-surface-container-high transition-colors"
              />
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              If you already know the shape of the engagement:{" "}
              <Link
                href="/#offer"
                className="text-primary hover:underline underline-offset-4"
              >
                $300 strategy session
              </Link>
              ,{" "}
              <Link
                href="/#offer"
                className="text-primary hover:underline underline-offset-4"
              >
                $2,500 architecture audit
              </Link>
              , or{" "}
              <Link
                href="/#offer"
                className="text-primary hover:underline underline-offset-4"
              >
                $4,000/mo fractional CTO
              </Link>
              .
            </p>
            <div className="pt-2">
              <HireMeButton
                label="Or book a $300 session now"
                className="border border-outline-variant text-on-surface px-8 py-3.5 rounded-full font-label-md text-label-md text-center hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-70"
              />
            </div>
          </section>
        </article>
      </main>
      <div className="checklist-screen-only">
        <Footer />
      </div>
    </>
  );
}
