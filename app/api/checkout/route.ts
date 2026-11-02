import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getBuildPlanOffer } from "@/lib/marketing/offers";
import { sanitizeAttribution } from "@/lib/marketing/attribution";

export async function POST(request: Request) {
  let payload: { service?: string; attribution?: unknown } = {};
  try {
    const body = await request.text();
    if (body) payload = JSON.parse(body);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error("Invalid payload");
  } catch {
    return NextResponse.json({ error: "Please try the build-plan button again." }, { status: 400 });
  }
  if (payload.service && payload.service !== "build-plan") {
    return NextResponse.json({ error: "This checkout is for the build plan. Please book a scoping call for other services." }, { status: 400 });
  }
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Online checkout is unavailable. Please book a free call or email Federico to arrange the build plan." }, { status: 503 });
  }

  try {
    const offer = getBuildPlanOffer();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://federicomolina.com";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      metadata: { service: offer.id, ...sanitizeAttribution(payload.attribution) },
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd", unit_amount: offer.cents,
          product_data: { name: offer.name, description: offer.description },
        },
      }],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Build-plan checkout failed", err instanceof Error ? err.name : "Unknown error");
    return NextResponse.json({ error: "Checkout could not be opened. Please try again or book a free call." }, { status: 500 });
  }
}
