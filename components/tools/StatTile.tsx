import type { ReactNode } from "react";

/** KPI tile with mono numerals — used on the Overview and usage dashboard. */
export default function StatTile({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: string;
}) {
  return (
    <div className="rounded-xl border border-cmd-line bg-cmd-surface p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-label-sm uppercase tracking-wider text-cmd-muted">
          {label}
        </p>
        {icon && (
          <span
            className="material-symbols-outlined text-cmd-accent-dim"
            style={{ fontSize: 18 }}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 font-mono text-headline-md font-bold text-cmd-text">
        {value}
      </p>
      {hint && <p className="mt-1 text-label-sm text-cmd-muted">{hint}</p>}
    </div>
  );
}
