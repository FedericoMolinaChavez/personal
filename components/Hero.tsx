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
        Tech strategist and AI-focused developer. I help founders navigate
        technical complexity to scale profitable products with a craftsman&apos;s
        touch.
      </p>
    </section>
  );
}
