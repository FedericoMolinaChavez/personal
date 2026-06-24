import { requireUser } from "@/lib/shared/auth/dal";
import ToolPlaceholder from "@/components/tools/ToolPlaceholder";

export default async function AgronomyPage() {
  await requireUser();
  return (
    <ToolPlaceholder
      title="Agronomy Knowledge Assistant"
      description="Ask application-rate, REI, and PHI questions and get answers from your own pesticide labels and extension guides — with citations, and a refuse-to-guess guardrail."
    />
  );
}
