import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductionScorecard from "@/components/ProductionScorecard";
import { marketingMetadata } from "@/lib/marketing/metadata";

export const metadata = marketingMetadata("AI Production Readiness Checklist", "Review 30 checks for AI reliability, quality, context, cost, operations and security. Free results with an optional review of your biggest risks.", "/scorecard");

export default function ScorecardPage() {
  return <>
    <Nav />
    <main id="main-content" className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
      <section className="py-16 md:py-24 max-w-3xl">
        <h1 className="font-display text-[44px] md:text-[64px] tracking-[-0.03em] leading-[1.1] mb-6">What have you checked before production?</h1>
        <p className="text-body-lg text-on-surface-variant">Review 30 practical checks across your AI system. Mark what you have confirmed, what needs attention and what you still need to investigate. No email required.</p>
      </section>
      <ProductionScorecard />
    </main>
    <Footer />
  </>;
}
