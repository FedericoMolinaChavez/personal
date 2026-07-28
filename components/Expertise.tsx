const items = [
  {
    icon: "account_tree",
    title: "Agent Architecture",
    body: "Multi-agent orchestration, tool use, RAG, and the context and memory handling that decides whether any of it holds up past the demo.",
  },
  {
    icon: "monitoring",
    title: "Production Reliability",
    body: "Evals, tracing, and cost control. Finding the failure modes that only show up under real traffic — and the token spend nobody is watching.",
  },
  {
    icon: "encrypted",
    title: "The App Around the Model",
    body: "Auth, route protection, secrets, and data handling. Most AI incidents aren't model problems; they're unprotected endpoints shipped at speed.",
  },
];

export default function Expertise() {
  return (
    <section id="expertise" className="py-32 scroll-mt-24 reveal">
      <div className="flex flex-col gap-4 mb-16">
        <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
          Expertise
        </span>
        <h2 className="font-display text-headline-lg md:text-[48px] text-on-background max-w-3xl">
          Narrow on purpose.
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          I don&apos;t take general full-stack work anymore. Three areas, all of
          them the same problem seen from different angles.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.title}
            className="p-10 bg-surface-container rounded-xl flex flex-col gap-4 hover:bg-surface-container-high transition-colors"
          >
            <span translate="no" className="material-symbols-outlined text-[40px] text-primary">
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
