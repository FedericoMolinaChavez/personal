import Link from "next/link";
import { requireTenant } from "@/lib/shared/auth/dal";
import { listDocuments } from "@/lib/agronomy/documents";
import { getAgronomyUsage } from "@/lib/agronomy/usage";
import { listSubmissions } from "@/lib/spray/records";
import PageHeader from "@/components/tools/PageHeader";
import StatTile from "@/components/tools/StatTile";

export const dynamic = "force-dynamic";

type ToolCard = {
  href: string;
  title: string;
  blurb: string;
  icon: string;
  stat: string;
  comingSoon?: boolean;
};

export default async function ToolsOverviewPage() {
  const { tenantId } = await requireTenant();

  // Live quick-stats (best-effort; empty in placeholder mode).
  const [documents, submissions, usage] = await Promise.all([
    listDocuments(tenantId).catch(() => []),
    listSubmissions(tenantId, { limit: 100 }).catch(() => []),
    getAgronomyUsage(tenantId).catch(() => null),
  ]);

  const docsReady = documents.filter((d) => d.status === "ready").length;
  const chunks = documents.reduce((n, d) => n + d.chunkCount, 0);
  const needsReview = submissions.filter((s) => s.status === "needs_review").length;
  const cost = usage ? usage.costUsd : 0;

  const tools: ToolCard[] = [
    {
      href: "/tools/agronomy",
      title: "Agronomy Assistant",
      blurb:
        "Grounded, cited answers from your own labels and guides — with a refuse-to-guess guardrail.",
      icon: "forum",
      stat: `${docsReady} docs ready · ${chunks} chunks`,
    },
    {
      href: "/tools/spray",
      title: "Spray Records",
      blurb:
        "Turn a photo or note into a structured, compliant application record — auto-checked against limits.",
      icon: "receipt_long",
      stat: `${submissions.length} submissions${needsReview ? ` · ${needsReview} to review` : ""}`,
    },
    {
      href: "/tools/fields",
      title: "Field Dashboard",
      blurb:
        "Satellite NDVI, weather, and commodity prices per field with a weekly AI briefing.",
      icon: "satellite_alt",
      stat: "Coming soon",
      comingSoon: true,
    },
  ];

  return (
    <section className="space-y-10">
      <PageHeader
        eyebrow="Control room"
        title="Overview"
        description="Your agriculture tools at a glance — knowledge base, spray compliance, and field operations."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Docs ready"
          value={docsReady}
          hint={`${chunks.toLocaleString()} embedded chunks`}
          icon="menu_book"
        />
        <StatTile
          label="Spray records"
          value={submissions.length}
          hint={needsReview ? `${needsReview} need review` : "all clear"}
          icon="receipt_long"
        />
        <StatTile
          label="LLM spend"
          value={`$${cost.toFixed(2)}`}
          hint="agronomy assistant"
          icon="paid"
        />
        <StatTile
          label="Tools live"
          value="2 / 3"
          hint="fields coming soon"
          icon="grid_view"
        />
      </div>

      <div>
        <h2 className="mb-4 font-display text-headline-md font-bold text-cmd-text">
          Tools
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group flex flex-col rounded-xl border border-cmd-line bg-cmd-surface p-6 transition-all hover:border-cmd-accent/50 hover:glow-accent"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cmd-surface2 text-cmd-accent">
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                    {t.icon}
                  </span>
                </span>
                <span className="material-symbols-outlined text-cmd-muted transition-colors group-hover:text-cmd-accent">
                  arrow_outward
                </span>
              </div>
              <h3 className="mt-4 font-display text-headline-md font-bold text-cmd-text">
                {t.title}
              </h3>
              <p className="mt-2 flex-1 text-body-md text-cmd-muted">{t.blurb}</p>
              <p
                className={`mt-4 font-mono text-label-sm ${t.comingSoon ? "text-cmd-amber" : "text-cmd-accent-dim"}`}
              >
                {t.stat}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
