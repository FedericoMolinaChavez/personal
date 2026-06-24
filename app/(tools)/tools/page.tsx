import Link from "next/link";
import { requireUser } from "@/lib/shared/auth/dal";

const tools = [
  {
    href: "/tools/spray",
    title: "Spray & Field-Record Automation",
    blurb:
      "Turn a photo, text, or voice note into a structured, compliant application record — auto-logged and threshold-checked.",
  },
  {
    href: "/tools/agronomy",
    title: "Agronomy Knowledge Assistant",
    blurb:
      "Answer application-rate, REI, and PHI questions from your own labels and guides, with citations.",
  },
  {
    href: "/tools/fields",
    title: "Field Health & Operations Dashboard",
    blurb:
      "Satellite NDVI, weather, and commodity prices per field, with a weekly AI briefing.",
  },
];

export default async function ToolsIndexPage() {
  await requireUser();
  return (
    <section className="py-16">
      <h1 className="font-display text-headline-lg font-extrabold text-on-surface mb-8">
        Ag Tools
      </h1>
      <div className="grid gap-6 md:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="block rounded-lg border border-outline-variant/50 bg-surface-container-low p-6 hover:border-primary transition-colors"
          >
            <h2 className="font-display text-headline-md font-bold text-on-surface mb-2">
              {t.title}
            </h2>
            <p className="text-body-md text-on-surface-variant">{t.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
