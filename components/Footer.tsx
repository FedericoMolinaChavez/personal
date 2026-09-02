import { company, tradingNameNotice } from "@/lib/company";

/**
 * The dive log's last page: entity disclosure, contact, and the sounding
 * closing back to zero.
 */
const links = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/federico-molina-chavez/",
  },
  { label: "GitHub", href: "https://github.com/FedericoMolinaChavez" },
  { label: "Email", href: `mailto:${company.supportEmail}` },
  { label: "Scorecard", href: "/scorecard" },
  { label: "Tools", href: "/tools" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-abyss">
      <div className="mx-auto max-w-container-max px-margin-mobile pb-28 pt-14 md:px-margin-desktop xl:pb-16">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <div className="flex flex-col gap-4">
            <span className="font-display text-[1.25rem] font-bold uppercase tracking-[0.02em] text-snow">
              Federico Molina
            </span>
            <p className="max-w-xs font-body text-[0.875rem] leading-relaxed text-snow-dim">
              Fractional CTO and AI systems architect. Fixed prices, published
              up front.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-2.5 sm:grid-cols-3">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="font-data text-[0.625rem] uppercase tracking-[0.14em] text-snow-dim transition-colors hover:text-thermocline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Entity disclosure — connects the trading name to the legal entity on
            the Stripe account, so a charge is never unrecognisable. */}
        <div className="mt-12 flex flex-col gap-1.5 border-t border-hairline pt-6">
          <p className="font-data text-[0.5625rem] uppercase tracking-[0.12em] text-snow-faint">
            {tradingNameNotice}
          </p>
          <p className="font-data text-[0.5625rem] uppercase tracking-[0.12em] text-snow-faint">
            {company.address}
          </p>
          <p className="mt-2 font-data text-[0.5625rem] uppercase tracking-[0.12em] text-snow-faint">
            © {new Date().getFullYear()} — All depths in metres
          </p>
        </div>
      </div>
    </footer>
  );
}
