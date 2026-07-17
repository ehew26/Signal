import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { store } from "@/lib/store";
import ClearCartOnMount from "@/components/store/ClearCartOnMount";

export const metadata = { title: "Order confirmed", robots: { index: false } };

export default function OrderSuccessPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <ClearCartOnMount />
      <span className="grid h-20 w-20 place-items-center rounded-full bg-emerald/15 text-emerald">
        <CheckCircle2 className="h-10 w-10" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-mist">
        You&rsquo;re glowing already ✨
      </h1>
      <p className="mt-3 text-[16px] leading-relaxed text-mist-dim">
        Thanks for your order! A confirmation is on its way to your inbox. Your Lumé pieces ship
        within 48 hours — we&rsquo;ll send tracking the moment they&rsquo;re on the move.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/shop"
          className="rounded-full bg-mist px-7 py-3.5 text-sm font-semibold text-white shadow-lift transition hover:bg-mist/90"
        >
          Keep shopping
        </Link>
        <a
          href={store.social.instagram}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-line bg-white px-7 py-3.5 text-sm font-semibold text-mist transition hover:border-line-strong"
        >
          Tag us @{store.name.toLowerCase()}.store
        </a>
      </div>
    </section>
  );
}
