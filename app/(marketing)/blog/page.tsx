import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getAllPosts, getPostPath } from "@/lib/blog/posts";

export const metadata: Metadata = {
  title: "From the depth",
  description:
    "Notes on AI and agent systems that pass the demo and break in production: failure modes, measurement, and production readiness.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "From the depth · Federico Molina",
    description:
      "Notes on AI and agent systems that pass the demo and break in production.",
  },
  twitter: {
    card: "summary_large_image",
    title: "From the depth · Federico Molina",
    description:
      "Notes on AI and agent systems that pass the demo and break in production.",
  },
  robots: { index: true, follow: true },
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <span id="top" />
      <Nav />
      <main className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="flex max-w-3xl flex-col gap-12 py-24">
          <header className="flex flex-col gap-5">
            <span className="font-data text-[0.5625rem] uppercase tracking-[0.16em] text-primary">
              From the depth
            </span>
            <h1 className="font-display text-headline-lg text-on-background md:text-[48px]">
              Notes from below the thermocline
            </h1>
            <p className="max-w-measure font-body-lg text-body-lg text-on-surface-variant">
              Concrete failure modes in AI and agent systems — what shows up
              after the demo, and what to measure before blaming the model.
            </p>
          </header>

          <ol className="border-t border-outline-variant/40">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="border-b border-outline-variant/40 py-8"
              >
                <Link
                  href={getPostPath(post.slug)}
                  className="group flex flex-col gap-3"
                >
                  <p className="font-data text-[0.5625rem] uppercase tracking-[0.14em] text-on-surface-variant">
                    {formatDate(post.publishedAt)}
                    <span aria-hidden="true"> · </span>
                    {post.readingMinutes} min
                  </p>
                  <h2 className="font-display text-headline-md text-on-background transition-colors group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="max-w-measure font-body-md text-body-md text-on-surface-variant">
                    {post.description}
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </main>
      <Footer />
    </>
  );
}
