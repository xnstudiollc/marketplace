"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { MessageSquareText, Tag } from "lucide-react";
import { Chip } from "@/components/common/Chip";
import { EmptyState } from "@/components/common/EmptyState";
import { GameImage } from "@/components/game/GameImage";
import { ListingCard } from "@/components/game/ListingCard";
import { ListingDialog } from "@/components/game/ListingDialog";
import { RatingDistribution, ReviewList } from "@/components/seller/ReviewList";
import { Button } from "@/components/ui/button";
import { useQueryState } from "@/hooks/use-query-state";
import { LISTING_TYPE_META } from "@/lib/categories";
import { pluralize } from "@/lib/format";
import type { SellerCatalog } from "@/lib/data";
import { LISTING_PAGE_SIZE } from "@/lib/listing-filters";
import type { Listing, Review, Seller } from "@/lib/types";
import { cn } from "@/lib/utils";

type SellerTab = "offers" | "reviews";

export function SellerTabs({
  seller,
  catalog,
  reviews,
  distribution,
}: {
  seller: Seller;
  catalog: SellerCatalog;
  reviews: Review[];
  distribution: { stars: number; share: number }[];
}) {
  const { params, update } = useQueryState();
  const tab: SellerTab = params.get("tab") === "reviews" ? "reviews" : "offers";
  const [game, setGame] = useState<string | null>(null);
  const [limit, setLimit] = useState(LISTING_PAGE_SIZE);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [open, setOpen] = useState(false);

  const gamesBySlug = new Map(catalog.games.map((g) => [g.slug, g]));
  const results = game ? catalog.listings.filter((l) => l.gameSlug === game) : catalog.listings;
  const visible = results.slice(0, limit);
  const remaining = results.length - visible.length;
  const selectedGame = selected ? gamesBySlug.get(selected.gameSlug) : undefined;

  const pickGame = (slug: string | null) => {
    setGame(slug);
    setLimit(LISTING_PAGE_SIZE);
  };

  const tabs = [
    { id: "offers" as const, label: "Offers", icon: Tag, count: catalog.listings.length },
    { id: "reviews" as const, label: "Reviews", icon: MessageSquareText, count: reviews.length },
  ];

  return (
    <TabsPrimitive.Root value={tab} onValueChange={(t) => update({ tab: t === "offers" ? null : t })}>
      <TabsPrimitive.List aria-label="Seller sections" className="flex gap-1 border-b border-line">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <TabsPrimitive.Trigger
            key={id}
            value={id}
            className={cn(
              "relative flex min-h-12 items-center gap-2 px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
              tab === id ? "text-fg" : "text-fg-muted hover:text-fg",
            )}
          >
            <Icon className="size-4" strokeWidth={1.75} aria-hidden />
            {label}
            <span className="tabular rounded-full bg-white/[0.06] px-1.5 text-[0.6875rem] leading-5 text-fg-muted">{count}</span>
            {tab === id && (
              <motion.span
                layoutId="seller-tab-underline"
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>

      <TabsPrimitive.Content value="offers" className="mt-6 space-y-4 focus-visible:outline-none">
        {catalog.games.length > 1 && (
          <div role="radiogroup" aria-label="Filter offers by game" className="flex flex-wrap gap-2">
            <Chip mode="radio" selected={game === null} onClick={() => pickGame(null)}>
              All games
            </Chip>
            {catalog.games.map((g) => (
              <Chip key={g.slug} mode="radio" selected={game === g.slug} onClick={() => pickGame(g.slug)}>
                {g.name}
              </Chip>
            ))}
          </div>
        )}
        <p className="tabular text-sm text-fg-muted" aria-live="polite" aria-atomic>
          <span className="font-semibold text-fg">{pluralize(results.length, "offer")}</span>
          {game && <> for {gamesBySlug.get(game)?.name}</>}
        </p>
        {visible.length ? (
          <ul className="space-y-3">
            {visible.map((l) => {
              const g = gamesBySlug.get(l.gameSlug);
              if (!g) return null;
              const meta = LISTING_TYPE_META[l.type];
              return (
                <li key={l.id}>
                  <ListingCard
                    listing={l}
                    game={g}
                    onOpen={(listing) => {
                      setSelected(listing);
                      setOpen(true);
                    }}
                    lead={
                      <div className="flex min-w-0 items-center gap-3">
                        <GameImage game={g} size="sm" />
                        <div className="min-w-0 text-[0.8125rem] leading-tight">
                          <p className="truncate font-semibold text-fg">{g.name}</p>
                          <p className="mt-1 inline-flex items-center gap-1 text-fg-muted">
                            <meta.icon className="size-3.5" style={{ color: meta.accent }} aria-hidden />
                            {meta.label}
                          </p>
                        </div>
                      </div>
                    }
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState title={`${seller.handle} has no offers right now`} description="Check back soon, or browse other sellers on any game page." />
        )}
        {remaining > 0 && (
          <div className="flex justify-center pt-2">
            <Button variant="secondary" size="lg" onClick={() => setLimit(limit + LISTING_PAGE_SIZE)}>
              Load {Math.min(remaining, LISTING_PAGE_SIZE)} more
            </Button>
          </div>
        )}
      </TabsPrimitive.Content>

      <TabsPrimitive.Content value="reviews" className="mt-6 focus-visible:outline-none">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
            <RatingDistribution rating={seller.rating} reviewCount={seller.reviewCount} distribution={distribution} />
          </div>
          <ReviewList reviews={reviews} />
        </div>
      </TabsPrimitive.Content>

      <ListingDialog listing={selected} open={open} game={selectedGame ?? { name: "" }} onOpenChange={setOpen} />
    </TabsPrimitive.Root>
  );
}
