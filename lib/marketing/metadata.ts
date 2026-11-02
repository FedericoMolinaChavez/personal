import type { Metadata } from "next";

export function marketingMetadata(title: string, description: string, path: string): Metadata {
  return {
    title, description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: "CTO + AI", title, description, url: path },
    twitter: { card: "summary_large_image", title, description },
  };
}
