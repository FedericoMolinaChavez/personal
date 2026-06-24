import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Returns a browser (anon-key) Supabase client, or null when the public
 * Supabase env vars are not set. RLS is always enforced for this client.
 * The null path keeps the app building/running in "placeholder mode" (matching
 * the Stripe/Cal.com pattern) before Supabase is configured.
 */
export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createBrowserClient<Database>(url, anonKey);
}
