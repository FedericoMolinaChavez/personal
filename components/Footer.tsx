import { company, tradingNameNotice } from "@/lib/company";

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/federico-molina-chavez/" },
  { label: "GitHub", href: "https://github.com/FedericoMolinaChavez" },
  { label: "Read.cv", href: "#" },
  { label: "Email", href: `mailto:${company.supportEmail}` },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="w-full mt-20 bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="font-display text-headline-md text-primary font-extrabold">
            Federico Molina
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xs text-center md:text-left">
            © {new Date().getFullYear()} Fractional CTO &amp; AI systems
            architect. Fixed prices, published up front.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-body-md text-body-md hover:underline underline-offset-4"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Entity disclosure — connects the trading name to the legal entity on
          the Stripe account, so a charge is never unrecognisable. */}
      <div className="border-t border-outline-variant/40">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6 flex flex-col gap-1 items-center md:items-start text-center md:text-left">
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            {tradingNameNotice}
          </p>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            {company.address}
          </p>
        </div>
      </div>
    </footer>
  );
}
