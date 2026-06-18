import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { Resend } from "resend";

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 501 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not configured" },
      { status: 501 },
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook verification failed: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerEmail = session.customer_details?.email ?? "unknown";
    const customerName = session.customer_details?.name ?? "someone";
    const amountPaid = session.amount_total != null
      ? `$${(session.amount_total / 100).toFixed(2)}`
      : "unknown amount";

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "notifications@thenomadhub.xyz",
        to: "federicomolinachavez@gmail.com",
        subject: `Payment received: ${amountPaid} from ${customerName}`,
        html: `
          <h2>New payment received!</h2>
          <ul>
            <li><strong>Customer:</strong> ${customerName}</li>
            <li><strong>Email:</strong> ${customerEmail}</li>
            <li><strong>Amount:</strong> ${amountPaid}</li>
            <li><strong>Session ID:</strong> ${session.id}</li>
          </ul>
          <p>View in <a href="https://dashboard.stripe.com/payments/${session.payment_intent}">Stripe dashboard</a>.</p>
        `,
      });
    }
  }

  return NextResponse.json({ received: true });
}
