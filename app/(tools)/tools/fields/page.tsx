import { requireUser } from "@/lib/shared/auth/dal";
import Panel from "@/components/tools/Panel";

const FEATURES = [
  {
    icon: "satellite_alt",
    title: "Satellite NDVI",
    desc: "Per-field crop-health trends from Sentinel imagery, refreshed on a schedule.",
  },
  {
    icon: "rainy",
    title: "Weather",
    desc: "Historical and forecast conditions scoped to each field boundary.",
  },
  {
    icon: "trending_up",
    title: "Commodity prices",
    desc: "Track market prices for your crops alongside field performance.",
  },
];

export default async function FieldsPage() {
  await requireUser();

  return (
    <section className="space-y-10">
      <div className="flex flex-col items-center py-10 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cmd-line bg-cmd-surface glow-accent">
          <span className="material-symbols-outlined text-cmd-accent" style={{ fontSize: 30 }}>
            satellite_alt
          </span>
        </span>
        <p className="mt-6 font-mono text-label-sm uppercase tracking-[0.2em] text-cmd-amber">
          Coming soon
        </p>
        <h1 className="mt-3 font-display text-headline-lg font-extrabold text-cmd-text">
          Field Health &amp; Operations
        </h1>
        <p className="mt-3 max-w-xl text-body-lg text-cmd-muted">
          Satellite NDVI, weather, and commodity prices per field — with a weekly
          AI briefing that ties it all together.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {FEATURES.map((f) => (
          <Panel key={f.title} className="p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cmd-surface2 text-cmd-accent">
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                {f.icon}
              </span>
            </span>
            <h3 className="mt-4 font-display text-headline-md font-bold text-cmd-text">
              {f.title}
            </h3>
            <p className="mt-2 text-body-md text-cmd-muted">{f.desc}</p>
          </Panel>
        ))}
      </div>
    </section>
  );
}
