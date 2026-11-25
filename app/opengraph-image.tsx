import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Lavish Goyal, full-stack engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ink = "#14234a";
const paper = "#e9eef6";
const line = "#9fb1d2";

export default async function OpengraphImage() {
  const [display, body] = await Promise.all([
    readFile(join(process.cwd(), "assets/archivo-800-expanded.ttf")),
    readFile(join(process.cwd(), "assets/archivo-400.ttf")),
  ]);
  const pages = ["Work", "Lab", "Play", "Writing", "Hire me"];
  const dot = (bg: string) => <div style={{ width: 18, height: 18, borderRadius: 9, background: bg }} />;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: paper,
        backgroundImage: `linear-gradient(${line}33 1px, transparent 1px), linear-gradient(90deg, ${line}33 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
        color: ink,
        fontFamily: "Archivo",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "Archivo Expanded", fontSize: 118, letterSpacing: -3, lineHeight: 1 }}>Lavish Goyal</div>
        <div style={{ fontSize: 38, marginTop: 22, color: "#43557d" }}>I make slow, flaky backends fast and boring.</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div style={{ display: "flex", fontSize: 30 }}>you</div>
        <div style={{ display: "flex", gap: 10 }}>
          {dot("#e39b00")}
          {dot("#e39b00")}
          {dot("#e39b00")}
        </div>
        <div
          style={{
            display: "flex",
            border: `3px solid ${ink}`,
            borderRadius: 18,
            padding: "14px 22px",
            fontSize: 28,
            background: "#ffffff88",
          }}
        >
          rate limiter
        </div>
        {dot("#13915f")}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, width: 560 }}>
          {pages.map((p) => (
            <div
              key={p}
              style={{ display: "flex", border: `2px solid ${ink}`, borderRadius: 14, padding: "8px 16px", fontSize: 26 }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Archivo Expanded", data: display, weight: 800 },
        { name: "Archivo", data: body, weight: 400 },
      ],
    },
  );
}
