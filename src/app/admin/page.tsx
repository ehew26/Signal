"use client";

import { useState } from "react";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import ProductMedia from "@/components/store/ProductMedia";
import { CATEGORY_META, type Category } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

const CATS = Object.keys(CATEGORY_META) as Category[];
const EMOJI = ["✨", "🧊", "💎", "🌿", "💥", "🌙", "🔵", "☁️", "🕯️", "⚡", "❄️", "🫧"];

export default function AdminPage() {
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    category: "skincare-tools" as Category,
    tags: "",
    priceCents: 3800,
    compareAtCents: "",
    emoji: "✨",
    accent: "#a78bfa",
    hue: 260,
    benefits: "",
    howToUse: "",
    badges: "",
    featured: false,
    viral: false,
  });
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit() {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "x-admin-token": token } : {}),
        },
        body: JSON.stringify({
          ...form,
          priceCents: Number(form.priceCents),
          compareAtCents: form.compareAtCents ? Number(form.compareAtCents) : undefined,
        }),
      });
      setResult(await res.json());
    } catch {
      setResult({ ok: false, error: "Network error." });
    } finally {
      setBusy(false);
    }
  }

  function copySnippet() {
    if (result?.snippet) {
      navigator.clipboard.writeText(result.snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  const input =
    "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] text-mist outline-none focus:border-violet";
  const label = "text-[13px] font-medium text-mist-dim";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-2 text-[13px] font-medium text-violet">
        <Sparkles className="h-4 w-4" /> Store admin
      </div>
      <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-mist">
        Add a product
      </h1>
      <p className="mt-2 max-w-xl text-[15px] text-mist-dim">
        Fill this in and publish. With Supabase connected it goes live instantly and the layout
        re-flows on its own. Without it, you&rsquo;ll get a paste-ready snippet for{" "}
        <code className="rounded bg-ink-2 px-1.5 py-0.5 text-[13px]">src/lib/products.ts</code>.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className={label}>Name</label>
            <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Glacier Ice Globes" />
          </div>
          <div>
            <label className={label}>Tagline</label>
            <input className={input} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Cold-therapy facial in 5 minutes." />
          </div>
          <div>
            <label className={label}>Description</label>
            <textarea className={input} rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Category</label>
              <select className={input} value={form.category} onChange={(e) => set("category", e.target.value as Category)}>
                {CATS.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_META[c].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Tags (comma-separated)</label>
              <input className={input} value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="cooling, de-puff, viral" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Price (cents)</label>
              <input type="number" className={input} value={form.priceCents} onChange={(e) => set("priceCents", Number(e.target.value))} />
            </div>
            <div>
              <label className={label}>Compare-at (cents, optional)</label>
              <input type="number" className={input} value={form.compareAtCents} onChange={(e) => set("compareAtCents", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={label}>Benefits (one per line)</label>
            <textarea className={input} rows={3} value={form.benefits} onChange={(e) => set("benefits", e.target.value)} placeholder={"De-puffs instantly\nCalms redness"} />
          </div>
          <div>
            <label className={label}>How to use</label>
            <input className={input} value={form.howToUse} onChange={(e) => set("howToUse", e.target.value)} />
          </div>
          <div>
            <label className={label}>Badges (comma-separated)</label>
            <input className={input} value={form.badges} onChange={(e) => set("badges", e.target.value)} placeholder="Viral on TikTok, Bestseller" />
          </div>

          {/* Visual identity */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={label}>Emoji</label>
              <select className={input} value={form.emoji} onChange={(e) => set("emoji", e.target.value)}>
                {EMOJI.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Hue (0–360)</label>
              <input type="range" min={0} max={360} className="w-full accent-violet" value={form.hue} onChange={(e) => set("hue", Number(e.target.value))} />
            </div>
            <div>
              <label className={label}>Accent</label>
              <input type="color" className="h-10 w-full rounded-xl border border-line bg-white" value={form.accent} onChange={(e) => set("accent", e.target.value)} />
            </div>
          </div>

          <div className="flex flex-wrap gap-5">
            <label className="inline-flex items-center gap-2 text-[14px] text-mist">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-violet" />
              Featured (hero cell)
            </label>
            <label className="inline-flex items-center gap-2 text-[14px] text-mist">
              <input type="checkbox" checked={form.viral} onChange={(e) => set("viral", e.target.checked)} className="h-4 w-4 accent-violet" />
              Viral (trending rail)
            </label>
          </div>

          <div>
            <label className={label}>Admin token (only if ADMIN_TOKEN is set)</label>
            <input className={input} value={token} onChange={(e) => setToken(e.target.value)} type="password" placeholder="optional" />
          </div>

          <button
            onClick={submit}
            disabled={busy || !form.name}
            className="inline-flex items-center gap-2 rounded-full bg-mist px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-mist/90 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Publish product
          </button>

          {result && (
            <div
              className={`rounded-2xl border p-4 text-[14px] ${
                result.ok ? "border-emerald/30 bg-emerald/10 text-mist" : "border-rose/30 bg-rose/10 text-mist"
              }`}
            >
              <p className="font-medium">{result.message || result.error}</p>
              {result.snippet && (
                <div className="mt-3">
                  <button onClick={copySnippet} className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-[12px] font-semibold text-white">
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy snippet"}
                  </button>
                  <pre className="overflow-x-auto rounded-xl bg-mist p-3 text-[12px] leading-relaxed text-white">
                    {result.snippet}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live preview */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-2 text-[13px] font-medium text-mist-dim">Live preview</p>
          <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-line shadow-card">
            <div className="aspect-square">
              <ProductMedia hue={form.hue} emoji={form.emoji} accent={form.accent} name={form.name || "Preview"} />
            </div>
            <div className="p-4">
              <h3 className="font-display text-[15px] font-semibold text-mist">{form.name || "Product name"}</h3>
              <p className="line-clamp-1 text-[13px] text-mist-faint">{form.tagline || "Your tagline here"}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[17px] font-semibold text-mist">{formatPrice(Number(form.priceCents) || 0)}</span>
                {form.compareAtCents && (
                  <span className="text-[13px] text-mist-faint line-through">{formatPrice(Number(form.compareAtCents))}</span>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
