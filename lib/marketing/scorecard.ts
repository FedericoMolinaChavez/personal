export const scorecardGroups = [
  { title: "Failures and recovery", checks: [
    "Model and tool calls have timeouts and bounded retries.",
    "Repeated requests cannot duplicate payments or other important actions.",
    "Interrupted workflows can recover without losing their state.",
    "A failed dependency produces a useful fallback or escalation.",
    "The team has exercised failure scenarios beyond the happy path.",
  ] },
  { title: "Output quality", checks: [
    "A representative evaluation set covers the product's main tasks.",
    "Quality criteria are written down and checked consistently.",
    "Changes to prompts, models and retrieval are checked for regressions.",
    "Low-confidence or unsupported answers have a defined handling path.",
    "Feedback and observed failures inform the evaluation set.",
  ] },
  { title: "Context and retrieval", checks: [
    "Context limits and long conversations have been tested.",
    "Retrieved information is evaluated for relevance and freshness.",
    "Missing or conflicting source material is handled explicitly.",
    "Access controls apply to information retrieved for each user.",
    "Critical answers can be traced to the source information used.",
  ] },
  { title: "Cost and capacity", checks: [
    "Usage and cost can be attributed to a workflow or task.",
    "Token, iteration and tool-call limits prevent unbounded work.",
    "Rate limits and load spikes have an agreed handling strategy.",
    "Cost and latency have been measured on representative workloads.",
    "Unexpected spending or usage changes trigger an alert or limit.",
  ] },
  { title: "Visibility and operations", checks: [
    "A workflow can be followed across model calls and tools.",
    "Logs avoid unnecessary secrets and sensitive personal information.",
    "Alerts have a named owner and a useful response procedure.",
    "Prompts, models and configuration changes can be identified and rolled back.",
    "The team can distinguish service health from output quality.",
  ] },
  { title: "Security and control", checks: [
    "Tool access follows the minimum permissions needed for each task.",
    "External content is treated as untrusted input.",
    "Important actions require the appropriate human approval.",
    "Secrets and private data have explicit handling and retention rules.",
    "The team has tested prompt injection and unintended tool-use scenarios.",
  ] },
] as const;

export type CheckAnswer = "yes" | "no" | "unknown";

export function summarizeScorecard(answers: Record<string, CheckAnswer>) {
  const checks = scorecardGroups.flatMap((group, groupIndex) => group.checks.map((text, checkIndex) => ({ id: `${groupIndex}-${checkIndex}`, text })));
  return {
    total: checks.length,
    confirmed: checks.filter((check) => answers[check.id] === "yes").length,
    gaps: checks.filter((check) => answers[check.id] === "no"),
    unknown: checks.filter((check) => !answers[check.id] || answers[check.id] === "unknown").length,
  };
}
