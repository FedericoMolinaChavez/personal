import { requireUser } from "@/lib/shared/auth/dal";
import ToolPlaceholder from "@/components/tools/ToolPlaceholder";

export default async function SprayReviewPage() {
  await requireUser();
  return (
    <ToolPlaceholder
      title="Review Queue"
      description="Low-confidence or out-of-range submissions land here for human approval before they're saved as compliance records."
    />
  );
}
