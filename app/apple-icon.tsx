import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d0d0d",
          borderRadius: "36px",
          border: "4px solid #FB4617",
        }}
      >
        <span
          style={{
            color: "#FB4617",
            fontSize: "72px",
            fontWeight: 900,
            letterSpacing: "-2px",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          SNK
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
