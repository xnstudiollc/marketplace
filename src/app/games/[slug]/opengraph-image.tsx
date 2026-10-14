import { notFound } from "next/navigation";
import { CATEGORY_META } from "@/lib/categories";
import { getAllGames, getGame } from "@/lib/data";
import { formatNumber, formatPrice } from "@/lib/format";
import { getGameStats } from "@/lib/mock/stats";
import { OG_SIZE, renderOg } from "@/lib/og";
import { SITE } from "@/lib/site";

export const alt = `Game offers on ${SITE.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllGames().map((g) => ({ slug: g.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  const stats = getGameStats(game);
  const category = CATEGORY_META[game.category];
  return renderOg({
    eyebrow: category.label,
    title: game.name,
    detail: `${formatNumber(stats.offers)} offers from ${formatPrice(stats.fromPrice)} · ${formatNumber(stats.sellers)} sellers`,
    tile: { seed: game.slug, initials: game.initials, accent: category.accent },
  });
}
