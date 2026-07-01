type Tone = "neutral" | "info" | "success" | "warn" | "danger";

const TONES: Record<Tone, string> = {
  neutral: "border-cmd-line bg-cmd-surface2 text-cmd-muted",
  info: "border-cmd-info/30 bg-cmd-info/10 text-cmd-info",
  success: "border-cmd-accent/30 bg-cmd-accent/10 text-cmd-accent",
  warn: "border-cmd-amber/30 bg-cmd-amber/10 text-cmd-amber",
  danger: "border-cmd-danger/30 bg-cmd-danger/10 text-cmd-danger",
};

/** Status → {label, tone}, covering both agronomy and spray lifecycles. */
const STATUS: Record<string, { label: string; tone: Tone }> = {
  // agronomy documents
  pending: { label: "Pending", tone: "neutral" },
  ingesting: { label: "Ingesting", tone: "info" },
  ready: { label: "Ready", tone: "success" },
  failed: { label: "Failed", tone: "danger" },
  // spray submissions
  parsed: { label: "Parsed", tone: "neutral" },
  needs_review: { label: "Needs review", tone: "warn" },
  approved: { label: "Approved", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
};

/** Unified status pill for the Command theme (replaces the per-tool StatusBadges). */
export default function StatusPill({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, tone: "neutral" as Tone };
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-label-sm ${TONES[s.tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {s.label}
    </span>
  );
}
