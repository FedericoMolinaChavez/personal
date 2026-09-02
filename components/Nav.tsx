import Link from "next/link";
import ScheduleCallButton from "./ScheduleCallButton";
import { ControlArrow, primaryControl } from "./dive/Instrument";

/**
 * Surface control. Absolute hrefs ("/#work") so these resolve from any route,
 * not just the homepage where the stage anchors live.
 */
const links = [
  { href: "/#break", label: "Failure" },
  { href: "/#expertise", label: "Scope" },
  { href: "/#work", label: "Log" },
  { href: "/#offer", label: "Rates" },
  { href: "/#pitch", label: "Pitch" },
  { href: "/tools", label: "Tools" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-hairline bg-sea-lit/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-container-max items-center justify-between gap-4 px-margin-mobile md:px-margin-desktop">
        <Link
          href="/#top"
          className="flex items-baseline gap-2.5 whitespace-nowrap"
        >
          <span className="font-display text-[1.0625rem] font-bold uppercase tracking-[0.02em] text-snow">
            Federico Molina
          </span>
          <span className="hidden items-center gap-2 font-data text-[0.5625rem] uppercase tracking-[0.16em] text-snow-faint sm:inline-flex">
            <span aria-hidden="true" className="block h-1.5 w-1.5 bg-kelp" />
            Fractional CTO · available
          </span>
        </Link>

        {/* Held to lg: six links plus the wordmark and the control do not fit
            in the 768–1000px band. */}
        <div className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-data text-[0.625rem] uppercase tracking-[0.14em] text-snow-dim transition-colors duration-150 hover:text-thermocline"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <ScheduleCallButton
          label="Book a call"
          className={`${primaryControl} !gap-3 !py-2.5 !text-[0.625rem]`}
        >
          <ControlArrow />
        </ScheduleCallButton>
      </nav>
    </header>
  );
}
