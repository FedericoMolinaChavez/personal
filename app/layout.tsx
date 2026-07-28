import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

// Monospace for the /tools "Command" theme (numerals + data). Unused by marketing.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const title =
  "Federico Molina — Fractional CTO for AI & agent systems";
const description =
  "I work on LLM and agent systems that pass the demo and break in production: orchestration, context and memory, token cost, failure modes, and the security of the app around them. Fixed prices, published up front.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: title,
    template: "%s · Federico Molina",
  },
  description,
  keywords: [
    "fractional CTO",
    "AI systems architecture audit",
    "AI agents",
    "multi-agent systems",
    "LLM engineering",
    "RAG",
    "LLM evals",
    "AI production reliability",
    "AI consulting",
  ],
  authors: [{ name: "Federico Molina Chavez" }],
  creator: "Federico Molina Chavez",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Federico Molina",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Federico Molina — Fractional CTO for AI & agent systems",
  description,
  url: baseUrl,
  image: `${baseUrl}/opengraph-image`,
  provider: {
    "@type": "Person",
    name: "Federico Molina Chavez",
    jobTitle: "Fractional CTO & AI Systems Architect",
    url: baseUrl,
    sameAs: [
      "https://www.linkedin.com/in/federico-molina-chavez/",
      "https://github.com/FedericoMolinaChavez",
    ],
  },
  areaServed: "Worldwide",
  serviceType: "Fractional CTO & AI systems architecture",
  makesOffer: [
    {
      "@type": "Offer",
      name: "Technical Strategy Session (90 min)",
      description:
        "A focused 90-minute working session on one technical decision, plus a written summary within 48 hours. Credited in full against any engagement booked within 30 days.",
      price: process.env.SERVICE_PRICE_USD || "300",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "AI Systems Architecture Audit",
      description:
        "A two-week fixed-scope review of an existing AI or agent system: architecture and orchestration, context and memory handling, token cost, production failure modes, and security posture. Written report plus a prioritized 90-day roadmap.",
      price: "2500",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Fractional CTO — Monthly Retainer",
      description:
        "Ongoing technical leadership at approximately 20 hours per month: architecture decisions, code and PR review, vendor and hiring evaluation, and hands-on implementation. Cancel with 30 days' notice.",
      price: "4000",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "4000",
        priceCurrency: "USD",
        billingDuration: 1,
        billingIncrement: 1,
        unitCode: "MON",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
