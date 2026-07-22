import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Vertex AI — Production-grade AI for ambitious companies";
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
          padding: "72px",
          background:
            "radial-gradient(900px circle at 80% -10%, rgba(85,107,46,0.30), transparent 55%), radial-gradient(700px circle at 0% 110%, rgba(150,130,60,0.28), transparent 55%), #ffffff",
          color: "#1a1c12",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #556b2e, #3d4a1e)",
            }}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <path d="M3 4l9 16L21 4" stroke="#ffffff" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx="12" cy="20" r="1.7" fill="#ffffff" />
            </svg>
          </div>
          <div style={{ fontSize: 30, fontWeight: 600 }}>Vertex AI</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>
            Never miss a lead again.
          </div>
          <div style={{ fontSize: 34, color: "#54563f", maxWidth: 900 }}>
            AI for small businesses — answers customers, captures leads, books jobs. Live in days.
          </div>
        </div>

        <div style={{ display: "flex", gap: 40, fontSize: 26, color: "#54563f" }}>
          <span>Senior-led</span>
          <span>Evals on every build</span>
          <span>No lock-in</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
