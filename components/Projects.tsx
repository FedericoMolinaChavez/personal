type Project = {
  name: string;
  url: string;
  category: string;
  description: string;
  icon: string;
  bg: string;
  accent: string;
};

const projects: Project[] = [
  {
    name: "Attribute.ai",
    url: "https://www.getattribute.ai",
    category: "AI · Marketing Attribution",
    description:
      "AI-powered lead attribution and scoring — multi-touch tracking that shows which channels actually drive conversions.",
    icon: "query_stats",
    bg: "#e9dad5",
    accent: "text-primary",
  },
  {
    name: "The Nomad Hub",
    url: "https://www.thenomadhub.xyz",
    category: "AI · Relocation",
    description:
      "AI relocation planner for digital nomads — turns a move into a tailored visa, housing and banking plan in one click.",
    icon: "travel_explore",
    bg: "#dce5cc",
    accent: "text-secondary",
  },
  {
    name: "Annise",
    url: "https://www.annise.io",
    category: "Fintech · Wealth",
    description:
      "The OS for modern wealth — consolidates accounts, assets and entities into one AI-powered system.",
    icon: "account_balance",
    bg: "#dfe5cc",
    accent: "text-tertiary",
  },
  {
    name: "eNotary Log",
    url: "https://www.legal.io/legal-software/3753118/eNotary-Log",
    category: "Legal Tech · Notary",
    description:
      "Remote online notarization — verify identity, upload documents and get them notarized by in-house notaries.",
    icon: "gavel",
    bg: "#eae1d7",
    accent: "text-primary",
  },
  {
    name: "LocalSpot AI",
    url: "https://localspot.ai",
    category: "AI · Restaurant Marketing",
    description:
      "Marketing automation for independent restaurants — capture guests and bring them back with SMS and loyalty.",
    icon: "restaurant",
    bg: "#f0e7dd",
    accent: "text-secondary",
  },
];

const featured = projects.slice(0, 2);
const rest = projects.slice(2);

function FeaturedCard({ project, size }: { project: Project; size: "lg" | "md" }) {
  const aspect = size === "lg" ? "aspect-[16/10]" : "aspect-square";
  const pad = size === "lg" ? "p-12" : "p-10";
  const iconSize = size === "lg" ? "text-[120px]" : "text-[80px]";
  const iconPos = size === "lg" ? "top-12 right-12" : "top-10 right-10";
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div
        className={`${aspect} rounded-xl overflow-hidden relative transition-transform duration-500 hover:scale-[0.98]`}
        style={{ backgroundColor: project.bg }}
      >
        <div
          className={`absolute inset-0 ${pad} flex flex-col justify-end bg-gradient-to-t from-primary/10 to-transparent`}
        >
          <div className="flex flex-col gap-2">
            <span
              className={`font-label-sm text-label-sm ${project.accent} uppercase tracking-widest`}
            >
              {project.category}
            </span>
            <h3 className="font-display text-headline-lg text-on-background">
              {project.name}
            </h3>
          </div>
        </div>
        <div
          className={`absolute ${iconPos} opacity-20 group-hover:opacity-40 transition-opacity`}
        >
          <span
            className={`material-symbols-outlined ${iconSize}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {project.icon}
          </span>
        </div>
      </div>
      <div className="mt-6 flex justify-between items-start gap-4">
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          {project.description}
        </p>
        <span className="material-symbols-outlined text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
          arrow_outward
        </span>
      </div>
    </a>
  );
}

function SmallCard({ project }: { project: Project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div
        className="aspect-[4/3] rounded-xl overflow-hidden relative transition-transform duration-500 hover:scale-[0.98]"
        style={{ backgroundColor: project.bg }}
      >
        <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-primary/10 to-transparent">
          <div className="flex flex-col gap-1.5">
            <span
              className={`font-label-sm text-label-sm ${project.accent} uppercase tracking-widest`}
            >
              {project.category}
            </span>
            <h3 className="font-display text-headline-md text-on-background">
              {project.name}
            </h3>
          </div>
        </div>
        <div className="absolute top-8 right-8 opacity-20 group-hover:opacity-40 transition-opacity">
          <span
            className="material-symbols-outlined text-[56px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {project.icon}
          </span>
        </div>
      </div>
      <div className="mt-5 flex justify-between items-start gap-4">
        <p className="font-body-md text-body-md text-on-surface-variant">
          {project.description}
        </p>
        <span className="material-symbols-outlined text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform shrink-0">
          arrow_outward
        </span>
      </div>
    </a>
  );
}

export default function Projects() {
  return (
    <section id="work" className="py-12 scroll-mt-24 reveal">
      <div className="flex flex-col gap-4 mb-16">
        <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
          Selected Work
        </span>
        <h2 className="font-display text-headline-lg md:text-[48px] text-on-background">
          Products I&apos;ve built or helped build.
        </h2>
      </div>

      {/* Featured pair (asymmetric) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-7">
          <FeaturedCard project={featured[0]} size="lg" />
        </div>
        <div className="md:col-span-5 md:mt-24">
          <FeaturedCard project={featured[1]} size="md" />
        </div>
      </div>

      {/* Remaining projects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
        {rest.map((project) => (
          <SmallCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
}
