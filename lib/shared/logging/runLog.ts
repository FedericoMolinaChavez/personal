import { getSupabaseAdmin } from "@/lib/shared/supabase/server";

export type RunLogEntry = {
  tenantId: string;
  submissionId?: string;
  status: string;
  error?: string;
  timeSavedMin?: number;
};

/**
 * Record one automation run to spray.run_log (the P2 audit trail; extend for
 * other tools as they're built). No-op when Supabase isn't configured. Uses the
 * service-role client — tenant_id is set explicitly by the caller.
 */
export async function logRun(entry: RunLogEntry): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  // Loose cast until generated types (db:types) cover the per-tool schemas.
  const sb = supabase as unknown as {
    schema: (s: string) => {
      from: (t: string) => { insert: (v: unknown) => Promise<{ error: unknown }> };
    };
  };
  await sb
    .schema("spray")
    .from("run_log")
    .insert({
      tenant_id: entry.tenantId,
      submission_id: entry.submissionId,
      status: entry.status,
      error: entry.error,
      time_saved_min: entry.timeSavedMin,
    });
}
