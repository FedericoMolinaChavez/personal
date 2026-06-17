export default function Projects() {
  return (
    <section
      id="work"
      className="grid grid-cols-1 md:grid-cols-12 gap-12 py-12 scroll-mt-24 reveal"
    >
      {/* Project 1: Synapse AI */}
      <div className="md:col-span-7 group cursor-pointer">
        <div className="bg-[#e9dad5] rounded-xl overflow-hidden aspect-[16/10] relative transition-transform duration-500 hover:scale-[0.98]">
          <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-primary/20 to-transparent">
            <div className="flex flex-col gap-2">
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
                AI &amp; Automation
              </span>
              <h3 className="font-display text-headline-lg text-on-primary-fixed">
                Synapse AI
              </h3>
            </div>
          </div>
          <div className="absolute top-12 right-12 opacity-20 group-hover:opacity-40 transition-opacity">
            <span
              className="material-symbols-outlined text-[120px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              neurology
            </span>
          </div>
        </div>
        <div className="mt-6 flex justify-between items-start">
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            Streamlining enterprise workflows with custom autonomous agents.
          </p>
          <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">
            arrow_forward
          </span>
        </div>
      </div>

      {/* Project 2: NomadHub */}
      <div className="md:col-span-5 md:mt-24 group cursor-pointer">
        <div className="bg-[#dce5cc] rounded-xl overflow-hidden aspect-square relative transition-transform duration-500 hover:scale-[0.98]">
          <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-secondary/20 to-transparent">
            <div className="flex flex-col gap-2">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
                Community &amp; SaaS
              </span>
              <h3 className="font-display text-headline-lg text-on-secondary-fixed">
                NomadHub
              </h3>
            </div>
          </div>
          <div className="absolute top-10 right-10 opacity-20 group-hover:opacity-40 transition-opacity">
            <span
              className="material-symbols-outlined text-[80px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              travel_explore
            </span>
          </div>
        </div>
        <div className="mt-6 flex justify-between items-start">
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
            An all-in-one platform for visa management and digital-nomad
            communities.
          </p>
          <span className="material-symbols-outlined text-secondary group-hover:translate-x-2 transition-transform">
            arrow_forward
          </span>
        </div>
      </div>
    </section>
  );
}
