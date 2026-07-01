import { NextResponse } from "next/server";
import { Resend } from "resend";
import { requireTenant } from "@/lib/shared/auth/dal";
import { extractRecord } from "@/lib/spray/extract";
import { validateRecord } from "@/lib/spray/rules";
import {
  createSubmission,
  failSubmission,
  saveExtractedRecord,
} from "@/lib/spray/records";
import { uploadIntakePhoto } from "@/lib/spray/storage";
import type { LLMImage } from "@/lib/shared/llm";

/** Notify on a processing failure (best effort; reuses the Resend pattern). */
async function notifyFailure(
  tenantId: string,
  submissionId: string | null,
  err: unknown,
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const message = err instanceof Error ? err.message : String(err);
  try {
    const resend = new Resend(key);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "notifications@thenomadhub.xyz",
      to: process.env.CONTACT_EMAIL ?? "federicomolinachavez@gmail.com",
      subject: `Spray intake failed — tenant ${tenantId}`,
      html: `<p>Submission <strong>${submissionId ?? "(unsaved)"}</strong> failed to process:</p><pre>${message}</pre>`,
    });
  } catch {
    // best effort — never let notification failure mask the original error
  }
}

export async function POST(request: Request) {
  const { tenantId } = await requireTenant();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data." },
      { status: 400 },
    );
  }

  const note = ((form.get("note") as string | null) ?? "").trim();
  const photo = form.get("photo");
  const hasPhoto = photo instanceof File && photo.size > 0;

  if (!note && !hasPhoto) {
    return NextResponse.json(
      { error: "Add a note or a photo of the spray log." },
      { status: 400 },
    );
  }

  // 1. Persist the raw submission (audit trail) + upload the photo.
  let submissionId: string | null = null;
  try {
    const photoPath = hasPhoto
      ? await uploadIntakePhoto(tenantId, photo as File)
      : null;
    submissionId = await createSubmission({
      tenantId,
      channel: hasPhoto ? "photo" : "form",
      rawInput: { note: note || null, photoPath },
    });
  } catch (err) {
    await notifyFailure(tenantId, submissionId, err);
    return NextResponse.json(
      { error: "Could not save your submission. Please try again." },
      { status: 500 },
    );
  }
  if (!submissionId) {
    return NextResponse.json(
      { error: "Database is not configured." },
      { status: 501 },
    );
  }

  // 2. Extract + validate. Any failure routes to review — never crash.
  try {
    let image: LLMImage | undefined;
    if (hasPhoto) {
      const buf = Buffer.from(await (photo as File).arrayBuffer());
      image = {
        mediaType: (photo as File).type || "image/jpeg",
        base64: buf.toString("base64"),
      };
    }

    const draft = await extractRecord({
      tenantId,
      text: note || undefined,
      image,
    });

    if (!draft) {
      await failSubmission({
        tenantId,
        submissionId,
        error: "Extraction returned no record.",
      });
      return NextResponse.json({
        submissionId,
        status: "needs_review",
        record: null,
        issues: ["Couldn't read a record from this input — queued for review."],
      });
    }

    const validation = validateRecord(draft);
    const status = await saveExtractedRecord({
      tenantId,
      submissionId,
      draft,
      validation,
    });
    return NextResponse.json({
      submissionId,
      status,
      record: draft,
      issues: validation.issues,
    });
  } catch (err) {
    await failSubmission({
      tenantId,
      submissionId,
      error: err instanceof Error ? err.message : String(err),
    }).catch(() => {});
    await notifyFailure(tenantId, submissionId, err);
    return NextResponse.json({
      submissionId,
      status: "needs_review",
      record: null,
      issues: [
        "We saved your submission but couldn't process it automatically. It's queued for review.",
      ],
    });
  }
}
