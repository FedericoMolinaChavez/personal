import { Relay, Gauge, Hull } from "./dive/Icon";
import { BlackCoral, GlassSponge } from "./dive/Specimen";

/**
 * 30 REEF LEDGE — structure, surge, life.
 *
 * The scope of the practice. Deliberately not three identical icon cards: the
 * ledge is asymmetric, each observation carries its own measured conditions,
 * and the specimens are drawn rather than borrowed.
 */
const zones = [
  {
    n: "01",
    band: "30–38 M",
    title: "Agent architecture",
    Icon: Relay,
    body: "Multi-agent orchestration, tool use, retrieval, and the context and memory handling that decides whether any of it survives past the demo. Where the routing lives, who holds state, and what makes the system stop.",
    facts: [
      { label: "Looks at", value: "Orchestration" },
      { label: "Then", value: "Context / memory" },
      { label: "Fails as", value: "No convergence" },
    ],
    art: "coral" as const,
  },
  {
    n: "02",
    band: "38–52 M",
    title: "Production reliability",
    Icon: Gauge,
    body: "Evals, tracing and cost control. Finding the failure modes that only appear under real traffic, and the token spend nobody is watching. If you cannot measure a regression, you are shipping on hope.",
    facts: [
      { label: "Looks at", value: "Eval coverage" },
      { label: "Then", value: "Token accounting" },
      { label: "Fails as", value: "Silent drift" },
    ],
    art: "sponge" as const,
  },
  {
    n: "03",
    band: "52–60 M",
    title: "The app around the model",
    Icon: Hull,
    body: "Auth, route protection, secrets and data handling. Most AI incidents are not model problems — they are unprotected endpoints shipped at speed, and they are the ones that end up in someone else's inbox.",
    facts: [
      { label: "Looks at", value: "Route protection" },
      { label: "Then", value: "Secrets / data" },
      { label: "Fails as", value: "Disclosure" },
    ],
    art: "coral-b" as const,
  },
];

export default function Expertise() {
  return (
    <section id="expertise" className="scroll-mt-16 py-24 md:py-32">
      <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="max-w-[14ch] font-display text-stage uppercase text-snow">
            Narrow on purpose
          </h2>
        </div>
        <div className="lg:col-span-7">
          <p className="max-w-measure font-body text-lede text-snow-dim">
            I don&apos;t take general full-stack work any more. Three bands on
            one wall — the same problem seen from three depths.
          </p>
        </div>
      </div>

      <div className="mt-16 flex flex-col">
        {zones.map((z, i) => (
          <article
            key={z.title}
            className={`grid grid-cols-1 items-start gap-x-12 gap-y-6 border-t border-hairline py-12 md:grid-cols-12 md:py-14 ${
              i === zones.length - 1 ? "border-b" : ""
            }`}
          >
            {/* Measured band */}
            <div className="flex items-center gap-4 md:col-span-2 md:flex-col md:items-start md:gap-3">
              <z.Icon size={26} className="text-thermocline" />
              <div className="flex items-baseline gap-3 md:flex-col md:gap-1.5">
                <span className="font-data tabular text-[0.6875rem] tracking-[0.14em] text-snow">
                  {z.n}
                </span>
                <span className="font-data tabular whitespace-nowrap text-[0.5625rem] tracking-[0.12em] text-snow-faint">
                  {z.band}
                </span>
              </div>
            </div>

            {/* The observation */}
            <div className="md:col-span-6">
              <h3 className="font-display text-[1.75rem] uppercase leading-none text-snow md:text-[2rem]">
                {z.title}
              </h3>
              <p className="mt-5 max-w-measure font-body text-prose text-snow-dim">
                {z.body}
              </p>
            </div>

            {/* Conditions + specimen */}
            <div className="md:col-span-4">
              <div className="flex items-start gap-6">
                <dl className="flex-1 border-t border-hairline">
                  {z.facts.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-baseline justify-between gap-4 border-b border-hairline py-2.5"
                    >
                      <dt className="font-data text-[0.5625rem] uppercase tracking-[0.14em] text-snow-faint">
                        {f.label}
                      </dt>
                      <dd className="font-data text-[0.625rem] tracking-[0.06em] text-snow">
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div
                  aria-hidden="true"
                  className="w-24 shrink-0 text-thermocline-dim opacity-80"
                >
                  {z.art === "sponge" ? (
                    <GlassSponge className="w-full" />
                  ) : (
                    <BlackCoral
                      className="w-full"
                      variant={z.art === "coral-b" ? "b" : "a"}
                    />
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
