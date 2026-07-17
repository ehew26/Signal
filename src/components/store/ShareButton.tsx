"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * One-tap sharing — native share sheet on mobile, clipboard copy on desktop.
 * Built to make every product a shareable link (the core viral loop).
 */
export default function ShareButton({
  url,
  title,
  text,
  className,
  label = "Share",
}: {
  url: string;
  title: string;
  text?: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const shareUrl = url.startsWith("http")
      ? url
      : typeof window !== "undefined"
        ? `${window.location.origin}${url}`
        : url;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-5 py-3.5 text-sm font-semibold text-mist transition hover:border-line-strong",
        className
      )}
    >
      {copied ? <Check className="h-4 w-4 text-emerald" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Link copied" : label}
    </button>
  );
}
