import { requireUser } from "@/lib/shared/auth/dal";
import ToolPlaceholder from "@/components/tools/ToolPlaceholder";

export default async function AgronomyChatPage() {
  await requireUser();
  return (
    <ToolPlaceholder
      title="Agronomy Chat"
      description="Grounded, cited answers from your document library. The assistant declines when the documents don't contain the answer."
    />
  );
}
