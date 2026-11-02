import Link from "next/link";
import type { Metadata } from "next";
import { getBuildPlanOffer } from "@/lib/marketing/offers";

export const metadata: Metadata = {
  title: "Checkout cancelled", robots: { index: false, follow: false },
  alternates: { canonical: "/cancel" },
};

export default function CancelPage() {
  const offer = getBuildPlanOffer();
  return (
    <main id="main-content" className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop min-h-screen flex flex-col items-start justify-center gap-7 py-20">
      <Link href="/" className="font-display text-2xl text-primary font-bold">CTO + AI</Link>
      <h1 className="font-display text-4xl sm:text-5xl">You left checkout.</h1>
      <p className="text-body-lg text-on-surface-variant">You can review the {offer.formattedPrice} USD build plan or talk through the scope first. If you already attempted payment, check your Stripe receipt before starting another checkout.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/#offer" className="button-primary">Review the build plan</Link>
        <Link href="/#booking" className="button-secondary">Book a free 15-minute call</Link>
      </div>
      <a href="mailto:federicomolinachavez@gmail.com" className="text-primary underline underline-offset-4 py-2">Need help? Email Federico</a>
    </main>
  );
}
