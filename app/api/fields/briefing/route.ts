import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/shared/auth/dal";
import { guardTool } from "@/lib/shared/toolGate";
import { generateBriefing } from "@/lib/fields/briefing";

/** Generate (and store) a grounded AI briefing from the tenant's metric JSON. */
export async function POST(request: Request) {
  const blocked = await guardTool(request);
  if (blocked) return blocked;
  const { tenantId } = await requireTenant();
  try {
    const result = await generateBriefing(tenantId);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Briefing failed." },
      { status: 500 },
    );
  }
}
