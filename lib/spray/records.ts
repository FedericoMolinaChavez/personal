import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/shared/supabase/server";
import { logRun } from "@/lib/shared/logging/runLog";
import type { SprayRecordDraft } from "./schema";
import type { Validation } from "./rules";

export type SubmissionStatus =
  | "parsed"
  | "needs_review"
  | "approved"
  | "rejected";

/** Estimated minutes saved per processed record vs. manual paper logging. */
const TIME_SAVED_MIN = 28;

/**
 * Service-role client scoped to the `spray` schema. Cast to the default
 * (untyped) SupabaseClient so the query builder works before generated types
 * (`npm run db:types`) cover the per-tool schemas. Returns null in placeholder
 * mode (no Supabase configured).
 */
function sprayDb(): SupabaseClient | null {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  return supabase as unknown as SupabaseClient;
}

export async function createSubmission(params: {
  tenantId: string;
  channel: string;
  rawInput: Record<string, unknown>;
}): Promise<string | null> {
  const db = sprayDb();
  if (!db) return null;
  const { data, error } = await db
    .schema("spray")
    .from("submissions")
    .insert({
      tenant_id: params.tenantId,
      channel: params.channel,
      raw_input: params.rawInput,
      status: "parsed",
    })
    .select("id")
    .single();
  if (error || !data) {
    throw new Error(`createSubmission failed: ${error?.message ?? "no row"}`);
  }
  return data.id as string;
}

/**
 * Persist the extracted record and set the submission status: needs_review when
 * validation failed, parsed otherwise. Writes the run log.
 */
export async function saveExtractedRecord(params: {
  tenantId: string;
  submissionId: string;
  draft: SprayRecordDraft;
  validation: Validation;
}): Promise<SubmissionStatus> {
  const db = sprayDb();
  if (!db) throw new Error("Supabase not configured");

  const status: SubmissionStatus = params.validation.ok
    ? "parsed"
    : "needs_review";
  const d = params.draft;

  const { error: recErr } = await db
    .schema("spray")
    .from("records")
    .insert({
      submission_id: params.submissionId,
      tenant_id: params.tenantId,
      product: d.product,
      epa_reg_no: d.epa_reg_no,
      rate: d.rate,
      unit: d.unit,
      field_block: d.field_block,
      acres: d.acres,
      applied_at: d.applied_at,
      applicator: d.applicator,
      wind_speed: d.wind_speed,
      target_pest: d.target_pest,
      validation: {
        ok: params.validation.ok,
        issues: params.validation.issues,
        confidence: d.confidence,
        notes: d.notes,
      },
    });
  if (recErr) throw new Error(`saveRecord failed: ${recErr.message}`);

  await db
    .schema("spray")
    .from("submissions")
    .update({ status })
    .eq("id", params.submissionId)
    .eq("tenant_id", params.tenantId);

  await logRun({
    tenantId: params.tenantId,
    submissionId: params.submissionId,
    status,
    timeSavedMin: TIME_SAVED_MIN,
  });

  return status;
}

/** Approve or reject a submission. approvedBy is only set for a real auth user. */
export async function decideSubmission(params: {
  tenantId: string;
  submissionId: string;
  decision: "approve" | "reject";
  approvedBy?: string | null;
}): Promise<void> {
  const db = sprayDb();
  if (!db) throw new Error("Supabase not configured");

  const status: SubmissionStatus =
    params.decision === "approve" ? "approved" : "rejected";

  const { error } = await db
    .schema("spray")
    .from("submissions")
    .update({ status })
    .eq("id", params.submissionId)
    .eq("tenant_id", params.tenantId);
  if (error) throw new Error(`decideSubmission failed: ${error.message}`);

  if (params.decision === "approve" && params.approvedBy) {
    await db
      .schema("spray")
      .from("records")
      .update({ approved_by: params.approvedBy })
      .eq("submission_id", params.submissionId)
      .eq("tenant_id", params.tenantId);
  }

  await logRun({
    tenantId: params.tenantId,
    submissionId: params.submissionId,
    status,
  });
}

/** Mark a submission for review after a processing failure, and log the error. */
export async function failSubmission(params: {
  tenantId: string;
  submissionId: string;
  error: string;
}): Promise<void> {
  const db = sprayDb();
  if (!db) return;
  await db
    .schema("spray")
    .from("submissions")
    .update({ status: "needs_review" })
    .eq("id", params.submissionId)
    .eq("tenant_id", params.tenantId);
  await logRun({
    tenantId: params.tenantId,
    submissionId: params.submissionId,
    status: "error",
    error: params.error,
  });
}

const SUBMISSION_SELECT =
  "id,status,channel,created_at,raw_input,records(product,epa_reg_no,rate,unit,field_block,acres,applied_at,applicator,wind_speed,target_pest,validation)";

export type SprayRecordRow = {
  product: string | null;
  epa_reg_no: string | null;
  rate: number | null;
  unit: string | null;
  field_block: string | null;
  acres: number | null;
  applied_at: string | null;
  applicator: string | null;
  wind_speed: number | null;
  target_pest: string | null;
  validation: {
    ok?: boolean;
    issues?: string[];
    confidence?: number;
    notes?: string | null;
  } | null;
};

export type SubmissionView = {
  id: string;
  status: string;
  channel: string | null;
  createdAt: string;
  photoPath: string | null;
  record: SprayRecordRow | null;
};

function toView(row: {
  id: string;
  status: string;
  channel: string | null;
  created_at: string;
  raw_input: { photoPath?: string | null } | null;
  records: SprayRecordRow[] | SprayRecordRow | null;
}): SubmissionView {
  const record = Array.isArray(row.records) ? (row.records[0] ?? null) : row.records;
  return {
    id: row.id,
    status: row.status,
    channel: row.channel,
    createdAt: row.created_at,
    photoPath: row.raw_input?.photoPath ?? null,
    record,
  };
}

export async function listSubmissions(
  tenantId: string,
  opts?: { status?: SubmissionStatus; limit?: number },
): Promise<SubmissionView[]> {
  const db = sprayDb();
  if (!db) return [];
  let q = db
    .schema("spray")
    .from("submissions")
    .select(SUBMISSION_SELECT)
    .eq("tenant_id", tenantId);
  if (opts?.status) q = q.eq("status", opts.status);
  const { data, error } = await q
    .order("created_at", { ascending: false })
    .limit(opts?.limit ?? 25);
  if (error) throw new Error(`listSubmissions failed: ${error.message}`);
  return (data ?? []).map(toView);
}

/** Approved records as CSV text for the compliance export. */
export async function approvedRecordsCsv(tenantId: string): Promise<string> {
  const rows = await listSubmissions(tenantId, {
    status: "approved",
    limit: 1000,
  });
  const header = [
    "submission_id",
    "created_at",
    "product",
    "epa_reg_no",
    "rate",
    "unit",
    "field_block",
    "acres",
    "applied_at",
    "applicator",
    "wind_speed",
    "target_pest",
  ];
  const lines = [header.join(",")];
  for (const s of rows) {
    const r = s.record;
    lines.push(
      [
        s.id,
        s.createdAt,
        r?.product,
        r?.epa_reg_no,
        r?.rate,
        r?.unit,
        r?.field_block,
        r?.acres,
        r?.applied_at,
        r?.applicator,
        r?.wind_speed,
        r?.target_pest,
      ]
        .map(csvCell)
        .join(","),
    );
  }
  return lines.join("\n");
}

function csvCell(v: unknown): string {
  if (v == null) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
