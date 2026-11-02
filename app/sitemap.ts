import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://federicomolina.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    ...["/ai-systems-audit", "/fractional-cto", "/scorecard"].map((path) => ({
      url: `${baseUrl}${path}`, changeFrequency: "monthly" as const, priority: 0.8,
    })),
  ];
}
