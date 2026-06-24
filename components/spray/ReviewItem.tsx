"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { SubmissionView } from "@/lib/spray/records";

const FIELDS: { key: keyof NonNullable<SubmissionView["record"]>; label: string }[] =
  [
    { key: "product", label: "Product" },
    { key: "epa_reg_no", label: "EPA reg #" },
    { key: "rate", label: "Rate" },
    { key: "unit", label: "Unit" },
    { key: "field_block", label: "Field / block" },
    { key: "acres", label: "Acres" },
    { key: "applied_at", label: "Applied at" },
    { key: "applicator", label: "Applicator" },
    { key: "wind_speed", label: "Wind (mph)" },
    { key: "target_pest", label: "Target pest" },
  ];

export default function ReviewItem({
  submission,
  photoUrl,
}: {
  submission: SubmissionView;
  photoUrl: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<null | "approve" | "reject">(null);
  const [error, setError] = useState<string | null>(null);
  const r = submission.record;
  const issues = r?.validation?.issues ?? [];

  async function decide(decision: "approve" | "reject") {
    setBusy(decision);
    setError(null);
    try {
      const res = await fetch("/api/spray/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: submission.id, decision }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? "Failed to update.");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update.");
      setBusy(null);
    }
  }

  return (
    <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-6">
      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <div>
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt="Spray log"
              width={200}
              height={200}
              unoptimized
              className="h-auto w-full rounded-lg border border-outline-variant/50 object-cover"
            />
          ) : (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-outline-variant text-label-sm text-on-surface-variant">
              No photo
            </div>
          )}
        </div>

        <div>
          {r ? (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              {FIELDS.map(({ key, label }) => {
                const v = r[key] as unknown;
                return (
                  <div key={key}>
                    <dt className="text-label-sm text-on-surface-variant">
                      {label}
                    </dt>
                    <dd className="text-body-md text-on-surface">
                      {v == null || v === "" ? "—" : String(v)}
                    </dd>
                  </div>
                );
              })}
            </dl>
          ) : (
            <p className="text-body-md text-on-surface-variant">
              No structured record — manual entry needed.
            </p>
          )}

          {issues.length > 0 && (
            <ul className="mt-4 space-y-1">
              {issues.map((issue, i) => (
                <li
                  key={i}
                  className="text-body-md text-on-surface-variant before:mr-2 before:content-['⚠']"
                >
                  {issue}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => decide("approve")}
              disabled={busy !== null}
              className="rounded-full bg-secondary-container px-5 py-2 text-label-md font-label-md text-on-secondary-container transition-all hover:scale-95 disabled:opacity-60"
            >
              {busy === "approve" ? "Approving…" : "Approve"}
            </button>
            <button
              onClick={() => decide("reject")}
              disabled={busy !== null}
              className="rounded-full border border-outline-variant px-5 py-2 text-label-md font-label-md text-on-surface-variant transition-all hover:border-error hover:text-error disabled:opacity-60"
            >
              {busy === "reject" ? "Rejecting…" : "Reject"}
            </button>
            {error && (
              <span className="text-label-sm text-error">{error}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
