import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signal — Find Someone Real",
  description: "Five curated matches every Monday. 100% verified. Voice-first profiles. Local to Sarasota-Manatee.",
  keywords: "dating app, Sarasota, local dating, verified dating, voice profiles",
  openGraph: {
    title: "Signal — Find Someone Real",
    description: "Five curated matches every Monday. 100% verified. Voice-first profiles. Local to Sarasota-Manatee.",
    type: "website",
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
