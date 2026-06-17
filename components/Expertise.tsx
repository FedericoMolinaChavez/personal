const items = [
  {
    icon: "integration_instructions",
    title: "LLM Engineering",
    body: "Design and implementation of systems built on large language models, RAG, and autonomous agents.",
  },
  {
    icon: "architecture",
    title: "Scalable Systems",
    body: "Cloud architectures optimized for performance, security, and — above all — long-term maintainability.",
  },
  {
    icon: "draw",
    title: "Product Design",
    body: "UX/UI with a technical lens. We don't just make something pretty — we make something that works and can be built.",
  },
];

export default function Expertise() {
  return (
    <section id="expertise" className="py-32 scroll-mt-24 reveal">
      <div className="flex flex-col gap-4 mb-16">
        <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
          Expertise
        </span>
        <h2 className="font-display text-headline-lg md:text-[48px] text-on-background">
          Where the magic happens.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.title}
            className="p-10 bg-surface-container rounded-xl flex flex-col gap-4 hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[40px] text-primary">
              {item.icon}
            </span>
            <h4 className="font-display text-headline-md">{item.title}</h4>
            <p className="text-on-surface-variant">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
