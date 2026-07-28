/**
 * Legal entity details, in one place.
 *
 * The site trades as "federicomolina.com" but the legal entity on the Stripe
 * account is Nomad Hub Holdings Inc (a DBA / trading-name setup). Stripe and
 * card networks only require that the two are *visibly connected* before money
 * moves — so this disclosure has to appear next to the buy buttons, in the
 * footer, and in the Terms. Keeping it here means one edit updates all three.
 *
 * TODO(federico): registrationState is still a placeholder. It is deliberately
 * not guessed from the mailing address — a company can be incorporated in one
 * state and operate from another, and this value drives the governing-law
 * clause in the Terms.
 */

const TO_FILL = (field: string) => `[${field} — add before publishing]`;

export const company = {
  /** Registered legal name of the entity on the Stripe account. */
  legalName: "Nomad Hub Holdings Inc",
  /** Public-facing trading name customers actually recognise. */
  tradingName: "federicomolina.com",
  /** US state of incorporation — not necessarily the state in `address`. */
  registrationState: TO_FILL("State of incorporation"),
  /** Registered business address, single line. */
  address: "1672 NE 29th St, Pompano Beach, FL 33064, US",
  /** Support / billing contact. */
  supportEmail: "federico@federicomolina.com",
} as const;

/** Short line shown next to every price and checkout button. */
export const paymentProcessorNotice = `Payments processed by ${company.legalName}.`;

/** Footer line connecting the trading name to the legal entity. */
export const tradingNameNotice = `${company.tradingName} is a trading name of ${company.legalName}.`;
