import type { Metadata } from "next";
import { store } from "@/lib/store";
import LegalPage from "@/components/store/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${store.name} collects, uses, and protects your information.`,
};

const sections = [
  {
    h: "Information we collect",
    p: "We collect information you provide at checkout — name, email, and shipping address — and basic, aggregated analytics about how visitors use our site. Payment details are handled directly by our payment processor (Stripe) and never touch our servers.",
  },
  {
    h: "How we use it",
    p: "We use your information to process and ship your orders, provide support, prevent fraud, and — only if you opt in — send you occasional updates about new drops and restocks. We never sell your personal information.",
  },
  {
    h: "Personalization",
    p: "Our product recommendations are generated on your own device from what you browse. These preferences stay in your browser's local storage and are not uploaded to us or tied to your identity.",
  },
  {
    h: "Data security",
    p: "We use industry-standard measures to protect your data. Checkout runs over encrypted connections and is PCI-compliant via Stripe.",
  },
  {
    h: "Your choices",
    p: "You can unsubscribe from marketing at any time, and you can request access to or deletion of your personal data by emailing us. Clearing your browser storage removes your on-device personalization.",
  },
  {
    h: "Contact",
    p: `Questions about privacy? Email ${store.supportEmail} and we'll help.`,
  },
];

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" sections={sections} />;
}
