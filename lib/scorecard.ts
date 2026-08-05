/**
 * Production Readiness Scorecard — content and scoring.
 *
 * Pure data and pure functions, no React, so the client component and
 * app/api/scorecard/route.ts can both import it. The API route recomputes the
 * score from the submitted check ids rather than trusting a number sent by the
 * browser, which only works because the source of truth lives here.
 *
 * Check ids are the wire format. Never renumber one — a stored or in-flight
 * submission would silently score against a different question.
 */

export type Check = {
  id: string;
  label: string;
};

export type Pillar = {
  id: string;
  name: string;
  /** Material Symbols ligature. */
  icon: string;
  /** One line on why this looks different for an AI app than for normal SaaS. */
  surface: string;
  checks: Check[];
};

export const pillars: Pillar[] = [
  {
    id: "security",
    name: "Security constraints",
    icon: "encrypted",
    surface:
      "Most AI incidents aren't model failures. They're unprotected endpoints shipped fast.",
    checks: [
      {
        id: "sec-1",
        label:
          "No provider API key is reachable from the browser — every model call goes through your own server.",
      },
      {
        id: "sec-2",
        label:
          "Every endpoint that triggers a model call checks auth and authorization server-side, not just in the UI.",
      },
      {
        id: "sec-3",
        label:
          "Tools the model can call are scoped to least privilege — no broad filesystem, database, or admin API access.",
      },
      {
        id: "sec-4",
        label:
          "Every package an AI assistant added was verified to exist and be the one you meant.",
      },
      {
        id: "sec-5",
        label:
          "Secret scanning runs in CI, and any key that was ever committed has been rotated.",
      },
    ],
  },
  {
    id: "contracts",
    name: "Data contracts",
    icon: "schema",
    surface:
      "Model output is free text by default. Without a contract, downstream code either breaks loudly or accepts garbage quietly.",
    checks: [
      {
        id: "dc-1",
        label:
          "Model output is constrained by a schema — structured outputs, tool calling, or validation — not parsed out of prose.",
      },
      {
        id: "dc-2",
        label:
          "Malformed or partial output has a defined path: retry, fall back, or reject.",
      },
      {
        id: "dc-3",
        label:
          "Anything the output flows into — database writes, other services, other agents — has a versioned schema.",
      },
      {
        id: "dc-4",
        label:
          "A test fails loudly when a prompt or model change breaks the output shape.",
      },
      {
        id: "dc-5",
        label:
          "Model-generated text is treated as untrusted at every boundary it crosses.",
      },
    ],
  },
  {
    id: "injection",
    name: "Prompt injection protection",
    icon: "shield_lock",
    surface:
      "Applies to any app that feeds external content into a prompt that also has access to actions or data.",
    checks: [
      {
        id: "pi-1",
        label:
          "System instructions and untrusted content are separated structurally, not concatenated into one string.",
      },
      {
        id: "pi-2",
        label:
          "If an injection succeeded, it still couldn't do real damage — privileges are bounded independently of the prompt.",
      },
      {
        id: "pi-3",
        label:
          "Anything the model writes back to users or systems passes an output check before it lands.",
      },
      {
        id: "pi-4",
        label:
          "Tool-call patterns are logged, and something would notice an anomalous sequence.",
      },
      {
        id: "pi-5",
        label:
          "Known injection payloads run against the real pipeline as test cases, not tried by hand against the base model.",
      },
    ],
  },
  {
    id: "limits",
    name: "Rate limiting",
    icon: "speed",
    surface:
      "A model call costs orders of magnitude more than a CRUD request, so the blast radius of a missing limit is proportionally larger.",
    checks: [
      {
        id: "rl-1",
        label:
          "Per-user and per-IP limits on every endpoint that triggers a model call.",
      },
      {
        id: "rl-2",
        label:
          "Expensive operations — long context, agent loops, tool chains — have their own tighter limits.",
      },
      {
        id: "rl-3",
        label:
          "Provider 429s are handled with backoff or queueing, not surfaced as a raw error.",
      },
      {
        id: "rl-4",
        label: "A kill switch can stop a runaway loop without a deploy.",
      },
      {
        id: "rl-5",
        label:
          "Every limit is enforced server-side; nothing depends on the client behaving.",
      },
    ],
  },
  {
    id: "tokenomics",
    name: "Tokenomics",
    icon: "payments",
    surface:
      "The pillar that doesn't fail loudly. It just quietly makes the product unprofitable.",
    checks: [
      {
        id: "tk-1",
        label:
          "You know your cost per request or per user action as a measured number, not an estimate.",
      },
      {
        id: "tk-2",
        label:
          "Context sent per call is bounded — you're not re-sending unbounded history.",
      },
      {
        id: "tk-3",
        label: "Repeated or near-identical prompts hit a cache.",
      },
      {
        id: "tk-4",
        label:
          "Cheap models handle routing and classification; the expensive model is reserved for work that needs it.",
      },
      {
        id: "tk-5",
        label:
          "Token spend is monitored with an alert, and there is a defined ceiling with defined behaviour at the ceiling.",
      },
    ],
  },
  {
    id: "scaling",
    name: "Horizontal and vertical scaling",
    icon: "stacks",
    surface:
      "Model calls take seconds, not milliseconds. Scaling assumptions carried over from normal web apps don't hold.",
    checks: [
      {
        id: "sc-1",
        label:
          "Model calls are non-blocking — one slow request doesn't stall others.",
      },
      {
        id: "sc-2",
        label:
          "App servers are stateless; session and agent state lives outside process memory.",
      },
      {
        id: "sc-3",
        label:
          "Long-running or agentic work runs on a queue, not on a held-open HTTP connection.",
      },
      {
        id: "sc-4",
        label:
          "The database and vector store have a scaling plan separate from the app servers.",
      },
      {
        id: "sc-5",
        label:
          "The system has been load tested under realistic concurrency, not single-user demo conditions.",
      },
    ],
  },
];

export const TOTAL_CHECKS = pillars.reduce(
  (sum, pillar) => sum + pillar.checks.length,
  0,
);

/** Every valid check id, for rejecting anything a client makes up. */
export const checkIds: ReadonlySet<string> = new Set(
  pillars.flatMap((pillar) => pillar.checks.map((check) => check.id)),
);

export type Band = {
  id: string;
  /** Inclusive lower bound, as a whole percentage. */
  min: number;
  name: string;
  verdict: string;
};

/**
 * Bands from the brief. With 30 checks the boundaries land on whole checks:
 * 12/30 is exactly 40%, 21/30 is exactly 70%.
 */
export const bands: Band[] = [
  {
    id: "demo",
    min: 0,
    name: "Demo stage",
    verdict:
      "It runs. That is the only thing that has been established. Most of what's missing here doesn't fail until there's real traffic, and then it tends to fail all at once.",
  },
  {
    id: "fragile",
    min: 40,
    name: "Fragile in production",
    verdict:
      "The obvious things are handled. What's left are the failures that show up under load, under cost pressure, or under someone actively poking at it.",
  },
  {
    id: "ready",
    min: 70,
    name: "Production ready",
    verdict:
      "The structural work is done. What remains is operational: keeping these true as the system changes.",
  },
];

export type PillarScore = {
  id: string;
  name: string;
  score: number;
  total: number;
};

export type ScoreResult = {
  score: number;
  total: number;
  /** Whole percentage, rounded down so a band is never entered early. */
  pct: number;
  band: Band;
  perPillar: PillarScore[];
  /** Pillars scoring 0 or 1 out of 5 — the part worth acting on first. */
  weakest: PillarScore[];
};

export function bandFor(pct: number): Band {
  // Bands are ordered ascending; the last one whose floor we've cleared wins.
  let match = bands[0];
  for (const band of bands) {
    if (pct >= band.min) match = band;
  }
  return match;
}

/**
 * Scores a set of checked ids. Unknown ids are ignored rather than rejected,
 * so a stale client can never inflate a total.
 */
export function scoreFor(ids: Iterable<string>): ScoreResult {
  const checked = new Set<string>();
  for (const id of ids) {
    if (checkIds.has(id)) checked.add(id);
  }

  const perPillar = pillars.map((pillar) => ({
    id: pillar.id,
    name: pillar.name,
    score: pillar.checks.filter((check) => checked.has(check.id)).length,
    total: pillar.checks.length,
  }));

  const score = checked.size;
  const pct = Math.floor((score / TOTAL_CHECKS) * 100);

  return {
    score,
    total: TOTAL_CHECKS,
    pct,
    band: bandFor(pct),
    perPillar,
    weakest: perPillar.filter((pillar) => pillar.score <= 1),
  };
}
