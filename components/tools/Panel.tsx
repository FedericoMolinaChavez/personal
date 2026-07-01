import type { ReactNode } from "react";

/** Surface card for the Command theme. Caller controls padding via className. */
export default function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-cmd-line bg-cmd-surface ${className}`}>
      {children}
    </div>
  );
}
