import Link from "next/link";
import { requireTenant } from "@/lib/shared/auth/dal";
import { listSubmissions } from "@/lib/spray/records";
import { signedPhotoUrl } from "@/lib/spray/storage";
import ReviewItem from "@/components/spray/ReviewItem";

// Always render against live DB data per request (signed URLs must be fresh).
export const dynamic = "force-dynamic";

export default async function SprayReviewPage() {
  const { tenantId } = await requireTenant();
  const queue = await listSubmissions(tenantId, {
    status: "needs_review",
    limit: 50,
  });
  const items = await Promise.all(
    queue.map(async (submission) => ({
      submission,
      photoUrl: submission.photoPath
        ? await signedPhotoUrl(submission.photoPath)
        : null,
    })),
  );

  return (
    <section className="space-y-8 py-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-headline-lg font-extrabold text-on-surface">
            Review Queue
          </h1>
          <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
            Submissions that were low-confidence or out-of-range. Confirm the
            parsed record against the original, then approve or reject.
          </p>
        </div>
        <Link
          href="/tools/spray"
          className="shrink-0 rounded-full border border-outline-variant px-4 py-2 text-label-md font-label-md text-on-surface-variant hover:border-primary hover:text-primary"
        >
          ← Back to intake
        </Link>
      </header>

      {items.length === 0 ? (
        <p className="text-body-md text-on-surface-variant">
          Nothing to review — the queue is clear. 🎉
        </p>
      ) : (
        <div className="space-y-4">
          {items.map(({ submission, photoUrl }) => (
            <ReviewItem
              key={submission.id}
              submission={submission}
              photoUrl={photoUrl}
            />
          ))}
        </div>
      )}
    </section>
  );
}
