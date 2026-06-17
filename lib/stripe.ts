import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/**
 * Returns a configured Stripe client, or null when STRIPE_SECRET_KEY is not set.
 * This lets the app build and run in "placeholder mode" without payment keys.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}
