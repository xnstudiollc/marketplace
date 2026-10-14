import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { tileBackground } from "@/components/game/GameImage";
import { SITE } from "./site";

export const OG_SIZE = { width: 1200, height: 630 };

let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 600 | 700; style: "normal" }[]> | undefined;

function loadFonts() {
  fonts ??= Promise.all(
    ([["Geist-Regular.ttf", 400], ["Geist-SemiBold.ttf", 600], ["Geist-Bold.ttf", 700]] as const).map(async ([file, weight]) => ({
      name: "Geist",
      data: await readFile(join(process.cwd(), "assets/fonts", file)),
      weight,
      style: "normal" as const,
    })),
  );
  return fonts;
}

function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <defs>
        <linearGradient id="m" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b6dff" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path d="M16 2.5 27.7 9.25v13.5L16 29.5 4.3 22.75V9.25z" fill="rgba(124,92,255,0.12)" stroke="url(#m)" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="6.2" fill="none" stroke="url(#m)" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="1.7" fill="url(#m)" />
    </svg>
  );
}

/** Shared Open Graph card: dark canvas, brand glows, optional game tile, title and a short line of detail. */
export async function renderOg({
  title,
  eyebrow,
  detail,
  tile,
}: {
  title: string;
  eyebrow: string;
  detail: string;
  tile?: { seed: string; initials: string; accent: string };
}) {
  const titleSize = title.length > 40 ? 60 : title.length > 22 ? 72 : 88;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#F5F7FF",
          fontFamily: "Geist",
          backgroundColor: "#07080D",
          backgroundImage: `radial-gradient(circle at 12% 0%, rgba(124,92,255,0.45), transparent 55%), radial-gradient(circle at 100% 100%, ${tile ? `${tile.accent}55` : "rgba(34,211,238,0.3)"}, transparent 55%)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Mark size={52} />
          <div style={{ display: "flex", fontSize: 34, fontWeight: 600, letterSpacing: -0.5 }}>{SITE.name}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
          {tile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 220,
                height: 220,
                flexShrink: 0,
                borderRadius: 48,
                backgroundImage: tileBackground(tile.seed),
                border: "2px solid rgba(255,255,255,0.18)",
                fontSize: tile.initials.length > 2 ? 72 : 92,
                fontWeight: 700,
                color: "rgba(255,255,255,0.92)",
              }}
            >
              {tile.initials}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: tile ? 780 : 1000 }}>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#22D3EE" }}>
              {eyebrow}
            </div>
            <div style={{ display: "flex", fontSize: titleSize, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#A9B1CC" }}>{detail}</div>
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() },
  );
}
