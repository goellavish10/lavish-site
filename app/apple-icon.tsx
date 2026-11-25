import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const dot = (bg: string) => <div style={{ width: 30, height: 30, borderRadius: 15, background: bg }} />;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 22px",
        background: "#14234a",
        backgroundImage: "linear-gradient(#4f6bab, #4f6bab)",
        backgroundSize: "100% 10px",
        backgroundPosition: "0 85px",
        backgroundRepeat: "no-repeat",
      }}
    >
      {dot("#ffc23d")}
      <div
        style={{
          width: 66,
          height: 84,
          borderRadius: 18,
          background: "#e9eef6",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
        }}
      >
        <div style={{ width: 18, height: 18, borderRadius: 9, background: "#d98f00" }} />
        <div style={{ width: 34, height: 13, borderRadius: 7, background: "#13915f" }} />
      </div>
      {dot("#4fd39a")}
    </div>,
    size,
  );
}
