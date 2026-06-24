import { requireTenant } from "@/lib/shared/auth/dal";
import { approvedRecordsCsv } from "@/lib/spray/records";

/** Download approved spray records as a compliance-ready CSV. */
export async function GET() {
  const { tenantId } = await requireTenant();
  const csv = await approvedRecordsCsv(tenantId);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="spray-records.csv"',
    },
  });
}
