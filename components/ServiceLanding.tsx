import Link from "next/link";
import Nav from "./Nav";
import Footer from "./Footer";
import BookingSection from "./BookingSection";
import ScheduleCallButton from "./ScheduleCallButton";
import type { ServiceId } from "@/lib/marketing/offers";

type Item = { title: string; body: string };
type Props = {
  service: ServiceId;
  title: string;
  introduction: string;
  summary: string;
  audience: string;
  scopeTitle: string;
  scope: Item[];
  deliverables: string[];
  process: Item[];
  faqs: Item[];
  secondaryLabel: string;
};

export default function ServiceLanding(props: Props) {
  return (
    <>
      <Nav focused service={props.service} />
      <main id="main-content" className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <section className="grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-20 items-start py-20 md:py-28">
          <div>
            <h1 className="font-display text-[44px] sm:text-[60px] lg:text-[68px] leading-[1.08] tracking-[-0.03em] mb-7">{props.title}</h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mb-8">{props.introduction}</p>
            <div className="flex flex-col items-start gap-4">
              <ScheduleCallButton href="#booking" service={props.service} label="Book a 15-minute scoping call" />
              <Link href="#scope" className="py-2 text-primary underline underline-offset-4">{props.secondaryLabel}</Link>
            </div>
            <p className="text-sm text-on-surface-variant mt-5">Free initial conversation. Scope and fee agreed before any work begins.</p>
          </div>
          <aside className="bg-surface-container rounded-xl p-7 md:p-10 lg:mt-3">
            <h2 className="font-display text-2xl mb-5">{props.summary}</h2>
            <p className="text-on-surface-variant mb-7">{props.audience}</p>
            <h3 className="font-semibold mb-3">What you leave with</h3>
            <ul className="space-y-3 list-disc pl-5 text-on-surface-variant">{props.deliverables.map((item) => <li key={item}>{item}</li>)}</ul>
          </aside>
        </section>

        <section id="scope" className="py-16 md:py-24 scroll-mt-24 border-t border-outline-variant">
          <div className="grid md:grid-cols-[1fr_1.5fr] gap-10 md:gap-20">
            <h2 className="font-display text-4xl md:text-5xl">{props.scopeTitle}</h2>
            <div className="divide-y divide-outline-variant">{props.scope.map((item) => (
              <div key={item.title} className="py-6 first:pt-0 last:pb-0"><h3 className="font-display text-2xl mb-3">{item.title}</h3><p className="text-on-surface-variant max-w-2xl">{item.body}</p></div>
            ))}</div>
          </div>
        </section>

        <section className="py-16 md:py-24 border-t border-outline-variant">
          <h2 className="font-display text-4xl md:text-5xl mb-10">A clear process, from the first conversation.</h2>
          <ol className="grid md:grid-cols-3 gap-10 list-decimal pl-5">{props.process.map((item) => (
            <li key={item.title} className="pl-2"><h3 className="font-display text-2xl mb-3">{item.title}</h3><p className="text-on-surface-variant">{item.body}</p></li>
          ))}</ol>
        </section>

        <section className="bg-surface-container-low rounded-xl p-7 md:p-12 my-8">
          <h2 className="font-display text-3xl mb-4">Product work behind the advice.</h2>
          <p className="text-on-surface-variant text-body-lg max-w-3xl mb-5">My portfolio includes work on Attribute.ai, an AI marketing attribution product, and The Nomad Hub, an AI relocation planner. Explore the products and their context in my selected work.</p>
          <Link href="/#work" className="text-primary font-semibold underline underline-offset-4 inline-block py-2">See selected work</Link>
        </section>

        <section className="py-16 md:py-24">
          <h2 className="font-display text-4xl md:text-5xl mb-10">Before we start.</h2>
          <div className="max-w-3xl divide-y divide-outline-variant border-y border-outline-variant">{props.faqs.map((item) => (
            <details key={item.title} className="py-5"><summary className="font-semibold text-lg py-2">{item.title}</summary><p className="text-on-surface-variant pt-3 pb-2 leading-relaxed">{item.body}</p></details>
          ))}</div>
        </section>
        <BookingSection service={props.service} title="Start with the problem you want to solve." />
      </main>
      <Footer />
    </>
  );
}
