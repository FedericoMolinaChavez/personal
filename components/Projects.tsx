import Image from "next/image";
import Lamp, { LampHint } from "./dive/Lamp";
import { ArrowOut } from "./dive/Icon";
import { BlackCoral, GlassSponge } from "./dive/Specimen";

/**
 * 45 MESOPHOTIC WALL — shipped, and one killed.
 *
 * The work, pinned to the depth each thing sits at, plus the dive log: eight
 * years, five products, and the one he took to market and shut down. The
 * lamp lives here — at this depth the wall reads uniformly blue and healthy
 * until somebody actually puts a light on it.
 */
type Observation = {
  name: string;
  url: string;
  depth: string;
  category: string;
  description: string;
  status: "Live" | "Sunset";
  role: string;
  featured?: boolean;
  art?: "coral" | "coral-b" | "sponge";
};

const observations: Observation[] = [
  {
    name: "Attribute.ai",
    url: "https://www.getattribute.ai",
    depth: "41",
    category: "AI · Marketing attribution",
    description:
      "Multi-touch lead attribution and scoring — tracking that shows which channels actually drive conversions, rather than which ones fired last. Attributes roughly 500,000 leads a month.",
    status: "Live",
    role: "Own product",
    featured: true,
    art: "coral",
  },
  {
    name: "The Nomad Hub",
    url: "https://www.thenomadhub.xyz",
    depth: "44",
    category: "AI · Multi-agent · Case study",
    description:
      "A multi-agent relocation planner: coordinated agents producing a visa, housing and banking plan from a single prompt. Built and shipped solo, then wound down after one paying customer. Still live, as a working case study in the architecture.",
    status: "Sunset",
    role: "Own product",
    featured: true,
    art: "sponge",
  },
  {
    name: "Annise",
    url: "https://www.annise.io",
    depth: "48",
    category: "Fintech · Wealth",
    description:
      "An operating system for modern wealth — consolidating accounts, assets and entities into one AI-assisted view.",
    status: "Live",
    role: "Built / co-built",
  },
  {
    name: "eNotary Log",
    url: "https://www.legal.io/legal-software/3753118/eNotary-Log",
    depth: "52",
    category: "Legal tech · Notary",
    description:
      "Remote online notarisation — identity verification, document upload, and notarisation by in-house notaries.",
    status: "Live",
    role: "Built / co-built",
  },
  {
    name: "LocalSpot AI",
    url: "https://localspot.ai",
    depth: "57",
    category: "AI · Restaurant marketing",
    description:
      "Marketing automation for independent restaurants — capturing guests and bringing them back with SMS and loyalty.",
    status: "Live",
    role: "Built / co-built",
  },
];

function StatusLamp({ status }: { status: Observation["status"] }) {
  const live = status === "Live";
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`block h-1.5 w-1.5 ${live ? "bg-kelp" : "bg-coral"}`}
      />
      <span
        className={`font-data text-[0.5625rem] uppercase tracking-[0.14em] ${
          live ? "text-kelp" : "text-coral"
        }`}
      >
        {status}
      </span>
    </span>
  );
}

function ObservationCard({ o }: { o: Observation }) {
  return (
    <a
      href={o.url}
      target="_blank"
      rel="noopener noreferrer"
      className="module group flex h-full flex-col transition-colors duration-200 hover:border-thermocline/60"
    >
      <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-3">
        <span className="font-data tabular text-[0.5625rem] uppercase tracking-[0.14em] text-snow-faint">
          {o.depth} M · {o.category}
        </span>
        <ArrowOut
          size={15}
          className="shrink-0 text-snow-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-thermocline"
        />
      </div>

      {/* Text and specimen are separate columns, never stacked: line art
          sitting under body copy is noise, not material. */}
      <div
        className={`flex flex-1 gap-4 px-5 ${o.featured ? "py-7" : "py-6"}`}
      >
        <div className="flex-1">
          <h3
            className={`font-display uppercase leading-none text-snow ${
              o.featured ? "text-[2rem] md:text-[2.5rem]" : "text-[1.5rem]"
            }`}
          >
            {o.name}
          </h3>
          <p className="mt-4 max-w-measure font-body text-[0.9375rem] leading-relaxed text-snow-dim">
            {o.description}
          </p>
        </div>

        {o.art && (
          <div
            aria-hidden="true"
            className="hidden w-24 shrink-0 self-start text-thermocline-dim opacity-60 transition-opacity duration-300 group-hover:opacity-90 sm:block md:w-28"
          >
            {o.art === "sponge" ? (
              <GlassSponge className="w-full" />
            ) : (
              <BlackCoral
                className="w-full"
                variant={o.art === "coral-b" ? "b" : "a"}
              />
            )}
          </div>
        )}
      </div>

      <dl className="grid grid-cols-2 border-t border-hairline">
        <div className="px-5 py-3">
          <dt className="font-data text-[0.5rem] uppercase tracking-[0.14em] text-snow-faint">
            Status
          </dt>
          <dd className="mt-1.5">
            <StatusLamp status={o.status} />
          </dd>
        </div>
        <div className="border-l border-hairline px-5 py-3">
          <dt className="font-data text-[0.5rem] uppercase tracking-[0.14em] text-snow-faint">
            Role
          </dt>
          <dd className="mt-1.5 font-data text-[0.5625rem] uppercase tracking-[0.12em] text-snow">
            {o.role}
          </dd>
        </div>
      </dl>
    </a>
  );
}

export default function Projects() {
  const [a, b, ...rest] = observations;

  return (
    <section id="work" className="scroll-mt-16 py-24 md:py-32">
      <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="max-w-[16ch] font-display text-stage uppercase text-snow">
            Five down here. One I turned off
          </h2>
        </div>
        <div className="lg:col-span-7">
          <p className="max-w-measure font-body text-lede text-snow-dim">
            Two of these are my own products, and I shut one of them down after
            a single paying customer. I build, ship and occasionally kill things
            for myself, so what you get is an owner&apos;s judgment rather than
            billable hours.
          </p>
          <LampHint className="mt-4 max-w-measure font-body text-[0.9375rem] text-thermocline">
            At this depth the red end of the spectrum is gone. Move your lamp
            across the wall to see what colour these things actually are.
          </LampHint>
        </div>
      </div>

      {/* The wall itself. It stands BEHIND the observations rather than in a
          band of its own: growing off the ledge line and running up under the
          first row of cards, so it reads as substrate the observations are
          pinned to, not as ornament floating in open water. */}
      <div className="relative mt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 h-56 overflow-hidden md:-top-28 md:h-64"
        >
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 text-thermocline-dim opacity-[0.34]">
            <BlackCoral variant="a" className="w-24 md:w-36" />
            <GlassSponge className="hidden w-14 md:block md:w-20" />
            <BlackCoral variant="b" className="w-32 md:w-48" />
            <GlassSponge className="w-12 md:w-16" />
            <BlackCoral variant="a" className="hidden w-28 md:block md:w-40" />
            <BlackCoral variant="b" className="w-20 md:w-28" />
          </div>
          {/* No ledge rule here: the cards are translucent, so a line drawn at
              the stand's base reads straight through them as a stray rule.
              The clipped bases and the card edges do the grounding. */}
        </div>

        {/* The wall. Chroma drains at this depth; the lamp gives it back. */}
        <Lamp className="relative" radius={320}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <ObservationCard o={a} />
            <ObservationCard o={b} />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            {rest.map((o) => (
              <ObservationCard key={o.name} o={o} />
            ))}
          </div>
        </Lamp>
      </div>

      {/* Named client proof — Cosmo only; no other client metrics invented. */}
      <div className="mt-16 grid grid-cols-1 gap-x-16 gap-y-8 border-t border-hairline pt-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-data text-[0.5625rem] uppercase tracking-[0.14em] text-snow-faint">
            Client work
          </p>
          <h3 className="mt-3 max-w-[16ch] font-display text-[1.75rem] uppercase leading-none text-snow md:text-[2rem]">
            Cosmo
          </h3>
        </div>
        <div className="lg:col-span-7">
          <p className="max-w-measure font-body text-[0.9375rem] leading-relaxed text-snow-dim">
            At{" "}
            <a
              href="https://simplycosmo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-thermocline underline decoration-thermocline/40 hover:decoration-thermocline"
            >
              Cosmo
            </a>
            , classification moved from direct prompts to an agentic system.
            Sustainable-expense classification accuracy went from roughly 70% to
            roughly 95%.
          </p>
          <dl className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-hairline pt-5 font-data text-[0.6875rem] uppercase tracking-[0.14em]">
            <div className="flex items-baseline gap-2.5">
              <dt className="sr-only">
                Sustainable-expense classification accuracy before
              </dt>
              <dd className="flex items-baseline gap-2">
                <span className="tabular text-[1.125rem] leading-none text-snow-faint">
                  ~70
                  <span className="ml-0.5 text-[0.5rem]">%</span>
                </span>
                <span className="text-snow-faint" aria-hidden="true">
                  →
                </span>
                <span className="tabular text-[1.125rem] leading-none text-thermocline">
                  ~95
                  <span className="ml-0.5 text-[0.5rem] text-snow-faint">%</span>
                </span>
              </dd>
            </div>
            <span className="text-snow-faint">
              sustainable-expense classification accuracy
            </span>
          </dl>
        </div>
      </div>

      {/* ---- The dive log: who is actually down here --------------------- */}
      <div
        id="approach"
        className="mt-24 grid scroll-mt-16 grid-cols-1 gap-x-12 gap-y-10 border-t border-hairline pt-16 lg:grid-cols-12"
      >
        <div className="lg:col-span-4">
          <div className="module">
            <div className="flex items-center justify-between gap-4 border-b border-hairline px-4 py-2.5">
              <span className="font-data text-[0.5625rem] uppercase tracking-[0.14em] text-snow-faint">
                Lead diver
              </span>
              <span className="font-data text-[0.5625rem] uppercase tracking-[0.14em] text-kelp">
                Ready
              </span>
            </div>
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/portrait.jpg"
                alt="Federico Molina Chavez"
                fill
                sizes="(max-width: 1024px) 100vw, 380px"
                className="object-cover"
                priority={false}
              />
            </div>
            <dl className="grid grid-cols-2 border-t border-hairline">
              <div className="px-4 py-3">
                <dt className="font-data text-[0.5rem] uppercase tracking-[0.14em] text-snow-faint">
                  Years under
                </dt>
                <dd className="mt-1 font-data tabular text-[0.8125rem] text-snow">
                  08
                </dd>
              </div>
              <div className="border-l border-hairline px-4 py-3">
                <dt className="font-data text-[0.5rem] uppercase tracking-[0.14em] text-snow-faint">
                  Shipped
                </dt>
                <dd className="mt-1 font-data tabular text-[0.8125rem] text-snow">
                  05
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="lg:col-span-8">
          <h3 className="max-w-[18ch] font-display text-[1.75rem] uppercase leading-none text-snow md:text-[2.25rem]">
            I&apos;ve shipped these systems. And killed one
          </h3>
          <div className="mt-6 flex max-w-measure flex-col gap-5 font-body text-prose text-snow-dim">
            <p>
              Eight years building production software, the last stretch of it
              almost entirely on LLM and agent systems — as a fractional CTO
              inside other people&apos;s products, and as the person on the hook
              for my own.
            </p>
            <p>
              That includes a multi-agent product I built solo, took to market,
              and shut down after one paying customer. I&apos;d rather tell you
              which parts of this are genuinely hard than hand you a roadmap
              that assumes none of them are.
            </p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {[
              "Fractional CTO",
              "Agent systems",
              "Evals & tracing",
              "Token cost",
              "App security",
            ].map((tag) => (
              <li
                key={tag}
                className="border border-hairline px-3.5 py-2 font-data text-[0.5625rem] uppercase tracking-[0.14em] text-snow-dim"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
