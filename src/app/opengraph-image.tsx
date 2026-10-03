import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Satly — AI product content for e-commerce";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #05060b 0%, #1b0b30 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "linear-gradient(135deg, #a78bfa, #d946ef)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            S
          </div>
          <div style={{ fontSize: 44, fontWeight: 700 }}>Satly</div>
        </div>
        <div style={{ marginTop: 44, fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>
          Turn product names into sales-ready content.
        </div>
        <div style={{ marginTop: 28, fontSize: 30, color: "#c4b5fd" }}>
          30 seconds - Trendyol, Amazon, Shopify
        </div>
      </div>
    ),
    { ...size }
  );
}
