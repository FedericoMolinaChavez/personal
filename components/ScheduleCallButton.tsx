"use client";

import { track } from "@vercel/analytics";

type Props = {
  className?: string;
  label?: string;
  /**
   * Defaults to the in-page booking embed. Pages other than the landing page
   * have no #booking anchor and must pass the absolute form, "/#booking".
   */
  href?: string;
  /** Trailing instrument glyph — usually <ControlArrow />. */
  children?: React.ReactNode;
};

export default function ScheduleCallButton({
  className = "",
  label = "Schedule a call",
  href = "#booking",
  children,
}: Props) {
  return (
    <a
      href={href}
      onClick={() => track("schedule_call_click")}
      className={className}
    >
      <span>{label}</span>
      {children}
    </a>
  );
}
