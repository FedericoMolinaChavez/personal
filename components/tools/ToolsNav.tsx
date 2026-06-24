import Link from "next/link";

const toolLinks = [
  { href: "/tools/spray", label: "Spray Records" },
  { href: "/tools/agronomy", label: "Agronomy Assistant" },
  { href: "/tools/fields", label: "Field Dashboard" },
];

/** Shared navigation for the /tools shell. */
export default function ToolsNav() {
  return (
    <header className="w-full sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/40">
      <nav className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center h-16">
        <div className="flex items-center gap-6">
          <Link
            href="/tools"
            className="font-display text-headline-md font-extrabold text-primary"
          >
            Ag Tools
          </Link>
          <div className="hidden md:flex items-center gap-5">
            {toolLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-md text-label-md"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <Link
          href="/"
          className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-md text-label-md"
        >
          ← Back to site
        </Link>
      </nav>
    </header>
  );
}
