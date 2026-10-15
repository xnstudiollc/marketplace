import type { CSSProperties } from "react";
import Link from "next/link";
import { Clock, Store, Tag, Wallet } from "lucide-react";
import { ArtImage } from "@/components/game/ArtImage";
import { getGameArt } from "@/lib/game-art";
import { GameImage, tileBackground } from "@/components/game/GameImage";
import { NotifyButton } from "@/components/game/NotifyButton";
import { CATEGORY_META, LISTING_TYPE_META, LISTING_TYPE_ORDER } from "@/lib/categories";
import { formatDelivery, formatNumber, formatPrice } from "@/lib/format";
import type { GameStats } from "@/lib/mock/stats";
import type { Game } from "@/lib/types";

export function GameHero({ game, stats }: { game: Game; stats: GameStats }) {
  const category = CATEGORY_META[game.category];
  const art = getGameArt(game.slug);
  const types = LISTING_TYPE_ORDER.filter((t) => game.listingTypes.includes(t));
  const facts = [
    { icon: Tag, label: "Offers", value: formatNumber(stats.offers) },
    { icon: Store, label: "Sellers", value: formatNumber(stats.sellers) },
    { icon: Clock, label: "Typical delivery", value: formatDelivery(stats.medianDeliveryMinutes) },
    { icon: Wallet, label: "From", value: formatPrice(stats.fromPrice) },
  ];

  return (
    <section
      aria-labelledby="game-title"
      className="glass relative isolate overflow-hidden rounded-3xl p-5 sm:p-8"
      style={{ "--cat-accent": category.accent } as CSSProperties}
    >
      {art?.banner && (
        <div
          className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_10%,transparent_95%)] sm:[mask-image:linear-gradient(to_left,black_5%,transparent_90%)]"
        >
          <ArtImage src={art.banner} sizes="(min-width: 1024px) 900px, 100vw" priority className="opacity-40" />
        </div>
      )}
      <div
        aria-hidden
        className="absolute -top-1/3 -right-[10%] -z-10 aspect-square w-[70%] max-w-[560px] rounded-[22%] opacity-30 blur-[90px]"
        style={{ background: tileBackground(game.slug) }}
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -left-24 -z-10 size-72 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--cat-accent)" }}
      />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <GameImage game={game} size="lg" priority portrait alt={`${game.name} cover art`} className="size-24 sm:size-[120px] w-24 sm:w-[120px]" />
        <div className="min-w-0 flex-1">
          <Link
            href={`/category/${game.category}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-2.5 py-1 text-[0.75rem] font-medium text-fg-muted hover:border-line-strong hover:text-fg"
          >
            <span className="size-1.5 rounded-full" style={{ background: category.accent }} aria-hidden />
            {category.label}
          </Link>
          <h1 id="game-title" className="mt-3 text-3xl font-bold tracking-tight text-balance text-fg sm:text-4xl">
            {game.name}
          </h1>
          {game.collection && (
            <p className="mt-2 max-w-xl text-sm text-fg-muted">
              This page groups many smaller titles under one name, so offers cover a range of related games.
            </p>
          )}
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Available listing types">
            {types.map((t) => {
              const meta = LISTING_TYPE_META[t];
              const Icon = meta.icon;
              return (
                <li
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[0.75rem] font-medium text-fg-muted"
                >
                  <Icon className="size-3.5" style={{ color: meta.accent }} strokeWidth={1.75} aria-hidden />
                  {meta.label}
                </li>
              );
            })}
          </ul>
          <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border border-line bg-white/[0.02] px-3 py-2.5">
                <dt className="flex items-center gap-1.5 text-[0.75rem] text-fg-subtle">
                  <Icon className="size-3.5" aria-hidden />
                  {label}
                </dt>
                <dd className="tabular mt-0.5 text-base font-semibold text-fg">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 -ml-3">
            <NotifyButton gameName={game.name} />
          </div>
        </div>
      </div>
    </section>
  );
}
