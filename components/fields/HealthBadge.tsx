import type { Health } from "@/lib/fields/schema";
import { HEALTH_BADGE, HEALTH_LABEL } from "./health";

export default function HealthBadge({ health }: { health: Health }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full px-3 py-1 text-label-sm font-label-sm ${HEALTH_BADGE[health]}`}
    >
      {HEALTH_LABEL[health]}
    </span>
  );
}
