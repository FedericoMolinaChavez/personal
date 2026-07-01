import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/shared/supabase/server";
import type { FieldCreateInput, FieldRow } from "./schema";

/**
 * P3 — data access for field boundaries. Mirrors lib/spray/records.ts:
 * service-role client scoped explicitly by tenant_id. Geometry is written via
 * the public.fields_create RPC and read via the fields.field_list view (which
 * exposes geometry as GeoJSON + a centroid), because PostgREST can't round-trip
 * PostGIS geometry directly.
 */

/**
 * Service-role client cast to the default (untyped) SupabaseClient so the query
 * builder works before generated types (`npm run db:types`) cover the per-tool
 * schemas. Returns null in placeholder mode.
 */
function fieldsDb(): SupabaseClient | null {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  return supabase as unknown as SupabaseClient;
}

export async function createField(params: {
  tenantId: string;
  input: FieldCreateInput;
}): Promise<string | null> {
  const db = fieldsDb();
  if (!db) return null;
  const { data, error } = await db.rpc("fields_create", {
    p_tenant: params.tenantId,
    p_name: params.input.name,
    p_crop: params.input.crop ?? null,
    p_geojson: params.input.geometry,
  });
  if (error) throw new Error(`createField failed: ${error.message}`);
  return data as string;
}

export async function listFields(tenantId: string): Promise<FieldRow[]> {
  const db = fieldsDb();
  if (!db) return [];
  const { data, error } = await db
    .schema("fields")
    .from("field_list")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(`listFields failed: ${error.message}`);
  return (data ?? []) as FieldRow[];
}

export async function getField(
  tenantId: string,
  fieldId: string,
): Promise<FieldRow | null> {
  const db = fieldsDb();
  if (!db) return null;
  const { data, error } = await db
    .schema("fields")
    .from("field_list")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("id", fieldId)
    .maybeSingle();
  if (error) throw new Error(`getField failed: ${error.message}`);
  return (data as FieldRow) ?? null;
}

export async function deleteField(
  tenantId: string,
  fieldId: string,
): Promise<void> {
  const db = fieldsDb();
  if (!db) throw new Error("Supabase not configured");
  const { error } = await db
    .schema("fields")
    .from("fields")
    .delete()
    .eq("tenant_id", tenantId)
    .eq("id", fieldId);
  if (error) throw new Error(`deleteField failed: ${error.message}`);
}

/** Every field across all tenants — for cron jobs running without a session. */
export async function listAllFields(): Promise<FieldRow[]> {
  const db = fieldsDb();
  if (!db) return [];
  const { data, error } = await db
    .schema("fields")
    .from("field_list")
    .select("*");
  if (error) throw new Error(`listAllFields failed: ${error.message}`);
  return (data ?? []) as FieldRow[];
}
