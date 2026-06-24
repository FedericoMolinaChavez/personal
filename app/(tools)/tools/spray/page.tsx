import { requireUser } from "@/lib/shared/auth/dal";
import ToolPlaceholder from "@/components/tools/ToolPlaceholder";

export default async function SprayPage() {
  await requireUser();
  return (
    <ToolPlaceholder
      title="Spray & Field-Record Automation"
      description="Turn a photo of a paper log, a text, or a voice note into a structured, compliant application record — extracted, validated against label limits, and logged."
    />
  );
}
