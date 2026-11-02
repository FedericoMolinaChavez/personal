import Link from "next/link";
import type { Metadata } from "next";
import { getStripe } from "@/lib/stripe";
import PaymentConfirmation from "@/components/PaymentConfirmation";
import { verifyBuildPlanPayment } from "@/lib/marketing/payment";

export const metadata: Metadata = {
  title: "Build plan payment status", robots: { index: false, follow: false },
  alternates: { canonical: "/success" },
};

export default async function SuccessPage({ searchParams }: {
  searchParams: Promise<{ session_id?: string | string[] }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const stripe = getStripe();
  const payment = await verifyBuildPlanPayment(sessionId, stripe
    ? (id) => stripe.checkout.sessions.retrieve(id, {}, { timeout: 10000, maxNetworkRetries: 0 })
    : null);
  const paid = payment.status === "paid" ? payment : null;
  const pending = payment.status === "pending";
  return (
    <main id="main-content" className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop min-h-screen flex flex-col items-start justify-center gap-7 py-20">
      <Link href="/" className="font-display text-2xl text-primary font-bold">CTO + AI</Link>
      <h1 className="font-display text-4xl sm:text-5xl">{paid ? "Your build-plan payment is confirmed." : pending ? "Your payment is still being confirmed." : payment.status === "expired" ? "This checkout has expired." : "Let's check your payment status."}</h1>
      <p className="text-body-lg text-on-surface-variant">
        {paid ? "Thank you. Your engagement payment is received. A calendar booking is a separate step; choose a time so we can agree the scope and schedule."
          : pending ? "Checkout has returned, but payment is not confirmed as paid yet. Check your Stripe receipt before making another payment."
          : "I couldn't verify a completed build-plan payment from this link. Check your Stripe receipt or email me for help before trying to pay again."}
      </p>
      {paid && <PaymentConfirmation sessionId={paid.id} amount={paid.amount} currency={paid.currency} attribution={paid.attribution} />}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/#booking" className="button-primary">Choose a time to discuss the plan</Link>
        <a href="mailto:federicomolinachavez@gmail.com" className="button-secondary">Email Federico</a>
      </div>
      <Link href="/" className="text-primary underline underline-offset-4 py-2">Back to home</Link>
    </main>
  );
}
