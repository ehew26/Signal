"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import Logo from "@/components/Logo";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

type NavCategory = { key: string; label: string };

export default function Navbar({ categories }: { categories: NavCategory[] }) {
  const { count, setOpen } = useCart();
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/shop" className="text-[14px] font-medium text-mist-dim transition hover:text-mist">
              Shop all
            </Link>
            {categories.slice(0, 4).map((c) => (
              <Link
                key={c.key}
                href={`/collections/${c.key}`}
                className="text-[14px] font-medium text-mist-dim transition hover:text-mist"
              >
                {c.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setOpen(true)}
            className="relative grid h-10 w-10 place-items-center rounded-full text-mist transition hover:bg-ink-2"
            aria-label="Open bag"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-mist px-1 text-[11px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobile((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full text-mist transition hover:bg-ink-2 md:hidden"
            aria-label="Menu"
          >
            {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-line bg-ink transition-[max-height] duration-300 md:hidden",
          mobile ? "max-h-96" : "max-h-0 border-t-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          <Link href="/shop" onClick={() => setMobile(false)} className="rounded-xl px-3 py-2.5 font-medium text-mist hover:bg-ink-2">
            Shop all
          </Link>
          {categories.map((c) => (
            <Link
              key={c.key}
              href={`/collections/${c.key}`}
              onClick={() => setMobile(false)}
              className="rounded-xl px-3 py-2.5 font-medium text-mist-dim hover:bg-ink-2"
            >
              {c.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
