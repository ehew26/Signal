import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
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
    default: "Vertex AI — AI Strategy & Implementation Consulting",
    template: "%s · Vertex AI",
  },
  description:
    "Vertex AI helps ambitious companies ship production-grade AI. From strategy to deployment — custom agents, automation, and LLM systems that move revenue, not slideware.",
  keywords:
    "AI consulting, AI strategy, LLM development, AI automation, custom AI agents, generative AI consulting, enterprise AI, machine learning consulting",
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
      <body className="bg-ink text-mist antialiased">{children}</body>
    </html>
  );
}
