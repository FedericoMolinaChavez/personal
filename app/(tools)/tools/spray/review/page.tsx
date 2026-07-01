import Link from "next/link";
import { requireTenant } from "@/lib/shared/auth/dal";
import { listSubmissions } from "@/lib/spray/records";
import { signedPhotoUrl } from "@/lib/spray/storage";
import PageHeader from "@/components/tools/PageHeader";
import EmptyState from "@/components/tools/EmptyState";
import { buttonClasses } from "@/components/tools/Button";
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
    <section className="space-y-8">
      <PageHeader
        eyebrow="Compliance"
        title="Review Queue"
        description="Submissions that were low-confidence or out-of-range. Confirm the parsed record against the original, then approve or reject."
        actions={
          <Link href="/tools/spray" className={buttonClasses("ghost")}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              arrow_back
            </span>
            Back to intake
          </Link>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon="task_alt"
          title="The queue is clear"
          description="Nothing needs review right now — new low-confidence records will show up here."
        />
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
