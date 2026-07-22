"use client";

import { useEffect, useRef } from "react";

/**
 * A soft violet/cyan glow that follows the cursor — a premium interactive
 * light layer over the whole page. Uses a single fixed element whose position
 * is driven by CSS variables (rAF-throttled) so it stays buttery smooth.
 * Disabled for touch devices and prefers-reduced-motion.
 */
export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (el.style.opacity !== "1") el.style.opacity = "1";
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };

    const loop = () => {
      // ease toward the cursor for a smooth trailing feel
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      el.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 -z-[5] h-[520px] w-[520px] opacity-0 transition-opacity duration-500 will-change-transform"
      style={{
        marginLeft: "-260px",
        marginTop: "-260px",
        background:
          "radial-gradient(circle, rgba(85,107,46,0.10) 0%, rgba(150,130,60,0.07) 40%, transparent 70%)",
      }}
    />
  );
}
