import type { BlogPost } from "./types";

/**
 * Indexed marketing posts, newest first after sort.
 * Keep descriptions unique and concrete — they become meta + OG copy.
 */
const posts: BlogPost[] = [
  {
    slug: "why-the-demo-passed-and-production-didnt",
    title: "Why the demo passed and production didn’t",
    description:
      "Six failure modes that let vibe-coded AI apps pass a demo and break under real traffic: retries, RAG drift, token spend, missing evals, agent non-convergence, and ordinary app security.",
    publishedAt: "2026-09-20",
    readingMinutes: 7,
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
