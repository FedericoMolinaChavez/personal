import { cache } from "react";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/shared/supabase/server-ssr";

/**
 * Data Access Layer for auth — the primary line of defense.
 *
 * This Next.js fork warns against layout-level auth checks (Partial Rendering
 * means layouts don't re-run on client navigation), so every tool page and
 * Route Handler that touches tenant data must call requireUser()/requireTenant()
 * here. proxy.ts only does an optimistic cookie redirect.
 */

export type Session = {
  userId: string;
  email: string | null;
  /** True when Supabase isn't configured — a synthetic dev session so the
   *  tools skeleton renders before Auth is wired (placeholder mode). */
  isDev: boolean;
};

/**
 * Resolve the current user session once per request (React.cache dedupes calls
 * within a render). Returns null when there is no authenticated user.
 */
export const verifySession = cache(async (): Promise<Session | null> => {
  // Temporary demo bypass: act as DEMO_TENANT_ID without real sign-in. Remove
  // once Supabase Auth sign-in ships. See requireTenant below.
  if (process.env.DEMO_TENANT_ID) {
    return { userId: "demo", email: null, isDev: true };
  }
  const supabase = await getSupabaseServer();
  if (!supabase) {
    return { userId: "dev", email: null, isDev: true };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { userId: user.id, email: user.email ?? null, isDev: false };
});

/** Require an authenticated user; redirect to /sign-in otherwise. */
export async function requireUser(): Promise<Session> {
  const session = await verifySession();
  if (!session) redirect("/sign-in");
  return session;
}

/**
 * Require the user's tenant id — the RLS spine for every tool query. Resolves
 * via the public.current_tenant_id() helper. Returns a stub tenant in dev mode.
 */
export async function requireTenant(): Promise<{
  session: Session;
  tenantId: string;
}> {
  const session = await requireUser();
  if (session.isDev) {
    // Demo bypass resolves to a real tenant id so writes land under a real
    // tenant; otherwise a synthetic stub for the unconfigured skeleton.
    return { session, tenantId: process.env.DEMO_TENANT_ID ?? "dev-tenant" };
  }
  const supabase = await getSupabaseServer();
  // Loose cast: the generated Database types (lib/shared/supabase/types.ts) are
  // a placeholder until `npm run db:types`, so the rpc isn't yet typed.
  const sb = supabase as unknown as {
    rpc: (fn: string) => Promise<{ data: unknown; error: unknown }>;
  };
  const { data, error } = await sb.rpc("current_tenant_id");
  if (error || !data) redirect("/sign-in");
  return { session, tenantId: data as string };
}
