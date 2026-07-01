import type { ReactNode } from "react";

/** Dark, on-brand "coming soon" page — Command-theme replacement for ToolPlaceholder. */
export default function ComingSoon({
  title,
  description,
  icon = "construction",
  action,
}: {
  title: string;
  description: string;
  icon?: string;
  action?: ReactNode;
}) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cmd-line bg-cmd-surface glow-accent">
        <span
          className="material-symbols-outlined text-cmd-accent"
          style={{ fontSize: 30 }}
        >
          {icon}
        </span>
      </span>
      <p className="mt-6 font-mono text-label-sm uppercase tracking-[0.2em] text-cmd-amber">
        Coming soon
      </p>
      <h1 className="mt-3 font-display text-headline-lg font-extrabold text-cmd-text">
        {title}
      </h1>
      <p className="mt-3 max-w-xl text-body-lg text-cmd-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </section>
  );
}
