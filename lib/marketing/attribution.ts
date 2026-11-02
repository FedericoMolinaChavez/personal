export const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
export type Attribution = Partial<Record<(typeof campaignKeys)[number] | "source_page", string>>;
const publicPages = ["/", "/ai-systems-audit", "/fractional-cto", "/scorecard"];

// Only campaign identifiers and known public routes belong in marketing events.
// Never copy arbitrary URL parameters, form values or booking payloads.
export function sanitizeAttribution(value: unknown): Attribution {
  if (!value || typeof value !== "object") return {};
  const input = value as Record<string, unknown>;
  const output: Attribution = {};
  for (const key of campaignKeys) {
    const item = input[key];
    if (typeof item === "string" && /^[a-zA-Z0-9_.~-]{1,80}$/.test(item)) output[key] = item;
  }
  if (typeof input.source_page === "string" && publicPages.includes(input.source_page)) output.source_page = input.source_page;
  return output;
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const current = sanitizeAttribution({
    ...Object.fromEntries(new URLSearchParams(window.location.search)), source_page: window.location.pathname,
  });
  try {
    const stored = sanitizeAttribution(JSON.parse(sessionStorage.getItem("consulting-attribution") || "{}"));
    // A new tagged visit in the same session starts a new campaign context.
    const result = Object.keys(current).some((key) => key.startsWith("utm_")) ? current : stored.source_page ? stored : current;
    sessionStorage.setItem("consulting-attribution", JSON.stringify(result));
    return result;
  } catch { return current; }
}
