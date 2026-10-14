import Image from "next/image";
import type { CSSProperties } from "react";
import assets from "@/generated/game-assets.json";
import { hash } from "@/lib/mock/rng";
import { cn } from "@/lib/utils";
import type { Game } from "@/lib/types";

const ASSETS = assets as Record<string, boolean>;

type Size = "sm" | "md" | "lg" | "fill";

const SIZE_CLASS: Record<Size, string> = {
  sm: "size-10",
  md: "size-[72px]",
  lg: "size-[120px]",
  fill: "size-full",
};

const SIZE_PX: Record<Exclude<Size, "fill">, number> = { sm: 40, md: 72, lg: 120 };

type TileGame = Pick<Game, "slug" | "name" | "initials" | "collection">;

export function tilePalette(seed: string) {
  const h = hash(seed);
  const hue = h % 360;
  const sat = 70 + (h >>> 9) % 16;
  const warm = hue >= 40 && hue <= 190;
  const light = warm ? 42 + ((h >>> 13) % 7) : 47 + ((h >>> 13) % 12);
  return { hue, sat, light };
}

export function tileBackground(seed: string) {
  const { hue, sat, light } = tilePalette(seed);
  return `linear-gradient(135deg, hsl(${hue} ${sat}% ${light}%) 0%, hsl(${(hue + 38) % 360} ${sat}% ${Math.max(light - 10, 32)}%) 100%)`;
}

export function GameImage({
  game,
  size = "md",
  className,
  priority,
}: {
  game: TileGame;
  size?: Size;
  className?: string;
  priority?: boolean;
}) {
  const hasAsset = ASSETS[game.slug] === true;
  const base = cn(
    "relative shrink-0 rounded-[22%]",
    game.collection ? "size-full" : SIZE_CLASS[size],
    game.collection ? undefined : className,
  );

  const tile = hasAsset ? (
    <div
      className={cn(base, "overflow-hidden border border-line bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]")}
    >
      <Image
        src={`/games/${game.slug}/logo.png`}
        alt=""
        fill
        priority={priority}
        sizes={size === "fill" ? "(min-width: 1024px) 240px, 40vw" : `${SIZE_PX[size]}px`}
        className="object-contain p-[12%]"
      />
    </div>
  ) : (
    <div
      aria-hidden
      className={cn(base, "@container overflow-hidden")}
      style={{ background: tileBackground(game.slug) } as CSSProperties}
    >
      <div className="absolute inset-0 bg-[conic-gradient(from_210deg_at_70%_20%,rgba(255,255,255,0.22),transparent_25%,transparent_70%,rgba(255,255,255,0.12))] mix-blend-soft-light" />
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.3)]" />
      <span
        className={cn(
          "absolute inset-0 grid place-items-center font-bold tracking-[-0.02em] text-white/92 [text-shadow:0_2px_10px_rgba(0,0,0,0.35)]",
          game.initials.length > 2 ? "text-[30cqw]" : "text-[38cqw]",
        )}
      >
        {game.initials}
      </span>
    </div>
  );

  if (!game.collection) return tile;

  return (
    <div className={cn("relative shrink-0", SIZE_CLASS[size], className)}>
      <div
        aria-hidden
        className="absolute inset-0 translate-x-[9%] -translate-y-[7%] rotate-6 rounded-[22%] border border-white/15 opacity-45"
        style={{ background: tileBackground(`${game.slug}-b`) }}
      />
      <div
        aria-hidden
        className="absolute inset-0 translate-x-[4%] -translate-y-[3%] rotate-3 rounded-[22%] border border-white/15 opacity-70"
        style={{ background: tileBackground(`${game.slug}-a`) }}
      />
      <div className="absolute inset-0">{tile}</div>
    </div>
  );
}
