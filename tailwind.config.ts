import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core surfaces
        ink: "#05060d",
        "ink-2": "#0a0c17",
        "ink-3": "#10131f",
        panel: "#0e1120",
        line: "rgba(255,255,255,0.08)",
        "line-strong": "rgba(255,255,255,0.14)",
        // Text
        mist: "#e7e9f3",
        "mist-dim": "#9aa0b9",
        "mist-faint": "#646b85",
        // Brand
        violet: "#7c5cff",
        "violet-deep": "#5b3df0",
        cyan: "#22d3ee",
        emerald: "#34d399",
        amber: "#fbbf24",
        rose: "#fb7185",
      },
      fontFamily: {
        display: ["var(--font-sora)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,92,255,0.25), 0 20px 60px -20px rgba(124,92,255,0.45)",
        "glow-cyan": "0 0 0 1px rgba(34,211,238,0.2), 0 20px 60px -20px rgba(34,211,238,0.4)",
        card: "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 30px 60px -30px rgba(0,0,0,0.8)",
        float: "0 40px 80px -40px rgba(0,0,0,0.9)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "brand-gradient": "linear-gradient(135deg, #7c5cff 0%, #22d3ee 100%)",
        "brand-radial":
          "radial-gradient(60% 60% at 50% 0%, rgba(124,92,255,0.25) 0%, rgba(5,6,13,0) 70%)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "slide-up": "slideUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        float: "float 8s ease-in-out infinite",
        "float-slow": "float 12s ease-in-out infinite",
        "spin-slow": "spin 22s linear infinite",
        shimmer: "shimmer 6s linear infinite",
        marquee: "marquee 38s linear infinite",
        "pulse-ring": "pulseRing 2.4s ease-out infinite",
        "border-flow": "borderFlow 4s ease infinite",
        blink: "blink 1.2s step-end infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-18px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        borderFlow: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
