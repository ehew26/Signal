"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, LogOut, Menu, Search, X } from "lucide-react";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

export type NavItem = { label: string; href: string; icon: React.ReactNode; badge?: string };

export default function Shell({
  nav,
  title,
  subtitle,
  user,
  children,
}: {
  nav: { section: string; items: NavItem[] }[];
  title: string;
  subtitle?: string;
  user: { name: string; role: string; initials: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const SidebarBody = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Logo />
        <button
          onClick={() => setOpen(false)}
          className="grid h-9 w-9 place-items-center rounded-lg text-mist-dim lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {nav.map((group) => (
          <div key={group.section}>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-mist-faint">
              {group.section}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-white/[0.06] text-mist"
                        : "text-mist-dim hover:bg-white/[0.03] hover:text-mist"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-[18px] w-[18px] shrink-0 place-items-center [&>svg]:h-[18px] [&>svg]:w-[18px]",
                        active ? "text-violet" : "text-mist-faint group-hover:text-mist-dim"
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-violet/15 px-2 py-0.5 text-[10px] font-semibold text-violet">
                        {item.badge}
                      </span>
                    )}
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-violet" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient text-xs font-semibold text-white">
            {user.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-mist">{user.name}</p>
            <p className="truncate text-xs text-mist-faint">{user.role}</p>
          </div>
          <button
            onClick={logout}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-mist-faint transition-colors hover:bg-white/[0.05] hover:text-mist"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dash-dark min-h-screen lg:grid lg:grid-cols-[264px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen border-r border-line bg-ink-2 lg:block">
        {SidebarBody}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-line bg-ink-2 animate-slide-up">
            {SidebarBody}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-line bg-ink/80 px-5 backdrop-blur-xl sm:px-8">
          <button
            onClick={() => setOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg text-mist-dim lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-base font-semibold text-mist sm:text-lg">{title}</h1>
            {subtitle && <p className="hidden text-xs text-mist-faint sm:block">{subtitle}</p>}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm text-mist-faint md:flex">
              <Search className="h-4 w-4" />
              <span>Search…</span>
              <kbd className="ml-2 rounded border border-line px-1.5 text-[10px] text-mist-faint">⌘K</kbd>
            </div>
            <button className="relative grid h-10 w-10 place-items-center rounded-full border border-line text-mist-dim transition-colors hover:text-mist">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-violet ring-2 ring-ink" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
