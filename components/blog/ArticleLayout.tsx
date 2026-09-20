import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { BlogPost } from "@/lib/blog/types";

type Props = {
  post: BlogPost;
  children: React.ReactNode;
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Shared chrome for long-form marketing posts. Secondary routes use the
 * remapped legacy tokens (same as /scorecard and /terms) so prose stays
 * legible without the homepage depth rail.
 */
export default function ArticleLayout({ post, children }: Props) {
  return (
    <>
      <span id="top" />
      <Nav />
      <main className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <article className="flex max-w-3xl flex-col gap-12 py-24">
          <header className="flex flex-col gap-5">
            <p className="font-data text-[0.5625rem] uppercase tracking-[0.16em] text-primary">
              <Link
                href="/blog"
                className="hover:underline hover:underline-offset-4"
              >
                From the depth
              </Link>
              <span className="text-on-surface-variant"> · Article</span>
            </p>
            <h1 className="font-display text-headline-lg text-on-background md:text-[48px]">
              {post.title}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {post.description}
            </p>
            <p className="font-data text-[0.625rem] uppercase tracking-[0.14em] text-on-surface-variant">
              {formatDate(post.publishedAt)}
              <span aria-hidden="true"> · </span>
              {post.readingMinutes} min read
            </p>
          </header>

          <div className="article-prose flex flex-col gap-6 font-body-md text-body-md text-on-surface-variant">
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
