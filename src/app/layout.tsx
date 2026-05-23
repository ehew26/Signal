import type { Metadata } from "next";
import "./globals.css";

const APP_URL = 'https://signal-date-app.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "Signal — Dating App for Sarasota & Manatee County",
  description: "The only dating app built exclusively for Sarasota-Manatee, FL. Five curated, verified matches every Monday. Voice profiles. No swiping. 150 founding spots.",
  keywords: "dating app Sarasota, Sarasota dating, Manatee dating, Bradenton dating, local dating Florida, dating app Florida, Lakewood Ranch singles, Sarasota singles, Signal dating",
  authors: [{ name: "Signal" }],
  openGraph: {
    title: "Signal — Dating App for Sarasota & Manatee",
    description: "The only dating app built exclusively for Sarasota-Manatee. Five verified matches every Monday. 150 founding spots.",
    type: "website",
    url: APP_URL,
    siteName: "Signal",
    locale: "en_US",
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Signal — Find Someone Real' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Signal — Dating App for Sarasota & Manatee",
    description: "The only dating app built exclusively for Sarasota-Manatee. Five verified matches every Monday. 150 founding spots.",
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-cream antialiased">
        {children}
      </body>
    </html>
  );
}
