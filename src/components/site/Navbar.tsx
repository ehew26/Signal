"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Work" },
  { href: "/#process", label: "Process" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-300 sm:px-8",
          scrolled ? "my-2.5" : "my-4"
        )}
      >
        <div
          className={cn(
            "flex w-full items-center justify-between rounded-full px-3 py-2 transition-all duration-300",
            scrolled ? "glass shadow-card" : "border border-transparent"
          )}
        >
          <Logo className="pl-1.5" />

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-mist-dim transition-colors hover:text-mist"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link href="/portal" className="btn-ghost !px-4 !py-2">
              Client login
            </Link>
            <Link href="/#contact" className="btn-primary !px-4 !py-2">
              Book a call <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full text-mist md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-4 animate-slide-up rounded-3xl glass p-4 md:hidden">
          <nav className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-mist-dim hover:bg-white/5 hover:text-mist"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link href="/portal" onClick={() => setOpen(false)} className="btn-ghost">
                Client login
              </Link>
              <Link href="/#contact" onClick={() => setOpen(false)} className="btn-primary">
                Book a call
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
