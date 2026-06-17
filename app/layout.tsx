import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const title = "CTO + AI — Fractional CTO & AI Developer for founders";
const description =
  "Tech strategist and AI-focused developer. I help founders navigate technical complexity to scale profitable products with a craftsman's touch.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: title,
    template: "%s · CTO + AI",
  },
  description,
  keywords: [
    "fractional CTO",
    "AI developer",
    "MVP development",
    "LLM engineering",
    "RAG",
    "AI agents",
    "technical co-founder",
    "product strategy",
    "startup CTO",
  ],
  authors: [{ name: "Federico Molina Chavez" }],
  creator: "Federico Molina Chavez",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "CTO + AI",
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
  name: "CTO + AI — Fractional CTO & AI Developer",
  description,
  url: baseUrl,
  image: `${baseUrl}/opengraph-image`,
  provider: {
    "@type": "Person",
    name: "Federico Molina Chavez",
    jobTitle: "Fractional CTO & AI Developer",
    url: baseUrl,
    sameAs: [
      "https://www.linkedin.com/in/federico-molina-chavez/",
      "https://github.com/FedericoMolinaChavez",
    ],
  },
  areaServed: "Worldwide",
  serviceType: "Fractional CTO & AI development",
  makesOffer: {
    "@type": "Offer",
    name: "Build Plan & MVP Sprint",
    description:
      "A written build plan plus 3 working sessions, or a basic MVP if starting from scratch. Credited toward a full project or hourly rate if we continue.",
    price: process.env.SERVICE_PRICE_USD || "500",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={bricolage.variable}>
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
