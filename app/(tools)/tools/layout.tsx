import ToolsNav from "@/components/tools/ToolsNav";

/**
 * Shared shell for the /tools namespace: nav + content wrapper. This is NOT the
 * auth gate — per this Next.js fork's guidance, auth is enforced in each page
 * and Route Handler via the DAL (lib/shared/auth/dal.ts), with proxy.ts doing
 * an optimistic redirect.
 */
export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ToolsNav />
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {children}
      </main>
    </>
  );
}
