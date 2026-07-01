import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/shared/auth/dal";
import { guardTool } from "@/lib/shared/toolGate";
import { decideSubmission } from "@/lib/spray/records";

/** Approve or reject a submission in the review queue. */
export async function POST(request: Request) {
  const blocked = await guardTool(request, { rateLimit: false });
  if (blocked) return blocked;
  const { session, tenantId } = await requireTenant();

  let body: { submissionId?: string; decision?: "approve" | "reject" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    !body.submissionId ||
    (body.decision !== "approve" && body.decision !== "reject")
  ) {
    return NextResponse.json(
      { error: "submissionId and decision (approve|reject) are required." },
      { status: 400 },
    );
  }

  try {
    await decideSubmission({
      tenantId,
      submissionId: body.submissionId,
      decision: body.decision,
      // approved_by references auth.users — only set for a real signed-in user.
      approvedBy: session.isDev ? null : session.userId,
    });
    return NextResponse.json({
      ok: true,
      status: body.decision === "approve" ? "approved" : "rejected",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update." },
      { status: 500 },
    );
  }
}
