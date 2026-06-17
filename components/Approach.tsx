import Image from "next/image";

export default function Approach() {
  return (
    <section
      id="approach"
      className="py-24 bg-surface-container-low rounded-3xl px-margin-mobile md:px-margin-desktop mt-24 soil-shadow overflow-hidden relative scroll-mt-24 reveal"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-8 order-2 md:order-1">
          <h2 className="font-display text-display text-on-surface leading-tight">
            Your Strategic Partner.
          </h2>
          <div className="flex flex-col gap-6 font-body-lg text-body-lg text-on-surface-variant">
            <p>
              I&apos;m not just a programmer. I&apos;m the architect who
              understands the balance between technical feasibility and return on
              investment.
            </p>
            <p>
              From MVP conception to scalable infrastructure, I work side by side
              with you to make sure every line of code contributes to the success
              of the business.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="px-6 py-3 bg-surface-container-highest rounded-full font-label-md text-label-md flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                verified
              </span>
              CTO as a Service
            </div>
            <div className="px-6 py-3 bg-surface-container-highest rounded-full font-label-md text-label-md flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                psychology
              </span>
              AI Architecture
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative w-full max-w-md aspect-square">
            <div className="absolute -inset-4 bg-tertiary-fixed rounded-full blur-3xl opacity-30 animate-pulse" />
            <Image
              src="/portrait.jpg"
              alt="Portrait of a modern tech founder"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover rounded-2xl soil-shadow border-4 border-surface"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
