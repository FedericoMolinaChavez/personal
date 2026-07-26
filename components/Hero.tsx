export default function Hero() {
  return (
    <section className="py-24 md:py-32 flex flex-col items-start gap-8 reveal">
      <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-widest">
        <span className="material-symbols-outlined text-[14px]">bolt</span>
        Available for new projects
      </div>
      <h1 className="font-display text-[56px] md:text-[84px] leading-[1.1] text-on-background max-w-4xl tracking-tighter">
        I turn your idea into a{" "}
        <span className="text-primary italic">product</span> your users pay for.
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
        Tech strategist and AI-focused developer. I help AI-focused B2B SaaS
        founders navigate technical complexity to scale profitable products.
      </p>
      <div className="flex flex-wrap gap-8 md:gap-12">
        <div className="flex flex-col gap-1">
          <span className="font-display text-headline-lg md:text-[40px] text-primary font-extrabold">
            ~500K
          </span>
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant max-w-[16ch]">
            leads attributed / month via Attribute.ai
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-display text-headline-lg md:text-[40px] text-primary font-extrabold">
            5
          </span>
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant max-w-[18ch]">
            products shipped across fintech, legal tech &amp; AI marketing
          </span>
        </div>
      </div>
    </section>
  );
}
