import ServiceLanding from "@/components/ServiceLanding";
import { marketingMetadata } from "@/lib/marketing/metadata";

export const metadata = marketingMetadata(
  "AI Systems Architecture Audit",
  "Understand the reliability risks, cost drivers and architecture decisions in your AI system. Book a free scoping call with Federico Molina Chavez.",
  "/ai-systems-audit",
);

export default function AuditPage() {
  return <ServiceLanding
    service="ai-systems-audit"
    title="Your AI works in a demo. Understand what happens next."
    introduction="An AI systems architecture audit for teams moving toward production, or already dealing with unreliable outputs, fragile workflows and hard-to-explain costs. Turn uncertainty into a practical set of engineering priorities."
    summary="A focused review of your AI system."
    audience="For CTOs and engineering leads with a working prototype or existing AI feature. Bring the architecture, the failure cases and the decisions your team is facing."
    secondaryLabel="See what the audit covers"
    deliverables={[
      "Written findings tied to the agreed review scope.",
      "A prioritized list of risks and recommended changes.",
      "A walkthrough of the findings and next steps.",
    ]}
    scopeTitle="Find the risks worth fixing first."
    scope={[
      { title: "Reliability under real conditions", body: "Review retries, timeouts, duplicate actions, workflow recovery and what happens when dependencies fail. Identify where a system can silently do the wrong thing." },
      { title: "Output quality and evaluation", body: "Examine how you evaluate outputs, retrieve information and manage context. Identify gaps between a convincing example and repeatable behavior on representative inputs." },
      { title: "Costs you can account for", body: "Trace model calls, token usage and expensive workflow paths. Review the limits and visibility needed to understand cost per task." },
      { title: "Visibility and security boundaries", body: "Look at logs, alerts, access to tools and sensitive data, and safeguards around model-driven actions. Agree which areas need a deeper specialist review." },
    ]}
    process={[
      { title: "Scope the review", body: "On the initial call, clarify the system, business impact, access requirements and key questions. Agree a written scope, fee and delivery schedule." },
      { title: "Examine the system", body: "Review the agreed architecture, implementation and available evidence. Discuss findings with the people who operate the system." },
      { title: "Decide what to change", body: "Walk through the report and prioritize the next actions. Implementation can stay with your team or become a separately scoped engagement." },
    ]}
    faqs={[
      { title: "How much does the audit cost?", body: "The fee depends on the system and agreed review depth. We establish a fixed scope and quote after the free scoping conversation, before you commit." },
      { title: "How long does it take?", body: "We agree the delivery schedule after understanding the system and access requirements. There is no universal turnaround for every architecture." },
      { title: "Do I need a production system?", body: "A working prototype approaching launch is also a fit. If you are still shaping the idea, the build-plan engagement may be a better starting point." },
      { title: "Does an audit include implementation or certification?", body: "The audit produces findings and recommendations within its agreed scope. Implementation is separate. It is not a penetration test, compliance certification or a guarantee that all failures have been identified." },
    ]}
  />;
}
