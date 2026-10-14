"use client";

import { memo } from "react";
import { GlowCard } from "@/components/common/GlowCard";
import { DeliveryBadge, PriceTag } from "@/components/common/PriceTag";
import { BuyActions } from "@/components/game/BuyActions";
import { SellerMini } from "@/components/game/SellerMini";
import { LISTING_TYPE_META } from "@/lib/categories";
import { getSellerOrThrow } from "@/lib/mock/sellers";
import { perUnitLabel } from "@/lib/mock/listings";
import type { Game, Listing } from "@/lib/types";

export const ListingCard = memo(function ListingCard({
  listing,
  game,
  onOpen,
}: {
  listing: Listing;
  game: Pick<Game, "name">;
  onOpen: (listing: Listing) => void;
}) {
  const seller = getSellerOrThrow(listing.sellerId);
  const perUnit = perUnitLabel(listing);
  const accent = LISTING_TYPE_META[listing.type].accent;

  return (
    <GlowCard
      accent={accent}
      className="relative grid gap-4 rounded-2xl p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_auto] md:[grid-template-areas:'seller_price''main_price'] xl:grid-cols-[190px_minmax(0,1fr)_auto] xl:items-center xl:[grid-template-areas:'seller_main_price']"
    >
      <div className="md:[grid-area:seller]">
        <SellerMini seller={seller} />
      </div>

      <div className="min-w-0 md:[grid-area:main]">
        <h3 className="text-[0.9375rem] leading-snug font-semibold text-fg">
          <button
            type="button"
            onClick={() => onOpen(listing)}
            className="text-left after:absolute after:inset-0 after:rounded-2xl after:content-[''] hover:text-brand-2 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
          >
            {listing.title}
          </button>
        </h3>
        <ul className="mt-2 flex flex-wrap items-center gap-1.5" aria-label="Details">
          {listing.attributes.slice(0, 3).map((a) => (
            <li key={a} className="rounded-full border border-line bg-white/[0.03] px-2 py-0.5 text-[0.75rem] text-fg-muted">
              {a}
            </li>
          ))}
          <li>
            <DeliveryBadge minutes={listing.deliveryMinutes} />
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3 border-t border-line pt-4 md:flex-col md:[grid-area:price] md:items-end md:justify-center md:border-0 md:pt-0 md:text-right">
        <div className="md:text-right">
          <PriceTag price={listing.price} originalPrice={listing.originalPrice} className="md:justify-end" />
          {perUnit && <p className="tabular mt-0.5 text-xs text-fg-subtle">{perUnit}</p>}
          {listing.stock > 1 && <p className="tabular mt-0.5 text-xs text-fg-subtle">{listing.stock} in stock</p>}
        </div>
        <BuyActions listing={listing} game={game} />
      </div>
    </GlowCard>
  );
});
