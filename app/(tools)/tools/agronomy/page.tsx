import Link from "next/link";
import { requireTenant } from "@/lib/shared/auth/dal";
import { listDocuments } from "@/lib/agronomy/documents";
import PageHeader from "@/components/tools/PageHeader";
import EmptyState from "@/components/tools/EmptyState";
import { buttonClasses } from "@/components/tools/Button";
import UploadForm from "@/components/agronomy/UploadForm";
import DocumentRow from "@/components/agronomy/DocumentRow";

// Always render against live DB data per request (ingestion status changes).
export const dynamic = "force-dynamic";

export default async function AgronomyLibraryPage() {
  const { tenantId } = await requireTenant();
  const documents = await listDocuments(tenantId);
  const ready = documents.filter((d) => d.status === "ready").length;

  return (
    <section className="space-y-10">
      <PageHeader
        eyebrow="Knowledge base"
        title="Agronomy Knowledge Base"
        description="Upload labels, guides, and manuals. We parse, chunk, and embed them so the assistant can answer with cited sources — and decline when the answer isn't in your documents."
        actions={
          <>
            <Link href="/tools/agronomy/chat" className={buttonClasses("primary")}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                forum
              </span>
              Open chat{ready > 0 ? ` (${ready})` : ""}
            </Link>
            <Link href="/tools/agronomy/usage" className={buttonClasses("ghost")}>
              Usage
            </Link>
          </>
        }
      />

      <UploadForm />

      <div>
        <h2 className="mb-4 font-display text-headline-md font-bold text-cmd-text">
          Documents
        </h2>
        {documents.length === 0 ? (
          <EmptyState
            icon="upload_file"
            title="No documents yet"
            description="Upload a PDF, DOCX, TXT, or Markdown file above to build your knowledge base."
          />
        ) : (
          <ul className="space-y-3">
            {documents.map((d) => (
              <li key={d.id}>
                <DocumentRow doc={d} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
