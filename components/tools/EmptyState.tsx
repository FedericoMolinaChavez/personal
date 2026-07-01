import type { ReactNode } from "react";

/** Empty-state block for lists/tables in the Command theme. */
export default function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-cmd-line bg-cmd-surface/50 px-6 py-14 text-center">
      <span
        className="material-symbols-outlined text-cmd-accent-dim"
        style={{ fontSize: 32 }}
      >
        {icon}
      </span>
      <p className="mt-3 font-display text-headline-md font-bold text-cmd-text">
        {title}
      </p>
      {description && (
        <p className="mt-1 max-w-md text-body-md text-cmd-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
