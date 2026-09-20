import type { Metadata } from "next";
import MaterialSymbols from "@/components/MaterialSymbols";
import AppShell from "@/components/tools/AppShell";

/**
 * Shell for the /tools namespace: the "Command" dark dashboard (sidebar + content).
 * NOT the auth gate — per this Next.js fork's guidance, auth is enforced in each
 * page and Route Handler via the DAL (lib/shared/auth/dal.ts); proxy.ts does an
 * optimistic redirect. The dark theme is scoped here so the marketing site (which
 * sets the light theme on <body>) is unaffected.
 *
 * Crawl hygiene: this is a gated utility app, not a marketing landing page.
 * Own title/description + self-canonical override root layout defaults; noindex
 * keeps it from competing with the homepage. Intentionally omitted from sitemap.
 */
const toolsTitle = "Ag Tools";
const toolsDescription =
  "Private agriculture tools — agronomy assistant, spray records, and field dashboard.";

export const metadata: Metadata = {
  title: toolsTitle,
  description: toolsDescription,
  keywords: ["ag tools", "agronomy", "spray records", "field dashboard"],
  alternates: { canonical: "/tools" },
  openGraph: {
    url: "/tools",
    title: toolsTitle,
    description: toolsDescription,
  },
  twitter: {
    card: "summary",
    title: toolsTitle,
    description: toolsDescription,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MaterialSymbols />
      <AppShell>{children}</AppShell>
    </>
  );
}
