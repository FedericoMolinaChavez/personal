import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Cookie-bound server Supabase client (anon key) for reading the signed-in
 * user's session in Server Components, Route Handlers, and the auth DAL.
 * RLS is always enforced. Returns null in placeholder mode (no public Supabase
 * env), matching the rest of the app's graceful-degradation pattern.
 */
export async function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const cookieStore = await cookies();
  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component where cookies are read-only; the
          // session refresh is handled in proxy.ts and Route Handlers instead.
        }
      },
    },
  });
}
