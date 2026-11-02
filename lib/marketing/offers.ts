export function getBuildPlanOffer() {
  const amount = Number(process.env.SERVICE_PRICE_USD || "500");
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("SERVICE_PRICE_USD must be a positive number.");
  const cents = Math.round(amount * 100);
  if (!Number.isSafeInteger(cents) || cents <= 0) throw new Error("SERVICE_PRICE_USD must resolve to a positive whole number of cents.");
  return {
    id: "build-plan" as const,
    name: process.env.SERVICE_NAME || "Build Plan & MVP Sprint",
    cents,
    price: cents / 100,
    formattedPrice: new Intl.NumberFormat("en-US", {
      style: "currency", currency: "USD", maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
    }).format(cents / 100),
    description: "A written build plan plus 3 working sessions, or a basic MVP with scope agreed before work begins. Credited toward a subsequent project if we continue.",
  };
}

export type ServiceId = "general" | "ai-systems-audit" | "fractional-cto" | "build-plan";
