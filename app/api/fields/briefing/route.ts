import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/shared/auth/dal";
import { generateBriefing } from "@/lib/fields/briefing";

/** Generate (and store) a grounded AI briefing from the tenant's metric JSON. */
export async function POST() {
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
