import { ImageResponse } from "next/og";

// Icon-only apex mark — the Vertex chevron, no wordmark.
// Next.js app-router icon convention: generates the favicon at build/edge.
export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
          // olive-drab field
          background: "linear-gradient(135deg, #556b2e, #3d4a1e)",
        }}
      >
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 4l9 16L21 4"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <circle cx="12" cy="20" r="1.7" fill="#ffffff" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
