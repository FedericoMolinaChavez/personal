import Link from "next/link";
import { requireTenant } from "@/lib/shared/auth/dal";
import { getAgronomyUsage } from "@/lib/agronomy/usage";
import PageHeader from "@/components/tools/PageHeader";
import StatTile from "@/components/tools/StatTile";
import EmptyState from "@/components/tools/EmptyState";
import { buttonClasses } from "@/components/tools/Button";

export const dynamic = "force-dynamic";

export default async function AgronomyUsagePage() {
  const { tenantId } = await requireTenant();
  const usage = await getAgronomyUsage(tenantId);

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Observability"
        title="Usage & Cost"
        description="LLM calls for the agronomy assistant — embeddings, re-ranking, and answer generation — from public.llm_logs."
        actions={
          <Link href="/tools/agronomy" className={buttonClasses("ghost")}>
            Back to library
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="LLM calls" value={usage.totalCalls.toLocaleString()} icon="bolt" />
        <StatTile
          label="Tokens (in / out)"
          value={`${usage.promptTokens.toLocaleString()} / ${usage.completionTokens.toLocaleString()}`}
          icon="data_usage"
        />
        <StatTile label="Est. cost" value={`$${usage.costUsd.toFixed(4)}`} icon="paid" />
        <StatTile
          label="Avg latency"
          value={usage.avgLatencyMs != null ? `${usage.avgLatencyMs} ms` : "—"}
          icon="timer"
        />
      </div>

      <div>
        <h2 className="mb-4 font-display text-headline-md font-bold text-cmd-text">
          Recent calls
        </h2>
        {usage.recent.length === 0 ? (
          <EmptyState
            icon="query_stats"
            title="No usage logged yet"
            description="Ingest a document or ask a question and calls will appear here."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-cmd-line">
            <table className="w-full text-left font-mono text-label-md">
              <thead className="bg-cmd-surface2 text-label-sm uppercase tracking-wider text-cmd-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">When</th>
                  <th className="px-4 py-3 font-medium">Model</th>
                  <th className="px-4 py-3 font-medium text-right">In</th>
                  <th className="px-4 py-3 font-medium text-right">Out</th>
                  <th className="px-4 py-3 font-medium text-right">Cost</th>
                  <th className="px-4 py-3 font-medium text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="text-cmd-muted">
                {usage.recent.map((r, i) => (
                  <tr key={i} className="border-t border-cmd-line bg-cmd-surface">
                    <td className="px-4 py-2.5">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-cmd-text">{r.model ?? "—"}</td>
                    <td className="px-4 py-2.5 text-right">
                      {r.promptTokens.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {r.completionTokens.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right text-cmd-accent">
                      ${r.costUsd.toFixed(4)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {r.latencyMs != null ? `${r.latencyMs} ms` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
