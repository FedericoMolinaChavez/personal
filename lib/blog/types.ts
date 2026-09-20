/**
 * Blog post metadata. Bodies live as React components keyed by slug so we can
 * ship typed, design-system prose without adding an MDX pipeline yet.
 *
 * To add a post:
 * 1. Append a BlogPost entry here (via posts.ts).
 * 2. Add `components/blog/articles/<slug>.tsx` and register it in the body map
 *    on `app/(marketing)/blog/[slug]/page.tsx`.
 * 3. Sitemap picks it up from getAllPosts() automatically.
 */
export type BlogPost = {
  slug: string;
  title: string;
  /** Plain-text SEO / social description (~150–160 chars). */
  description: string;
  /** ISO date (YYYY-MM-DD). Used for sitemap lastmod and JSON-LD. */
  publishedAt: string;
  /** ISO date when the article was last substantively revised. */
  updatedAt?: string;
  /** Approximate reading time; keep honest — used in the UI, not schema. */
  readingMinutes: number;
  keywords?: string[];
};
