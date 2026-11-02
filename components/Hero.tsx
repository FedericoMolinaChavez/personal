import Link from "next/link";
import ScheduleCallButton from "./ScheduleCallButton";

export default function Hero() {
  return (
    <section className="py-20 md:py-28 flex flex-col items-start gap-8">
      <h1 className="font-display text-[44px] sm:text-[60px] md:text-[80px] leading-[1.08] text-on-background max-w-5xl tracking-[-0.03em]">
        A clearer path from <span className="text-primary italic">AI ambition</span> to a working product.
      </h1>
      <p className="text-body-lg text-on-surface-variant max-w-2xl">
        I&apos;m Federico, a fractional CTO and AI developer. I help founders make better technical decisions and engineering teams build AI systems they can operate with confidence.
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <ScheduleCallButton href="#booking" />
        <Link href="#services" className="button-secondary">Find the right engagement</Link>
      </div>
      <p className="text-sm text-on-surface-variant">Bring the problem, the product, or the idea. We&apos;ll work out the next step together.</p>
      <div className="mt-6 pt-7 border-t border-outline-variant w-full">
        <p className="text-sm text-on-surface-variant mb-4">Products I&apos;ve built or helped build</p>
        <div className="flex flex-wrap gap-x-8 gap-y-3 font-display text-xl md:text-2xl">
          <a href="https://www.getattribute.ai" className="hover:text-primary">Attribute.ai</a>
          <a href="https://www.thenomadhub.xyz" className="hover:text-primary">The Nomad Hub</a>
          <a href="https://www.annise.io" className="hover:text-primary">Annise</a>
        </div>
      </div>
    </section>
  );
}
