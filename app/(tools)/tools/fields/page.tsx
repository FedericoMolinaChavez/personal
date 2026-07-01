import { requireTenant } from "@/lib/shared/auth/dal";
import { listFields } from "@/lib/fields/fields";
import { computeFieldMetrics } from "@/lib/fields/metrics";
import { getLatestBriefing } from "@/lib/fields/briefing";
import FieldHealthMap, {
  type FieldMapItem,
} from "@/components/fields/FieldHealthMap";
import FieldEditor from "@/components/fields/FieldEditor";
import MetricCard from "@/components/fields/MetricCard";
import BriefingPanel from "@/components/fields/BriefingPanel";
import RefreshButton from "@/components/fields/RefreshButton";
import PageHeader from "@/components/tools/PageHeader";
import EmptyState from "@/components/tools/EmptyState";

// Always render against live DB data per request (never prerender stale/empty).
export const dynamic = "force-dynamic";

export default async function FieldsPage() {
  const { tenantId } = await requireTenant();
  const [fields, metrics, briefing] = await Promise.all([
    listFields(tenantId),
    computeFieldMetrics(tenantId),
    getLatestBriefing(tenantId),
  ]);

  const healthById = new Map(metrics.map((m) => [m.fieldId, m.health]));
  const mapFields: FieldMapItem[] = fields.map((f) => ({
    id: f.id,
    name: f.name,
    geometry: f.geometry,
    health: healthById.get(f.id) ?? "unknown",
  }));

  const initialBriefing = briefing
    ? { summary: briefing.summary, briefing: briefing.metrics?.briefing ?? null }
    : null;

  return (
    <section className="space-y-10">
      <PageHeader
        eyebrow="Operations"
        title="Field Health Dashboard"
        description="Satellite NDVI, weather, and commodity prices per field — with a plain-English weekly briefing on what changed, why, and what to do."
        actions={<RefreshButton />}
      />

      {fields.length === 0 ? (
        <div className="space-y-6">
          <EmptyState
            icon="map"
            title="No fields yet"
            description="Add one — draw it on the map or paste a GeoJSON polygon — then refresh to pull its NDVI history."
          />
          <FieldEditor />
        </div>
      ) : (
        <>
          <FieldHealthMap fields={mapFields} />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-headline-md font-bold text-cmd-text">
              Fields
            </h2>
            <FieldEditor />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((m) => (
              <MetricCard key={m.fieldId} m={m} />
            ))}
          </div>

          <BriefingPanel initial={initialBriefing} />
        </>
      )}
    </section>
  );
}
