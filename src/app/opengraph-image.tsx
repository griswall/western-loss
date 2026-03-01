import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(140deg, #0a3e89 0%, #0d4da8 45%, #1a63c2 100%)",
          color: "#ffffff",
          fontFamily: "Avenir Next, Segoe UI, Arial, sans-serif",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: 42,
            border: "2px solid rgba(255,255,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 72,
            letterSpacing: 5,
            background: "rgba(255,255,255,0.08)",
          }}
        >
          WLA
        </div>

        <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: 1 }}>
          Western Loss Association
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
