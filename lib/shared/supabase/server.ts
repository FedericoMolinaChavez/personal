import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let adminClient: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Returns a server-only Supabase client using the service-role key, or null
 * when the env vars are not set.
 *
 * This client BYPASSES Row-Level Security — use it only in trusted server code
 * (route handlers, cron jobs, webhook intake) and always set `tenant_id`
 * explicitly when writing. Never import it into a Client Component:
 * SUPABASE_SERVICE_ROLE_KEY is not NEXT_PUBLIC_, so Next.js replaces it with an
 * empty string on the client and this returns null there.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  if (!adminClient) {
    adminClient = createClient<Database>(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}
