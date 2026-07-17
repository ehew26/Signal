import type { Metadata } from "next";
import { store } from "@/lib/store";
import LegalPage from "@/components/store/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Returns",
  description: `The terms of sale, shipping, and returns for ${store.name}.`,
};

const sections = [
  {
    h: "Acceptance",
    p: "By using this site or placing an order you agree to these terms. If you do not agree, please do not use the site.",
  },
  {
    h: "Orders & pricing",
    p: "All prices are in USD and shown at checkout before payment. We reserve the right to correct pricing errors and to cancel any order affected by an obvious mistake, with a full refund.",
  },
  {
    h: "Shipping",
    p: `Orders ship within 48 hours. Standard delivery is typically 3–7 business days. Shipping is free on orders over $${(store.freeShippingThreshold / 100).toFixed(0)}; otherwise a flat rate applies, shown at checkout.`,
  },
  {
    h: "30-day glow guarantee",
    p: "Not in love with your purchase? Return unused or gently used items within 30 days for a full refund of the item price. Email us to start a return — we'll make it painless.",
  },
  {
    h: "Warranty",
    p: "Electronic devices carry a 12-month warranty against manufacturing defects. Reach out with your order number and we'll repair or replace covered items.",
  },
  {
    h: "Contact",
    p: `Questions about an order? Email ${store.supportEmail}.`,
  },
];

export default function TermsPage() {
  return <LegalPage title="Terms & Returns" sections={sections} />;
}
