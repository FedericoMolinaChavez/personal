import type { ReactNode } from "react";

/** Consistent page header across the tools app: eyebrow + title + description + actions. */
export default function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-cmd-line pb-6">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 font-mono text-label-sm uppercase tracking-[0.18em] text-cmd-accent-dim">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-headline-lg font-extrabold text-cmd-text">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-body-md text-cmd-muted">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>
      )}
    </header>
  );
}
