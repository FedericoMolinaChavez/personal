import { requireUser } from "@/lib/shared/auth/dal";
import ToolPlaceholder from "@/components/tools/ToolPlaceholder";

export default async function FieldsPage() {
  await requireUser();
  return (
    <ToolPlaceholder
      title="Field Health & Operations Dashboard"
      description="Satellite NDVI, weather, and commodity prices per field, with a plain-English weekly briefing on what changed, why, and what to do."
    />
  );
}
