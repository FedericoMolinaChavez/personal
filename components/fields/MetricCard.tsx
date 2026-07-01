import Link from "next/link";
import type { FieldMetrics } from "@/lib/fields/schema";
import HealthBadge from "./HealthBadge";

function fmtPct(n: number | null): string {
  if (n == null) return "—";
  return `${n > 0 ? "+" : ""}${n}%`;
}

function fmt(n: number | null, suffix = ""): string {
  return n == null ? "—" : `${n}${suffix}`;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-label-sm text-cmd-muted">{label}</dt>
      <dd className="font-mono text-body-md text-cmd-text">{value}</dd>
    </div>
  );
}

export default function MetricCard({ m }: { m: FieldMetrics }) {
  return (
    <Link
      href={`/tools/fields/${m.fieldId}`}
      className="block rounded-xl border border-cmd-line bg-cmd-surface p-5 transition-all hover:border-cmd-accent/50 hover:glow-accent"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-body-md font-medium text-cmd-text">
            {m.name}
          </p>
          {m.crop && <p className="text-label-sm text-cmd-muted">{m.crop}</p>}
        </div>
        <HealthBadge health={m.health} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
        <Stat label="NDVI" value={fmt(m.ndvi.latest)} />
        <Stat label="Change" value={fmtPct(m.ndvi.changePct)} />
        <Stat
          label="Coverage"
          value={
            m.ndvi.validCoverage == null
              ? "—"
              : `${Math.round(m.ndvi.validCoverage * 100)}%`
          }
        />
        <Stat label="Rain 7d" value={fmt(m.weather.precipMm7d, " mm")} />
        {m.price.commodity && (
          <>
            <Stat
              label={`${m.price.commodity}`}
              value={m.price.latest == null ? "—" : `$${m.price.latest}`}
            />
            <Stat label="Price chg" value={fmtPct(m.price.changePct)} />
          </>
        )}
      </dl>
    </Link>
  );
}
