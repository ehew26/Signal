import type { Metadata } from "next";
import Link from "next/link";
import { PhoneMissed, MessageSquareText, CalendarCheck } from "lucide-react";
import PageShell, { PageHeader } from "@/components/site/PageShell";
import Reveal from "@/components/Reveal";
import AuditCalculator from "@/components/site/AuditCalculator";

export const metadata: Metadata = {
  title: "Free Lead Leak Audit — see what missed calls cost you",
  description:
    "A 30-second calculator that shows how much revenue your business loses to missed calls and slow follow-up — and how to recover it with AI.",
};

const fixes = [
  {
    icon: PhoneMissed,
    title: "Every missed call answered",
    body: "An AI receptionist picks up 24/7 and instantly texts back callers you'd otherwise lose.",
  },
  {
    icon: MessageSquareText,
    title: "Instant follow-up",
    body: "Leads from calls, forms, and texts get an immediate reply and a nudge until they book.",
  },
  {
    icon: CalendarCheck,
    title: "Booked, not bounced",
    body: "The AI answers questions and books the job straight onto your calendar — done for you.",
  },
];

export default function AuditPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Free Lead Leak Audit"
        title={
          <>
            How much is <span className="gradient-text">missing calls</span> costing you?
          </>
        }
        sub="Most small businesses quietly lose thousands a month to unanswered calls and slow follow-up. Move the sliders to see your number — then get a free plan to recover it."
      />

      <section className="px-5 pb-20 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <AuditCalculator />
          </Reveal>
        </div>
      </section>

      <section className="px-5 pb-28 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-center text-2xl font-semibold text-mist sm:text-3xl">
              How Vertex AI recovers it
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {fixes.map((f, i) => (
              <Reveal key={f.title} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className="h-full rounded-2xl panel p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet/10 text-violet">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-mist">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-mist-dim">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <p className="text-sm text-mist-dim">
              Live in 48 hours, done for you. Cancel anytime.
            </p>
            <Link href="/#pricing" className="btn-primary mt-5 inline-flex">
              See plans &amp; pricing
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
