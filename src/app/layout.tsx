import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { CartProvider } from "@/lib/cart";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import CartDrawer from "@/components/store/CartDrawer";
import { getActiveCategories } from "@/lib/catalog";
import { store } from "@/lib/store";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(store.url),
  title: {
    default: `${store.name} — ${store.tagline}`,
    template: `%s · ${store.name}`,
  },
  description: store.promise,
  keywords:
    "beauty tools, wellness, LED face mask, ice globes, gua sha, skincare devices, self-care, recovery, viral beauty",
  authors: [{ name: store.name }],
  openGraph: {
    title: `${store.name} — ${store.tagline}`,
    description: store.promise,
    type: "website",
    url: store.url,
    siteName: store.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${store.name} — ${store.tagline}`,
    description: store.promise,
  },
  robots: { index: true, follow: true },
};

const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: store.name,
  description: store.promise,
  url: store.url,
  email: store.email,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const categories = await getActiveCategories();
  const navCategories = categories.map((c) => ({ key: c.key, label: c.label }));

  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-ink text-mist antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
        />
        <CartProvider>
          <Navbar categories={navCategories} />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
