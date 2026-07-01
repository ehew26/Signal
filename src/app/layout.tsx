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
    default: "Vertex AI — AI Receptionist & Automation for Small Businesses",
    template: "%s · Vertex AI",
  },
  description:
    "Vertex AI sets up a 24/7 AI receptionist for small businesses across the USA — answering every call and text, capturing leads, and booking jobs automatically. Done for you, live in days.",
  keywords:
    "AI receptionist, AI answering service, missed call text back, lead capture automation, appointment booking AI, small business automation, AI phone answering, follow-up automation",
  authors: [{ name: "Vertex AI" }],
  openGraph: {
    title: "Vertex AI — AI Receptionist for Small Businesses",
    description:
      "Never miss another call. Vertex AI answers, captures, and books your leads 24/7 — done for you, live in days.",
    type: "website",
    url: SITE_URL,
    siteName: "Vertex AI",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vertex AI — AI Receptionist for Small Businesses",
    description: "Never miss another call. Vertex answers, captures, and books your leads 24/7.",
  },
  robots: { index: true, follow: true },
};

// Structured data — helps Vertex surface as a real service business in search.
// Uses the centralized company contact details. Serves the whole USA.
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: company.name,
  description:
    "AI receptionist, lead capture, booking, and follow-up automation for small businesses.",
  url: SITE_URL,
  telephone: company.phone,
  email: company.email,
  areaServed: { "@type": "Country", name: "United States" },
  address: {
    "@type": "PostalAddress",
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
