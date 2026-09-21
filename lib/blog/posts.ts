import type { BlogPost } from "./types";

/**
 * Indexed marketing posts, newest first after sort.
 * Keep descriptions unique and concrete — they become meta + OG copy.
 */
const posts: BlogPost[] = [
  {
    slug: "evals-without-a-theater-set",
    title: "Evals without a theater set",
    description:
      "Manual demo clicks are not an eval suite. How to stand up a small, measurable set that catches regressions before customers do — without vanity dashboards or unmaintainable golden chats.",
    publishedAt: "2026-09-21",
    readingMinutes: 7,
    keywords: [
      "LLM evals",
      "AI evaluation suite",
      "prompt regression testing",
      "RAG evaluation",
      "CI for LLM apps",
      "production AI quality",
      "happy path testing",
    ],
  },
  {
    slug: "why-the-demo-passed-and-production-didnt",
    title: "Why the demo passed and production didn’t",
    description:
      "Six failure modes that let vibe-coded AI apps pass a demo and break under real traffic: retries, RAG drift, token spend, missing evals, agent non-convergence, and ordinary app security.",
    publishedAt: "2026-09-20",
    readingMinutes: 9,
    keywords: [
      "AI production failures",
      "agent idempotency",
      "RAG context drift",
      "LLM token cost",
      "LLM evals",
      "multi-agent orchestration",
      "AI application security",
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0,
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostPath(slug: string): string {
  return `/blog/${slug}`;
}
