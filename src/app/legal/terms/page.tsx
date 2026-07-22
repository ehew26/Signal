import type { Metadata } from "next";
import PageShell, { PageHeader } from "@/components/site/PageShell";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of the Vertex AI website.",
};

const sections = [
  {
    h: "Acceptance of terms",
    p: "By accessing this website you agree to these terms. If you do not agree, please do not use the site. These terms govern use of the public website; paid engagements are governed by a separate written agreement.",
  },
  {
    h: "Use of the site",
    p: "You may use this site for lawful purposes only. You agree not to misuse the site, attempt to gain unauthorized access, or interfere with its operation.",
  },
  {
    h: "Intellectual property",
    p: "All content on this site — text, design, code, and marks — is owned by or licensed to Vertex AI and may not be reproduced without permission. Deliverables created during a client engagement are governed by that engagement's agreement.",
  },
  {
    h: "No warranty",
    p: "The site and its content are provided 'as is' without warranties of any kind. We make no guarantee that the site will be uninterrupted, error-free, or that information is complete or current.",
  },
  {
    h: "Limitation of liability",
    p: "To the maximum extent permitted by law, Vertex AI is not liable for any indirect, incidental, or consequential damages arising from your use of this website.",
  },
  {
    h: "Contact",
    p: `Questions about these terms? Email ${company.email}.`,
  },
];

export default function TermsPage() {
  return (
    <PageShell>
      <PageHeader eyebrow="Legal" title="Terms of Service" sub="Last updated June 17, 2026" />
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
