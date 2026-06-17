"use client";

import { track } from "@vercel/analytics";

type Props = {
  className?: string;
  label?: string;
};

export default function ScheduleCallButton({
  className = "",
  label = "Schedule a Call",
}: Props) {
  return (
    <a
      href="#booking"
      onClick={() => track("schedule_call_click")}
      className={className}
    >
      {label}
    </a>
  );
}
