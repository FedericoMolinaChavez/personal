import type { SubmissionView } from "@/lib/spray/records";
import StatusBadge from "./StatusBadge";

export default function SubmissionCard({
  submission,
}: {
  submission: SubmissionView;
}) {
  const r = submission.record;
  const title = r?.product ?? "Unread record";
  const sub = [
    r?.rate != null ? `${r.rate} ${r.unit ?? ""}`.trim() : null,
    r?.field_block,
    new Date(submission.createdAt).toLocaleDateString(),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-outline-variant/50 bg-surface-container-low p-4">
      <div className="min-w-0">
        <p className="truncate text-body-md font-medium text-on-surface">
          {title}
        </p>
        <p className="text-label-sm text-on-surface-variant">{sub || "—"}</p>
      </div>
      <StatusBadge status={submission.status} />
    </div>
  );
}
