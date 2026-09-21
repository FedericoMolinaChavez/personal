"use client";

import { track } from "@vercel/analytics";

type Props = {
  className?: string;
  label?: string;
};

/**
 * Triggers the browser print dialog. The page ships a print stylesheet so
 * Save as PDF / print produces a usable offline checklist without a PDF
 * generation dependency.
 */
export default function PrintChecklistButton({
  className = "",
  label = "Print or save as PDF",
}: Props) {
  function handleClick() {
    track("scorecard_checklist_print");
    window.print();
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {label}
    </button>
  );
}
