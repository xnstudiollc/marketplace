import art from "@/generated/game-art.json";

/** Compact entry from `scripts/index-game-assets.mjs`: IGDB cover (c), artwork (a), screenshot (s) ids, or a Steam app id (h). */
interface ArtEntry {
  c?: string;
  a?: string;
  s?: string;
  h?: number;
}

const ART = art as Record<string, ArtEntry>;
const igdb = (size: string, id: string) => `https://images.igdb.com/igdb/image/upload/${size}/${id}.jpg`;
const steam = (appid: number) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`;

export interface GameArt {
  /** Portrait box art; undefined when only artwork or a Steam header exists. */
  cover?: string;
  /** Best image for a square or portrait tile. */
  tile: string;
  /** Wide image for hero banners. */
  banner?: string;
}

export function getGameArt(slug: string): GameArt | undefined {
  const e = ART[slug];
  if (!e) return undefined;
  const cover = e.c ? igdb("t_cover_big", e.c) : undefined;
  const tile = cover ?? (e.a ? igdb("t_720p", e.a) : e.h ? steam(e.h) : undefined);
  if (!tile) return undefined;
  const banner = e.a ? igdb("t_1080p", e.a) : e.s ? igdb("t_1080p", e.s) : e.h ? steam(e.h) : undefined;
  return { cover, tile, banner };
}
