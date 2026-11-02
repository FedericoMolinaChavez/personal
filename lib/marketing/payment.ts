import type Stripe from "stripe";
import { sanitizeAttribution, type Attribution } from "./attribution";

type SessionSummary = Pick<Stripe.Checkout.Session, "id" | "mode" | "metadata" | "payment_status" | "amount_total" | "currency" | "status">;
export type PaymentState =
  | { status: "paid"; id: string; amount: number; currency: string; attribution: Attribution }
  | { status: "pending" | "expired" | "unverified" };

export async function verifyBuildPlanPayment(sessionId: unknown, retrieve: ((id: string) => Promise<SessionSummary>) | null): Promise<PaymentState> {
  if (!retrieve || typeof sessionId !== "string" || !/^cs_(test_|live_)?[a-zA-Z0-9]{10,250}$/.test(sessionId)) return { status: "unverified" };
  try {
    const session = await retrieve(sessionId);
    if (session.mode !== "payment" || session.metadata?.service !== "build-plan") return { status: "unverified" };
    if (session.status === "expired") return { status: "expired" };
    if (session.payment_status !== "paid") return { status: "pending" };
    return { status: "paid", id: session.id, amount: (session.amount_total || 0) / 100, currency: session.currency || "usd", attribution: sanitizeAttribution(session.metadata) };
  } catch {
    return { status: "unverified" };
  }
}
