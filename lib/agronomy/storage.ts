import { getSupabaseAdmin } from "@/lib/shared/supabase/server";

const BUCKET = "agronomy-docs";

/**
 * Upload an original document to the private bucket, namespaced by tenant.
 * Returns the storage path, or null when Supabase isn't configured. Mirrors
 * lib/spray/storage.ts.
 */
export async function uploadDocument(
  tenantId: string,
  file: File,
): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const path = `${tenantId}/${crypto.randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) throw new Error(`Document upload failed: ${error.message}`);
  return path;
}

/** Short-lived signed URL for opening a source document from a citation. */
export async function signedDocUrl(
  path: string,
  expiresIn = 3600,
): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresIn);
  if (error) return null;
  return data?.signedUrl ?? null;
}
