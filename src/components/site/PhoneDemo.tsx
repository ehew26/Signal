"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type Msg = { from: "customer" | "ai"; text: string };

const SCRIPT: Msg[] = [
  { from: "customer", text: "Hi, any openings this week for a roof estimate?" },
  { from: "ai", text: "Hi! Yes — Tuesday 9:00 AM or Thursday 2:00 PM. Which works?" },
  { from: "customer", text: "Tuesday works 👍" },
  { from: "ai", text: "Booked you for Tue 9:00 AM ✅ I'll text a reminder the day before." },
];

function useTypewriterChat() {
  const [count, setCount] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let active = true;
    const run = async () => {
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
      // reset
      await wait(600);
      while (active) {
        for (let i = 0; i < SCRIPT.length; i++) {
          setTyping(true);
          await wait(SCRIPT[i].from === "ai" ? 1100 : 700);
          if (!active) return;
          setTyping(false);
          setCount(i + 1);
          await wait(900);
        }
        await wait(2600);
        if (!active) return;
        setCount(0);
        await wait(700);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, []);

  return { count, typing };
}

function Bubble({ msg }: { msg: Msg }) {
  const isAI = msg.from === "ai";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className={`flex ${isAI ? "justify-end" : "justify-start"}`}
    >
      <span
        className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-[13px] leading-snug ${
          isAI
            ? "rounded-br-md bg-violet text-white"
            : "rounded-bl-md bg-[#e9e9eb] text-[#1d1d1f]"
        }`}
      >
        {msg.text}
      </span>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex justify-start">
      <span className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-[#e9e9eb] px-3.5 py-2.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[#8e8e93]"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </span>
    </div>
  );
}

export default function PhoneDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { count, typing } = useTypewriterChat();

  // Mouse-tracking 3D tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 18 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  const nextIsAI = SCRIPT[count]?.from === "ai";

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mx-auto"
      style={{ perspective: 1100 }}
    >
      {/* soft glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 mx-auto h-full w-3/4 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(0,113,227,0.18), transparent 70%)" }}
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative mx-auto w-[280px] rounded-[2.75rem] border border-black/10 bg-black p-2.5 shadow-float"
      >
        {/* screen */}
        <div className="relative overflow-hidden rounded-[2.25rem] bg-white" style={{ transform: "translateZ(40px)" }}>
          {/* status / header */}
          <div className="flex items-center gap-2 border-b border-black/5 bg-white/90 px-4 pb-2.5 pt-4 backdrop-blur">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-violet text-xs font-semibold text-white">
              AI
            </span>
            <div className="leading-tight">
              <p className="text-[13px] font-semibold text-[#1d1d1f]">Your AI Assistant</p>
              <p className="flex items-center gap-1 text-[10px] text-emerald">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald" /> Online · replies instantly
              </p>
            </div>
          </div>

          {/* messages */}
          <div className="flex h-[300px] flex-col justify-end gap-2 px-3 py-3">
            {SCRIPT.slice(0, count).map((m, i) => (
              <Bubble key={i} msg={m} />
            ))}
            {typing && count < SCRIPT.length && nextIsAI && <TypingDots />}
          </div>

          {/* footer status */}
          <div className="flex items-center justify-between border-t border-black/5 px-4 py-2.5">
            <span className="text-[10px] text-[#8e8e93]">Lead captured · Booked</span>
            <span className="text-[10px] font-medium text-violet">Vertex AI</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
