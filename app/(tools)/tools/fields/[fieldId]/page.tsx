import { requireUser } from "@/lib/shared/auth/dal";
import ComingSoon from "@/components/tools/ComingSoon";

export default async function FieldDetailPage({
  params,
}: {
  params: Promise<{ fieldId: string }>;
}) {
  await requireUser();
  const { fieldId } = await params;
  return (
    <ComingSoon
      icon="satellite_alt"
      title={`Field ${fieldId}`}
      description="Per-field NDVI trend, weather, and the AI briefing that references this field's metrics."
    />
  );
}
