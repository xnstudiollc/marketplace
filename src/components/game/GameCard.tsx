import Link from "next/link";
import { GlowCard } from "@/components/common/GlowCard";
import { GameImage } from "@/components/game/GameImage";
import { CATEGORY_META, LISTING_TYPE_META, LISTING_TYPE_ORDER } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import type { BrowseEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

export type GameCardData = Pick<BrowseEntry, "name" | "slug" | "category" | "initials" | "collection" | "listingTypes" | "fromPrice">;

export function GameCard({ game, priority, className }: { game: GameCardData; priority?: boolean; className?: string }) {
  const category = CATEGORY_META[game.category];
  const types = LISTING_TYPE_ORDER.filter((t) => game.listingTypes.includes(t));

  return (
    <GlowCard asChild accent={category.accent} className={cn("rounded-2xl", className)}>
      <Link
        href={`/games/${game.slug}`}
        className="flex h-full flex-col gap-3 p-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:p-4"
      >
        <div className="flex items-start justify-between gap-2">
          <GameImage game={game} size="md" priority={priority} className="size-14 sm:size-[72px]" />
          {game.fromPrice > 0 && (
            <p className="tabular text-right leading-tight">
              <span className="block text-[0.6875rem] text-fg-subtle">From</span>
              <span className="text-[0.9375rem] font-semibold text-fg">{formatPrice(game.fromPrice)}</span>
            </p>
          )}
        </div>
        <div className="min-w-0 space-y-1.5">
          <h3 title={game.name} className="line-clamp-2 text-[0.9375rem] leading-snug font-semibold text-fg">
            {game.name}
          </h3>
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-[0.6875rem] font-medium text-fg-muted">
            <span className="size-1.5 shrink-0 rounded-full" style={{ background: category.accent }} aria-hidden />
            <span className="truncate">{category.label}</span>
          </span>
        </div>
        <ul className="mt-auto flex gap-1 border-t border-line pt-3" aria-label="Listing types">
          {types.map((t) => {
            const meta = LISTING_TYPE_META[t];
            const Icon = meta.icon;
            return (
              <li key={t} className="grid size-5 place-items-center text-fg-subtle sm:size-6">
                <Icon className="size-3.5 sm:size-4" strokeWidth={1.75} aria-hidden />
                <span className="sr-only">{meta.label}</span>
              </li>
            );
          })}
        </ul>
      </Link>
    </GlowCard>
  );
}
