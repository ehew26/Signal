"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed full-viewport neural-constellation canvas — the site's signature
 * futuristic layer. Drifting particles in violet/cyan link to their neighbors
 * and gently gravitate toward the cursor, so the whole page feels alive.
 *
 * Deliberately lightweight: one rAF loop, particle count scaled to viewport,
 * devicePixelRatio capped at 2, paused when the tab is hidden, and fully
 * disabled for prefers-reduced-motion.
 */
export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Skip the whole rAF/canvas loop on touch devices: there's no cursor to
    // gravitate toward, so the interactive payoff is nil while the per-frame
    // repaint is a real drain on phones. The static gradient + aurora remain.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;

    type P = { x: number; y: number; vx: number; vy: number; r: number; hue: "violet" | "cyan" };
    let particles: P[] = [];

    const mouse = { x: -9999, y: -9999 };
    const LINK_DIST = 130;
    const MOUSE_DIST = 200;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(90, Math.floor((width * height) / 22000));
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.6,
        hue: Math.random() > 0.35 ? "violet" : "cyan",
      }));
    }

    function step() {
      if (!running) return;
      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        // gentle drift + soft attraction toward the cursor
        const dxm = mouse.x - p.x;
        const dym = mouse.y - p.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < MOUSE_DIST && dm > 0.001) {
          p.vx += (dxm / dm) * 0.012;
          p.vy += (dym / dm) * 0.012;
        }
        // clamp speed so attraction never snowballs
        const speed = Math.hypot(p.vx, p.vy);
        const MAX = 0.55;
        if (speed > MAX) {
          p.vx = (p.vx / speed) * MAX;
          p.vy = (p.vy / speed) * MAX;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      }

      // links
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.16;
            ctx!.strokeStyle = `rgba(110, 122, 58, ${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
        // link to cursor for the interactive feel
        const dxm = a.x - mouse.x;
        const dym = a.y - mouse.y;
        const dmc = Math.hypot(dxm, dym);
        if (dmc < MOUSE_DIST) {
          const alpha = (1 - dmc / MOUSE_DIST) * 0.28;
          ctx!.strokeStyle = `rgba(85, 107, 46, ${alpha})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(mouse.x, mouse.y);
          ctx!.stroke();
        }
      }

      // dots
      for (const p of particles) {
        ctx!.fillStyle =
          p.hue === "violet" ? "rgba(85, 107, 46, 0.5)" : "rgba(150, 130, 60, 0.5)";
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      raf = requestAnimationFrame(step);
    }

    function onMouse(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }
    function onVisibility() {
      running = document.visibilityState === "visible";
      if (running) raf = requestAnimationFrame(step);
      else cancelAnimationFrame(raf);
    }

    resize();
    raf = requestAnimationFrame(step);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseout", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseout", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 opacity-60"
    />
  );
}
