import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
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
          backgroundColor: "#0a0a0a",
          borderRadius: "7px",
          border: "1.5px solid #FB4617",
        }}
      >
        <span
          style={{
            color: "#FB4617",
            fontSize: "13px",
            fontWeight: 900,
            letterSpacing: "-0.5px",
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
