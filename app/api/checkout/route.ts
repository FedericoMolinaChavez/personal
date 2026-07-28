import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const stripe = getStripe();

  // Placeholder mode: no key configured yet.
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Payments are not configured yet. Add STRIPE_SECRET_KEY to enable checkout.",
      },
      { status: 501 },
    );
  }

  const productId = process.env.STRIPE_PRODUCT_ID || "prod_Uy6BWUbniHJ4PF";
  const priceUsd = Number(process.env.SERVICE_PRICE_USD || "300");
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (!Number.isFinite(priceUsd) || priceUsd <= 0) {
    return NextResponse.json(
      { error: "Invalid SERVICE_PRICE_USD configuration." },
      { status: 500 },
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(priceUsd * 100),
            product: productId,
          },
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Stripe checkout failed: ${message}` },
      { status: 500 },
    );
  }
}
