import { ImageResponse } from "next/og";
import { COUPLE_NAME } from "@/lib/config";

// Auto-generates the link-preview (Open Graph / Twitter) card at
// /opengraph-image. Next injects it as og:image + twitter:image on every page
// that doesn't set its own. No static asset to keep in sync — the card always
// matches the couple's name. Override with NEXT_PUBLIC_OG_IMAGE if you'd rather
// use a real photo.
export const runtime = "edge";
export const alt = `${COUPLE_NAME}'s Wedding`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6efe2",
          color: "#5a6440",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#cf857d",
          }}
        >
          Welcome to the wedding of
        </div>
        <div style={{ fontSize: 120, marginTop: 24, textAlign: "center" }}>
          {COUPLE_NAME}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginTop: 30,
            color: "#6f7a4f",
          }}
        >
          <div style={{ width: 90, height: 2, background: "#6f7a4f" }} />
          <div style={{ fontSize: 34 }}>❀</div>
          <div style={{ width: 90, height: 2, background: "#6f7a4f" }} />
        </div>
        <div style={{ fontSize: 30, marginTop: 30, color: "#7a7364" }}>
          Share your photos &amp; videos · no app, no login
        </div>
      </div>
    ),
    size,
  );
}
