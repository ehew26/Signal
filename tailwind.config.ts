import type { Config } from "tailwindcss";

/** rgb(var(--token) / <alpha-value>) so colors are theme-scoped and support opacity utilities. */
const rgb = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: rgb("--ink"),
        "ink-2": rgb("--ink-2"),
        "ink-3": rgb("--ink-3"),
        panel: rgb("--panel"),
        mist: rgb("--mist"),
        "mist-dim": rgb("--mist-dim"),
        "mist-faint": rgb("--mist-faint"),
        violet: rgb("--violet"),
        "violet-deep": rgb("--violet-deep"),
        cyan: rgb("--cyan"),
        emerald: rgb("--emerald"),
        amber: rgb("--amber"),
        rose: rgb("--rose"),
        // translucent, theme-scoped (full color held in the var)
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.3), 0 8px 24px -12px rgba(0,0,0,0.5)",
        lift: "0 2px 8px rgba(0,0,0,0.35), 0 24px 48px -24px rgba(0,0,0,0.6)",
        float: "0 40px 80px -40px rgba(0,0,0,0.7)",
        card: "var(--panel-shadow)",
        glow: "0 0 32px -8px rgba(85,107,46,0.55)",
        "glow-cyan": "0 0 32px -8px rgba(150,130,60,0.5)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, rgb(var(--violet)), rgb(var(--cyan)))",
        "brand-radial": "radial-gradient(60% 60% at 50% 0%, rgba(85,107,46,0.14), transparent 70%)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "slide-up": "slideUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        float: "float 8s ease-in-out infinite",
        "float-slow": "float 12s ease-in-out infinite",
        marquee: "marquee 38s linear infinite",
        blink: "blink 1.2s step-end infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blink: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0" } },
      },
    },
  },
  plugins: [],
};

export default config;
