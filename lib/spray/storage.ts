import { getSupabaseAdmin } from "@/lib/shared/supabase/server";

const BUCKET = "spray-intake";

/**
 * Upload an intake photo to the private bucket, namespaced by tenant. Returns
 * the storage path, or null when Supabase isn't configured.
 */
export async function uploadIntakePhoto(
  tenantId: string,
  file: File,
): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${tenantId}/${crypto.randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
  if (error) throw new Error(`Photo upload failed: ${error.message}`);
  return path;
}

/** Short-lived signed URL for displaying an intake photo in the review queue. */
export async function signedPhotoUrl(
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
