import Link from "next/link";
import { requireUser } from "@/lib/shared/auth/dal";
import PageHeader from "@/components/tools/PageHeader";
import { buttonClasses } from "@/components/tools/Button";
import Chat from "@/components/agronomy/Chat";

export default async function AgronomyChatPage() {
  await requireUser();
  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Assistant"
        title="Agronomy Chat"
        description="Grounded, cited answers from your document library. The assistant declines when the documents don't contain the answer."
        actions={
          <Link href="/tools/agronomy" className={buttonClasses("ghost")}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              folder_open
            </span>
            Manage documents
          </Link>
        }
      />
      <Chat />
    </section>
  );
}
