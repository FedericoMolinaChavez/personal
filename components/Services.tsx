import Link from "next/link";

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-24 scroll-mt-24 border-t border-outline-variant">
      <h2 className="font-display text-4xl md:text-5xl max-w-2xl mb-12">The right help for where you are.</h2>
      <div className="grid md:grid-cols-2 gap-12 md:gap-16">
        <div>
          <h3 className="font-display text-3xl mb-4">Your AI system needs a closer look.</h3>
          <p className="text-on-surface-variant text-body-lg mb-6 max-w-lg">For teams with AI features in use or approaching launch. Understand reliability risks, cost drivers and architecture decisions before adding more complexity.</p>
          <Link href="/ai-systems-audit" className="text-primary font-semibold underline underline-offset-4 inline-block py-2">Explore the AI systems audit</Link>
        </div>
        <div>
          <h3 className="font-display text-3xl mb-4">Your business needs technical leadership.</h3>
          <p className="text-on-surface-variant text-body-lg mb-6 max-w-lg">For founders deciding what to build, how to build it and who should deliver it. Get a technical partner who connects the roadmap to your business priorities.</p>
          <Link href="/fractional-cto" className="text-primary font-semibold underline underline-offset-4 inline-block py-2">Explore fractional CTO support</Link>
        </div>
      </div>
      <p className="mt-12 text-on-surface-variant">Prefer to start with your own review? <Link href="/scorecard" className="text-primary underline underline-offset-4">Use the free AI production checklist.</Link></p>
    </section>
  );
}
