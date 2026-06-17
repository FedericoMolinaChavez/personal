import { ImageResponse } from "next/og";

export const alt = "CTO + AI — Fractional CTO & AI Developer for founders";
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
          backgroundColor: "#fff8f3",
          color: "#1f1b15",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 32,
            fontWeight: 800,
            color: "#8f4538",
            letterSpacing: "-0.01em",
          }}
        >
          CTO + AI
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: 980,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            I turn your idea into a&nbsp;
            <span style={{ color: "#8f4538", fontStyle: "italic" }}>product</span>
            &nbsp;your users pay for.
          </div>
          <div style={{ fontSize: 30, color: "#544340", maxWidth: 880 }}>
            Fractional CTO &amp; AI Developer for founders.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            fontWeight: 600,
            color: "#56642b",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              backgroundColor: "#56642b",
            }}
          />
          Available for new projects
        </div>
      </div>
    ),
    size,
  );
}
