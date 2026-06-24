import Link from "next/link";
import { requireTenant } from "@/lib/shared/auth/dal";
import { listSubmissions } from "@/lib/spray/records";
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
    <section className="space-y-10 py-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-headline-lg font-extrabold text-on-surface">
            Spray Records
          </h1>
          <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
            Submit a photo of a paper log or a quick note. We extract a
            structured, compliant record, check it against label limits, and
            queue anything uncertain for review.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/tools/spray/review"
            className="rounded-full border border-outline-variant px-4 py-2 text-label-md font-label-md text-on-surface-variant hover:border-primary hover:text-primary"
          >
            Review queue{needsReview > 0 ? ` (${needsReview})` : ""}
          </Link>
          <a
            href="/api/spray/export"
            className="rounded-full border border-outline-variant px-4 py-2 text-label-md font-label-md text-on-surface-variant hover:border-primary hover:text-primary"
          >
            Export CSV
          </a>
        </div>
      </header>

      <IntakeForm />

      <div>
        <h2 className="mb-4 font-display text-headline-md font-bold text-on-surface">
          Recent submissions
        </h2>
        {submissions.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">
            No submissions yet — add one above.
          </p>
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
