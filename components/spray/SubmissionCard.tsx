import type { SubmissionView } from "@/lib/spray/records";
import StatusPill from "@/components/tools/StatusPill";

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
    .join("  ·  ");

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-cmd-line bg-cmd-surface p-4 transition-colors hover:border-cmd-line-strong">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cmd-surface2 text-cmd-muted">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            {submission.channel === "photo" ? "image" : "edit_note"}
          </span>
        </span>
        <div className="min-w-0">
          <p className="truncate text-body-md font-medium text-cmd-text">{title}</p>
          <p className="font-mono text-label-sm text-cmd-muted">{sub || "—"}</p>
        </div>
      </div>
      <StatusPill status={submission.status} />
    </div>
  );
}
