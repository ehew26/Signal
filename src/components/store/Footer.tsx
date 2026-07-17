import Link from "next/link";
import Logo from "@/components/Logo";
import { store } from "@/lib/store";
import { CATEGORY_META, type Category } from "@/lib/products";

const cats: Category[] = ["skincare-tools", "led-therapy", "hair-scalp", "body-recovery", "wellness"];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-ink-2">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-mist-dim">{store.promise}</p>
          <div className="mt-4 flex gap-3 text-[13px] text-mist-faint">
            <a href={store.social.tiktok} className="hover:text-mist" target="_blank" rel="noreferrer">
              TikTok
            </a>
            <a href={store.social.instagram} className="hover:text-mist" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href={store.social.pinterest} className="hover:text-mist" target="_blank" rel="noreferrer">
              Pinterest
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-[13px] font-semibold uppercase tracking-wide text-mist-faint">Shop</h4>
          <ul className="mt-3 space-y-2 text-[14px]">
            <li>
              <Link href="/shop" className="text-mist-dim hover:text-mist">
                All products
              </Link>
            </li>
            {cats.map((c) => (
              <li key={c}>
                <Link href={`/collections/${c}`} className="text-mist-dim hover:text-mist">
                  {CATEGORY_META[c].label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[13px] font-semibold uppercase tracking-wide text-mist-faint">Help</h4>
          <ul className="mt-3 space-y-2 text-[14px]">
            <li>
              <a href={`mailto:${store.supportEmail}`} className="text-mist-dim hover:text-mist">
                Contact us
              </a>
            </li>
            <li>
              <Link href="/legal/privacy" className="text-mist-dim hover:text-mist">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="text-mist-dim hover:text-mist">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-mist-dim hover:text-mist">
                Store admin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[13px] font-semibold uppercase tracking-wide text-mist-faint">
            Join the glow list
          </h4>
          <p className="mt-3 text-[14px] text-mist-dim">
            Early drops, restocks, and members-only deals.
          </p>
          <form className="mt-3 flex gap-2" action="/shop">
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="min-w-0 flex-1 rounded-full border border-line bg-white px-4 py-2.5 text-[14px] text-mist outline-none focus:border-violet"
            />
            <button className="rounded-full bg-mist px-4 py-2.5 text-[14px] font-semibold text-white">
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-[13px] text-mist-faint sm:flex-row sm:px-6">
          <span>
            © {new Date().getFullYear()} {store.legalName}. All rights reserved.
          </span>
          <span>{store.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
