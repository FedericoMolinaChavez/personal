import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleLayout from "@/components/blog/ArticleLayout";
import EvalsWithoutTheaterSetArticle from "@/components/blog/articles/evals-without-a-theater-set";
import WhyDemoPassedArticle from "@/components/blog/articles/why-the-demo-passed-and-production-didnt";
import { getAllPosts, getPostBySlug, getPostPath } from "@/lib/blog/posts";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/** Body components keyed by slug. Add an entry when you ship a new post. */
const articleBodies: Record<string, React.ComponentType> = {
  "evals-without-a-theater-set": EvalsWithoutTheaterSetArticle,
  "why-the-demo-passed-and-production-didnt": WhyDemoPassedArticle,
};

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const path = getPostPath(post.slug);
  const title = post.title;
  const description = post.description;

  return {
    title,
    description,
    keywords: post.keywords,
    authors: [{ name: "Federico Molina Chavez" }],
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title,
      description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: ["Federico Molina Chavez"],
      siteName: "Federico Molina",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const Body = articleBodies[slug];

  if (!post || !Body) notFound();

  const path = getPostPath(post.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Person",
      name: "Federico Molina Chavez",
      url: baseUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Federico Molina Chavez",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}${path}`,
    },
    url: `${baseUrl}${path}`,
    image: `${baseUrl}/opengraph-image`,
    keywords: post.keywords?.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleLayout post={post}>
        <Body />
      </ArticleLayout>
    </>
  );
}
