import Link from "next/link";
import { notFound } from "next/navigation";
import { requireTenant } from "@/lib/shared/auth/dal";
import { getField } from "@/lib/fields/fields";
import { getNdviSeries, getWeatherSeries } from "@/lib/fields/readings";
import { computeFieldMetrics } from "@/lib/fields/metrics";
import { getLatestBriefing } from "@/lib/fields/briefing";
import FieldHealthMap from "@/components/fields/FieldHealthMap";
import NdviChart from "@/components/fields/NdviChart";
import WeatherChart from "@/components/fields/WeatherChart";
import HealthBadge from "@/components/fields/HealthBadge";

export const dynamic = "force-dynamic";

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-cmd-line bg-cmd-surface p-4">
      <p className="font-mono text-label-sm uppercase tracking-wider text-cmd-muted">
        {label}
      </p>
      <p className="mt-1 font-mono text-headline-md font-bold text-cmd-text">
        {value}
      </p>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-cmd-line bg-cmd-surface p-6">
      <h2 className="mb-4 font-display text-headline-md font-bold text-cmd-text">
        {title}
      </h2>
      {children}
    </div>
  );
}

function fmtPct(n: number | null): string {
  if (n == null) return "—";
  return `${n > 0 ? "+" : ""}${n}%`;
}

export default async function FieldDetailPage({
  params,
}: {
  params: Promise<{ fieldId: string }>;
}) {
  const { tenantId } = await requireTenant();
  const { fieldId } = await params;

  const field = await getField(tenantId, fieldId);
  if (!field) notFound();

  const [ndvi, weather, metrics, briefing] = await Promise.all([
    getNdviSeries(tenantId, fieldId),
    getWeatherSeries(tenantId, fieldId),
    computeFieldMetrics(tenantId),
    getLatestBriefing(tenantId),
  ]);
  const m = metrics.find((x) => x.fieldId === fieldId);
  const note =
    briefing?.metrics?.briefing?.fields?.find((f) => f.name === field.name) ??
    null;

  return (
    <section className="space-y-8">
      <Link
        href="/tools/fields"
        className="inline-flex items-center gap-1 text-label-md text-cmd-muted transition-colors hover:text-cmd-accent"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          arrow_back
        </span>
        All fields
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-headline-lg font-extrabold text-cmd-text">
            {field.name}
          </h1>
          {field.crop && (
            <p className="mt-1 text-body-md text-cmd-muted">{field.crop}</p>
          )}
        </div>
        {m && <HealthBadge health={m.health} />}
      </header>

      {m && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile
            label="NDVI"
            value={m.ndvi.latest == null ? "—" : String(m.ndvi.latest)}
          />
          <StatTile label="Change" value={fmtPct(m.ndvi.changePct)} />
          <StatTile
            label="Coverage"
            value={
              m.ndvi.validCoverage == null
                ? "—"
                : `${Math.round(m.ndvi.validCoverage * 100)}%`
            }
          />
          <StatTile
            label={m.price.commodity ?? "Price"}
            value={m.price.latest == null ? "—" : `$${m.price.latest}`}
          />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <Card title="NDVI trend">
            <NdviChart points={ndvi} />
          </Card>
          <Card title="Weather — last 30 days + forecast">
            <WeatherChart points={weather} />
          </Card>
        </div>

        <div className="space-y-8">
          <Card title="Boundary">
            <FieldHealthMap
              fields={[
                {
                  id: field.id,
                  name: field.name,
                  geometry: field.geometry,
                  health: m?.health ?? "unknown",
                },
              ]}
            />
          </Card>

          {note && (
            <Card title="Briefing">
              <p className="font-mono text-label-sm uppercase tracking-wide text-cmd-muted">
                {note.status.replace("_", " ")}
              </p>
              {note.drivers.length > 0 && (
                <p className="mt-2 text-body-md text-cmd-muted">
                  {note.drivers.join(" · ")}
                </p>
              )}
              {note.actions.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {note.actions.map((a, i) => (
                    <li
                      key={i}
                      className="text-body-md text-cmd-text before:mr-2 before:text-cmd-accent before:content-['→']"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
