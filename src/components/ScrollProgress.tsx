"use client";

import { useEffect, useRef } from "react";

/**
 * Thin gradient beam pinned to the very top of the viewport that fills as the
 * page scrolls — a subtle, high-tech progress indicator. rAF-throttled scroll
 * handler; scaleX transform only (no layout). Hidden for reduced-motion.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? Math.min(1, doc.scrollTop / max) : 0;
      el.style.transform = `scaleX(${p})`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]">
      <div
        ref={ref}
        className="h-full w-full origin-left"
        style={{
          transform: "scaleX(0)",
          background: "linear-gradient(90deg, #7c3aed, #6366f1, #06b6d4)",
          boxShadow: "0 0 10px rgba(124,58,237,0.5)",
        }}
      />
    </div>
  );
}
