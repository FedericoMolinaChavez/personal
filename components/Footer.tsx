const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/federico-molina-chavez/" },
  { label: "GitHub", href: "https://github.com/FedericoMolinaChavez" },
  { label: "Read.cv", href: "#" },
  { label: "Email", href: "mailto:federicomolinachavez@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="w-full mt-20 bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="font-display text-headline-md text-primary font-extrabold">
            CTO + AI
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xs text-center md:text-left">
            © {new Date().getFullYear()} Fractional CTO &amp; AI Developer. Built
            with intentionality.
          </p>
        </div>
        <div className="flex gap-8">
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
    </footer>
  );
}
