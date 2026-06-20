import Link from "next/link";
import { AtSign, Mail, Share2 } from "lucide-react";
import Logo from "@/components/Logo";

const columns = [
  {
    title: "Services",
    links: [
      { label: "AI Receptionist", href: "/services" },
      { label: "Lead Follow-Up", href: "/services" },
      { label: "Booking", href: "/services" },
      { label: "Reviews", href: "/services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Insights", href: "/insights" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Client Portal", href: "/portal" },
      { label: "Manage billing", href: "/billing" },
      { label: "Sign in", href: "/login" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist-dim">
            Practical AI for small businesses — answer customers, capture every
            lead, and book more jobs. Done for you, live in days.
          </p>
          <div className="mt-5 flex gap-2">
            {[AtSign, Share2, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-mist-dim transition-colors hover:border-line-strong hover:text-mist"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-mist">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-mist-dim transition-colors hover:text-mist">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-mist-faint sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} Vertex AI. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <Link href="/legal/privacy" className="hover:text-mist-dim">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-mist-dim">Terms</Link>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" />
              All systems operational
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
