import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/shared/auth/dal";
import { guardTool } from "@/lib/shared/toolGate";
import { createField, listFields } from "@/lib/fields/fields";
import { fieldCreateSchema } from "@/lib/fields/schema";

/** List the tenant's fields. */
export async function GET() {
  const { tenantId } = await requireTenant();
  const fields = await listFields(tenantId);
  return NextResponse.json({ fields });
}

/** Create a field from a GeoJSON Polygon (drawn on the map or uploaded). */
export async function POST(request: Request) {
  const blocked = await guardTool(request, { rateLimit: false });
  if (blocked) return blocked;
  const { tenantId } = await requireTenant();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = fieldCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid field." },
      { status: 400 },
    );
  }

  try {
    const id = await createField({ tenantId, input: parsed.data });
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not create field." },
      { status: 500 },
    );
  }
}
