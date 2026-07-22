import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import PageShell, { PageHeader } from "@/components/site/PageShell";
import ContactForm from "@/components/site/ContactForm";
import Reveal from "@/components/Reveal";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a strategy call with Vertex AI. We'll pressure-test your idea and leave you with a clear, honest plan — whether or not you hire us.",
};

const details = [
  { icon: Mail, label: "Email", value: company.email, href: `mailto:${company.email}` },
  { icon: Phone, label: "Phone", value: company.phone, href: `tel:${company.phone.replace(/[^+\d]/g, "")}` },
  { icon: MapPin, label: "Location", value: company.location },
  { icon: Clock, label: "Response time", value: "Within 1 business day" },
];

export default function ContactPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Contact"
        title={<>Let&apos;s build something <span className="gradient-text">that ships</span></>}
        sub="Tell us what you're trying to do. We'll come back with an honest take and a clear next step — no obligation, no hard sell."
      />

      <section className="px-5 pb-28 sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="space-y-3">
            {details.map((d) => {
              const content = (
                <div className="flex items-start gap-3 rounded-2xl panel p-5 transition-colors hover:border-line-strong">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet/10 text-violet">
                    <d.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-mist-faint">{d.label}</p>
                    <p className="mt-0.5 text-sm font-medium text-mist">{d.value}</p>
                  </div>
                </div>
              );
              return d.href ? (
                <a key={d.label} href={d.href} className="block">
                  {content}
                </a>
              ) : (
                <div key={d.label}>{content}</div>
              );
            })}

            <div className="rounded-2xl border border-line-strong bg-brand-radial p-5">
              <p className="text-sm leading-relaxed text-mist">
                Prefer to talk live? Most engagements start with a 30-minute call.
                We&apos;ll diagnose the opportunity and tell you honestly whether AI
                is the right tool — and whether we&apos;re the right team.
              </p>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
