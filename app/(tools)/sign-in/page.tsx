import Link from "next/link";

/**
 * Auth entry — the redirect target for unauthenticated /tools access (proxy.ts
 * and the DAL). Standalone Command-themed page (no AppShell here, since this
 * route is outside /tools). Supabase Auth UI is wired in a later step.
 */
export default function SignInPage() {
  return (
    <main className="command-theme flex min-h-screen items-center justify-center bg-cmd-bg px-margin-mobile text-cmd-text font-body-md">
      <div className="w-full max-w-md rounded-2xl border border-cmd-line bg-cmd-surface p-8 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cmd-accent text-cmd-on-accent">
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
            eco
          </span>
        </span>
        <p className="mt-5 font-mono text-label-sm uppercase tracking-[0.2em] text-cmd-amber">
          Authentication
        </p>
        <h1 className="mt-2 font-display text-headline-lg font-extrabold text-cmd-text">
          Sign in
        </h1>
        <p className="mt-3 text-body-md text-cmd-muted">
          Sign-in isn&apos;t wired up yet. Once Supabase Auth is configured,
          this is where you&apos;ll sign in to access the tools.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-cmd-line px-5 py-2.5 text-label-md text-cmd-text transition-colors hover:border-cmd-accent hover:text-cmd-accent"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            arrow_back
          </span>
          Back to site
        </Link>
      </div>
    </main>
  );
}
