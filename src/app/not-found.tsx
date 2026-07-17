import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="relative grid min-h-[70vh] place-items-center px-6 text-center">
      <div>
        <Logo className="mx-auto" href="/" />
        <div className="mt-8 bg-brand-gradient bg-clip-text text-7xl font-semibold text-transparent">
          404
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold text-mist">
          This page took a wrong turn.
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-mist-dim">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back
          to the good stuff.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-mist px-6 py-3.5 text-sm font-semibold text-white shadow-lift transition hover:bg-mist/90"
        >
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>
      </div>
    </main>
  );
}
