import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/shared/auth/dal";
import { deleteField, getField } from "@/lib/fields/fields";

type Ctx = { params: Promise<{ fieldId: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const { tenantId } = await requireTenant();
  const { fieldId } = await params;
  const field = await getField(tenantId, fieldId);
  if (!field) {
    return NextResponse.json({ error: "Field not found." }, { status: 404 });
  }
  return NextResponse.json({ field });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { tenantId } = await requireTenant();
  const { fieldId } = await params;
  try {
    await deleteField(tenantId, fieldId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not delete field." },
      { status: 500 },
    );
  }
}
