import type { Metadata } from "next";
import PageShell, { PageHeader } from "@/components/site/PageShell";
import Reveal from "@/components/Reveal";
import BillingPortalForm from "@/components/site/BillingPortalForm";

export const metadata: Metadata = {
  title: "Manage billing",
  description:
    "Update your payment method, change your plan, or cancel your Vertex AI subscription — entirely self-serve.",
  robots: { index: false },
};

export default function BillingPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Billing"
        title={
          <>
            Manage your <span className="gradient-text">subscription</span>
          </>
        }
        sub="Update your card, switch plans, or cancel anytime. Enter the email you used at checkout to open your secure billing portal."
      />

      <section className="px-5 pb-28 sm:px-8">
        <div className="mx-auto max-w-md">
          <Reveal>
            <BillingPortalForm />
          </Reveal>
          <Reveal className="mt-6 text-center">
            <p className="text-xs text-mist-faint">
              Payments are processed securely by Stripe. We never see or store your card details.
            </p>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
