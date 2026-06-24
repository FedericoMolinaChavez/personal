const STYLES: Record<string, { label: string; cls: string }> = {
  parsed: {
    label: "Parsed",
    cls: "bg-surface-container-high text-on-surface-variant",
  },
  needs_review: {
    label: "Needs review",
    cls: "bg-primary-container text-on-primary-container",
  },
  approved: {
    label: "Approved",
    cls: "bg-secondary-container text-on-secondary-container",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-error-container text-on-error-container",
  },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = STYLES[status] ?? {
    label: status,
    cls: "bg-surface-container-high text-on-surface-variant",
  };
  return (
    <span
      className={`inline-block shrink-0 rounded-full px-3 py-1 text-label-sm font-label-sm ${s.cls}`}
    >
      {s.label}
    </span>
  );
}
