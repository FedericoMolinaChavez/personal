import HireMeButton from "./HireMeButton";

const links = [
  { href: "#work", label: "Work" },
  { href: "#approach", label: "Approach" },
  { href: "#expertise", label: "Expertise" },
  { href: "#offer", label: "Pricing" },
  { href: "#pitch", label: "Pitch Me" },
  { href: "#contact", label: "Contact" },
  { href: "/tools", label: "Tools" },
];

export default function Nav() {
  return (
    <header className="w-full sticky top-0 z-50 bg-surface/80 backdrop-blur-md">
      <nav className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center h-20">
        <a
          href="#top"
          className="font-display text-headline-md font-extrabold text-primary"
        >
          CTO + AI
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-md text-label-md"
            >
              {link.label}
            </a>
          ))}
        </div>
        <HireMeButton className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-label-md text-label-md hover:scale-95 transition-all duration-100 soil-shadow cursor-pointer disabled:opacity-70" />
      </nav>
    </header>
  );
}
