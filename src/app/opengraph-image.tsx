import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Lumé — Glow, engineered.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(900px circle at 82% -8%, rgba(167,139,250,0.35), transparent 55%), radial-gradient(760px circle at 2% 108%, rgba(56,189,248,0.30), transparent 55%), #ffffff",
          color: "#0d1026",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: "radial-gradient(circle at 35% 30%, #fbcfe8, #a78bfa 60%, #38bdf8)",
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>Lumé</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02 }}>
            Glow, engineered.
          </div>
          <div style={{ fontSize: 30, color: "#4a5270", maxWidth: 820 }}>
            Clinically-minded beauty &amp; wellness tools, curated for people who actually use them.
          </div>
        </div>

        <div style={{ display: "flex", gap: 28, fontSize: 22, color: "#7e86a3" }}>
          <span>Free shipping over $50</span>
          <span>·</span>
          <span>30-day glow guarantee</span>
          <span>·</span>
          <span>Cruelty-free</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
