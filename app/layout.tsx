import type { Metadata } from "next";
import { Saira_Condensed, Archivo, Martian_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Display: expedition lettering — condensed, machined, set uppercase.
const saira = Saira_Condensed({
  variable: "--font-saira",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// Body: a quiet grotesk that stays out of the way of the instruments.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

// Data: dive-computer readouts, instrument labels and controls. Never prose.
const martianMono = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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

/**
 * The direction contract for the marketing world. Emitted as a real HTML
 * comment (first child of <body>) so it survives the production build and can
 * be audited against the render. Grep the built output for the seed key.
 */
const DIRECTION_CONTRACT = `<!--
THESIS: A fractional CTO practice as a technical dive down a volcanic island
wall. It refuses the AI-consultancy arrangement of hero plus three icon cards:
here every claim is pinned to the depth it happens at.

OWN-WORLD: Abyssal ink blue deepening by dive stage, chalk-white marine snow,
one thermocline cyan marking the active depth and carrying every primary
action; condensed expedition display, quiet grotesk prose, dive-computer mono
for readouts, labels and controls but never for prose; hairline-boxed modules, 2px radius, no rounded pills.

STORY: Your agents pass in the shallows and fail under pressure. He names the
failure precisely, prices the fix openly, and the visitor books a 15-minute
call.

FIRST VIEWPORT: Sunlit surface with light shafts and rising snow; the depth
rail pinned left at 00 SURFACE; the headline set large across the column; a
filled thermocline "Book a 15-minute call" beside a live depth and gas readout.

FORM: Mesophotic Descent - dealt challenger, user-picked over the assigned
Interlocking; my own grounded list ranked the accident report first.
Seed 83700d5e.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${saira.variable} ${archivo.variable} ${martianMono.variable}`}
    >
      <body className="bg-sea-meso text-snow font-body antialiased">
        <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        <Script id="apollo-tracker" strategy="afterInteractive">
          {`function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");
o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,
o.onload=function(){window.trackingFunctions.onLoad({appId:"6a6c698af0c3b6001087e3bf"})},
document.head.appendChild(o)}initApollo();`}
        </Script>
      </body>
    </html>
  );
}
