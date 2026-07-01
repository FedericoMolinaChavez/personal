import AppShell from "@/components/tools/AppShell";

/**
 * Shell for the /tools namespace: the "Command" dark dashboard (sidebar + content).
 * NOT the auth gate — per this Next.js fork's guidance, auth is enforced in each
 * page and Route Handler via the DAL (lib/shared/auth/dal.ts); proxy.ts does an
 * optimistic redirect. The dark theme is scoped here so the marketing site (which
 * sets the light theme on <body>) is unaffected.
 */
export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
