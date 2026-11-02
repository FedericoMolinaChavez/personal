import ServiceLanding from "@/components/ServiceLanding";
import { marketingMetadata } from "@/lib/marketing/metadata";

export const metadata = marketingMetadata(
  "Fractional CTO for Founders",
  "Senior technical guidance for founders making product, architecture and delivery decisions. Explore fractional CTO support with Federico Molina Chavez.",
  "/fractional-cto",
);

export default function FractionalCTOPage() {
  return <ServiceLanding
    service="fractional-cto"
    title="Make the next technical decision with a partner."
    introduction="You know the business you want to build. I help you decide what to build first, how to approach it and where to spend your engineering effort, with technical leadership that connects the product to the business."
    summary="Senior technical help, shaped around your business."
    audience="For founders who need a technical partner to shape a roadmap, work with a development team or make sense of a growing product."
    secondaryLabel="See how I can help"
    deliverables={[
      "A roadmap grounded in priorities and constraints.",
      "Clear reasoning behind technical decisions.",
      "An agreed rhythm for delivery and review.",
    ]}
    scopeTitle="Keep the technology moving with the business."
    scope={[
      { title: "Know what to build next", body: "Translate goals into a practical roadmap. Define what the first useful version needs, what can wait and how the team will know a milestone is complete." },
      { title: "Choose technology with a reason", body: "Work through architecture, build-or-buy decisions and where AI is useful. Understand the tradeoffs in cost, complexity and maintainability before committing." },
      { title: "Give delivery a clear direction", body: "Support planning and technical reviews with your team or vendors. Surface risks early and keep technical work connected to the agreed priorities." },
      { title: "Plan the support your team needs", body: "Clarify ownership, technical hiring needs and gaps in the delivery process. Agree where advice, leadership or hands-on development will make the most difference." },
    ]}
    process={[
      { title: "Talk through the situation", body: "Start with your product, team, business priorities and the decisions holding you up. The first 15-minute conversation is free." },
      { title: "Agree the arrangement", body: "Define responsibilities, availability, meeting cadence, deliverables and fee in writing. Make the boundary between leadership and hands-on work clear." },
      { title: "Work, review and adjust", body: "Build a working rhythm with explicit priorities and regular reviews. Revisit the scope as the product and team evolve." },
    ]}
    faqs={[
      { title: "What does fractional CTO mean?", body: "Senior technical leadership for an agreed portion of time, rather than a full-time hire. The responsibilities and availability depend on what your business needs." },
      { title: "Will you write code or manage my developers?", body: "We decide that in the scope. Architecture, planning, team guidance and hands-on development are different responsibilities; the agreement makes clear which are included." },
      { title: "What does it cost?", body: "Pricing follows the responsibilities and time commitment we agree. The initial call is free, and you receive a proposal before starting an engagement." },
      { title: "Can I start with a smaller engagement?", body: "Yes. The build-plan engagement is a way to clarify the scope and roadmap before deciding on a longer working arrangement. We can discuss whether it fits your situation on the call." },
    ]}
  />;
}
