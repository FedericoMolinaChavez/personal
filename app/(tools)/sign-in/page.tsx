import ToolPlaceholder from "@/components/tools/ToolPlaceholder";

/**
 * Placeholder auth entry — the redirect target for unauthenticated /tools
 * access (proxy.ts and the DAL). Supabase Auth UI is wired in a later step.
 */
export default function SignInPage() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24">
      <ToolPlaceholder
        title="Sign in"
        description="Authentication isn't wired up yet. Once Supabase Auth is configured, this is where you'll sign in to access the tools."
      />
    </main>
  );
}
