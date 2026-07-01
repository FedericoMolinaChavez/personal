import { requireTenant } from "@/lib/shared/auth/dal";

/**
 * Current workspace/tenant id for the signed-in user (server-only).
 * Thin wrapper over the auth DAL so tool code has one import for "which tenant
 * am I acting as". Always set this explicitly on writes from the service-role
 * client, which bypasses RLS.
 */
export async function currentTenantId(): Promise<string> {
  const { tenantId } = await requireTenant();
  return tenantId;
}
