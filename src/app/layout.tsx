import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://getvertex.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vertex AI — AI Support Automation for B2B SaaS",
    template: "%s · Vertex AI",
  },
  description:
    "Vertex AI builds production-grade support automation for B2B SaaS teams — AI agents grounded in your docs that resolve repetitive tickets accurately and escalate the rest. Live in weeks, not slideware.",
  keywords:
    "AI support automation, B2B SaaS support AI, customer support automation, AI support agent, RAG support assistant, ticket deflection, AI consulting, LLM development",
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
    <html lang="en" className={`${sora.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-ink text-mist antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
