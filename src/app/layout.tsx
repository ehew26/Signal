import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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
    default: "Vertex AI — AI Automation for Small Businesses",
    template: "%s · Vertex AI",
  },
  description:
    "Vertex AI sets up practical AI for small businesses — a 24/7 assistant that answers customers, captures and follows up with every lead, and books appointments. Done for you, live in days.",
  keywords:
    "AI for small business, AI receptionist, missed call text back, AI chatbot for business, lead capture automation, appointment booking AI, small business automation, AI phone answering",
  authors: [{ name: "Vertex AI" }],
  openGraph: {
    title: "Vertex AI — AI Strategy & Implementation Consulting",
    description:
      "Production-grade AI for ambitious companies. Strategy, custom agents, and automation that move revenue.",
    type: "website",
    url: SITE_URL,
    siteName: "Vertex AI",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vertex AI — AI Strategy & Implementation Consulting",
    description: "Production-grade AI for ambitious companies.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-ink text-mist antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
