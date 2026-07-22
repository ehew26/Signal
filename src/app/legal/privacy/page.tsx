import type { Metadata } from "next";
import PageShell, { PageHeader } from "@/components/site/PageShell";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Vertex AI collects, uses, and protects your information.",
};

const sections = [
  {
    h: "Information we collect",
    p: "We collect information you provide directly — such as your name, email, company, and message when you contact us — and basic, aggregated analytics about how visitors use our site. We do not sell personal information.",
  },
  {
    h: "How we use it",
    p: "We use your information to respond to inquiries, deliver and improve our services, and communicate about engagements you've requested. Client data handled during an engagement is governed by the terms of that engagement's agreement.",
  },
  {
    h: "Data security",
    p: "We apply industry-standard safeguards to protect your information, including encryption in transit, access controls, and audit logging. For client engagements involving sensitive data, we implement additional controls including PII redaction where appropriate.",
  },
  {
    h: "Third parties",
    p: "We use a small number of reputable service providers (hosting, analytics, email) who process data on our behalf under appropriate agreements. We share information with them only as needed to operate our business.",
  },
  {
    h: "Your rights",
    p: "You may request access to, correction of, or deletion of your personal information at any time. Contact us and we'll respond promptly.",
  },
  {
    h: "Contact",
    p: `Questions about this policy? Email ${company.email}.`,
  },
];

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHeader eyebrow="Legal" title="Privacy Policy" sub="Last updated June 17, 2026" />
      <section className="px-5 pb-28 sm:px-8">
        <div className="mx-auto max-w-3xl space-y-8">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="text-xl font-semibold text-mist">{s.h}</h2>
              <p className="mt-2 leading-relaxed text-mist-dim">{s.p}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
