import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import ChatWidget from "@/components/site/ChatWidget";
import { company } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://getvertex.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vertex AI — AI Receptionist & Automation for Tampa Home-Service Businesses",
    template: "%s · Vertex AI",
  },
  description:
    "Tampa-based Vertex AI sets up a 24/7 AI receptionist for local home-service businesses — answering every call and text, capturing leads, and booking jobs automatically. Done for you, live in days.",
  keywords:
    "AI receptionist Tampa, AI answering service Tampa FL, missed call text back, HVAC lead capture, plumber answering service, roofing lead automation, home services AI, appointment booking AI, small business automation Tampa",
  authors: [{ name: "Vertex AI" }],
  openGraph: {
    title: "Vertex AI — AI Receptionist for Tampa Home-Service Businesses",
    description:
      "Never miss another call. Vertex AI answers, captures, and books your leads 24/7 — done for you, live in days.",
    type: "website",
    url: SITE_URL,
    siteName: "Vertex AI",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vertex AI — AI Receptionist for Tampa Home-Service Businesses",
    description: "Never miss another call. Vertex answers, captures, and books your leads 24/7.",
  },
  robots: { index: true, follow: true },
};

// LocalBusiness structured data — helps Vertex surface as a real Tampa business
// in search and maps. Uses the centralized company contact details.
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: company.name,
  description:
    "AI receptionist, lead capture, booking, and follow-up automation for local home-service businesses.",
  url: SITE_URL,
  telephone: company.phone,
  email: company.email,
  areaServed: [
    { "@type": "City", name: "Tampa" },
    { "@type": "AdministrativeArea", name: "Tampa Bay" },
    { "@type": "State", name: "Florida" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tampa",
    addressRegion: "FL",
    addressCountry: "US",
  },
  priceRange: "$$",
  sameAs: [company.social.linkedin, company.social.x],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-ink text-mist antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {children}
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}
