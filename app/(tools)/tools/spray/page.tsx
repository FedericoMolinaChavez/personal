import Link from "next/link";
import { requireTenant } from "@/lib/shared/auth/dal";
import { listSubmissions } from "@/lib/spray/records";
import PageHeader from "@/components/tools/PageHeader";
import EmptyState from "@/components/tools/EmptyState";
import { buttonClasses } from "@/components/tools/Button";
import IntakeForm from "@/components/spray/IntakeForm";
import SubmissionCard from "@/components/spray/SubmissionCard";

// Always render against live DB data per request (never prerender stale/empty).
export const dynamic = "force-dynamic";

export default async function SprayPage() {
  const { tenantId } = await requireTenant();
  const submissions = await listSubmissions(tenantId, { limit: 10 });
  const needsReview = submissions.filter(
    (s) => s.status === "needs_review",
  ).length;

  return (
    <section className="space-y-10">
      <PageHeader
        eyebrow="Compliance"
        title="Spray Records"
        description="Submit a photo of a paper log or a quick note. We extract a structured, compliant record, check it against label limits, and queue anything uncertain for review."
        actions={
          <>
            <Link href="/tools/spray/review" className={buttonClasses("ghost")}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                fact_check
              </span>
              Review queue{needsReview > 0 ? ` (${needsReview})` : ""}
            </Link>
            <a href="/api/spray/export" className={buttonClasses("ghost")}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                download
              </span>
              Export CSV
            </a>
          </>
        }
      />

      <IntakeForm />

      <div>
        <h2 className="mb-4 font-display text-headline-md font-bold text-cmd-text">
          Recent submissions
        </h2>
        {submissions.length === 0 ? (
          <EmptyState
            icon="receipt_long"
            title="No submissions yet"
            description="Add a note or photo of a spray log above to create your first record."
          />
        ) : (
          <ul className="space-y-3">
            {submissions.map((s) => (
              <li key={s.id}>
                <SubmissionCard submission={s} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
