"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Phone, ArrowRight } from "lucide-react";
import { company } from "@/lib/content";

const TEL = `tel:${company.phone.replace(/[^+\d]/g, "")}`;

export default function StickyCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto mb-3 flex max-w-2xl items-center gap-2 px-3">
        <div className="flex w-full items-center gap-2 rounded-full border border-line bg-[rgba(255,255,255,0.85)] p-1.5 shadow-lift backdrop-blur-xl">
          <a
            href={TEL}
            className="flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-mist transition-colors hover:bg-black/[0.04]"
          >
            <Phone className="h-4 w-4 text-violet" /> Call or text
          </a>
          <Link
            href="/contact"
            className="flex flex-[1.2] items-center justify-center gap-1.5 rounded-full bg-violet px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-deep"
          >
            Book a free call <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
