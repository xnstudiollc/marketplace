import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { SectionHeader } from "@/components/common/SectionHeader";
import { GameGrid } from "@/components/game/GameGrid";
import { GameHero } from "@/components/game/GameHero";
import { GameListings } from "@/components/game/GameListings";
import { WhyBuyHere } from "@/components/game/WhyBuyHere";
import { CATEGORY_META, LISTING_TYPE_META, LISTING_TYPE_ORDER } from "@/lib/categories";
import { getAllGames, getBrowseEntries, getGame, getRelatedGames } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { getGameStats } from "@/lib/mock/stats";

export function generateStaticParams() {
  return getAllGames().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/games/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return {};
  const stats = getGameStats(game);
  const types = LISTING_TYPE_ORDER.filter((t) => game.listingTypes.includes(t))
    .map((t) => LISTING_TYPE_META[t].label.toLowerCase())
    .slice(0, 4);
  const list = types.length > 1 ? `${types.slice(0, -1).join(", ")} and ${types[types.length - 1]}` : types[0];
  const description = `Buy ${game.name} ${list} from ${stats.sellers} verified sellers. ${stats.offers} offers from ${formatPrice(stats.fromPrice)}, with buyer protection on every order.`;
  return {
    title: game.name,
    description,
    alternates: { canonical: `/games/${game.slug}` },
    openGraph: { title: `${game.name} offers`, description, url: `/games/${game.slug}` },
  };
}

export default async function GamePage({ params }: PageProps<"/games/[slug]">) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  const stats = getGameStats(game);
  const category = CATEGORY_META[game.category];
  const related = getBrowseEntries(getRelatedGames(game, 8));
  const instantOffers = Math.round(stats.offers * stats.instantShare);

  return (
    <div className="container-page pt-6 pb-16 sm:pt-8">
      <Breadcrumbs
        className="mb-5"
        items={[{ label: "Home", href: "/" }, { label: category.label, href: `/category/${game.category}` }, { label: game.name }]}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]">
        <GameHero game={game} stats={stats} />
        <WhyBuyHere instantOffers={instantOffers} className="hidden lg:block" />
      </div>

      <div className="mt-10 sm:mt-12">
        <GameListings game={game} />
      </div>

      <WhyBuyHere instantOffers={instantOffers} className="mt-10 lg:hidden" />

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-14 sm:mt-16">
          <SectionHeader id="related-title" eyebrow={category.label} title="You might also like" />
          <GameGrid games={related} />
        </section>
      )}
    </div>
  );
}
