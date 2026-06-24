import { requireUser } from "@/lib/shared/auth/dal";
import ToolPlaceholder from "@/components/tools/ToolPlaceholder";

export default async function FieldDetailPage({
  params,
}: {
  params: Promise<{ fieldId: string }>;
}) {
  await requireUser();
  const { fieldId } = await params;
  return (
    <ToolPlaceholder
      title={`Field ${fieldId}`}
      description="Per-field NDVI trend, weather, and the AI briefing that references this field's metrics."
    />
  );
}
