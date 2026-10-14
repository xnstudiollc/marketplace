"use client";

import Link from "next/link";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { DeliveryBadge, PriceTag } from "@/components/common/PriceTag";
import { RatingStars } from "@/components/common/RatingStars";
import { BuyActions } from "@/components/game/BuyActions";
import { SellerAvatar } from "@/components/seller/SellerAvatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LISTING_TYPE_META } from "@/lib/categories";
import { formatCompact, formatResponse } from "@/lib/format";
import { getSellerOrThrow } from "@/lib/mock/sellers";
import { perUnitLabel } from "@/lib/mock/listings";
import type { Game, Listing, ListingTypeId } from "@/lib/types";

const STEPS: Record<ListingTypeId, string[]> = {
  currency: [
    "The seller confirms your character name and server in the order chat.",
    "They hand over the currency by trade or mail.",
    "You confirm receipt, and the payment is released.",
  ],
  accounts: [
    "Login details arrive in the order chat.",
    "You change the email and password with the seller's help.",
    "You confirm everything works, and the payment is released.",
  ],
  items: [
    "The seller messages you to arrange the trade.",
    "The item is traded or gifted to your account.",
    "You confirm receipt, and the payment is released.",
  ],
  services: [
    "You agree on timing and details in the order chat.",
    "The seller works on the order and posts progress updates.",
    "You confirm it is complete, and the payment is released.",
  ],
  keys: [
    "The code or top-up is delivered in the order chat.",
    "You redeem it on your platform or account.",
    "You confirm it activated, and the payment is released.",
  ],
  other: [
    "Message the seller with exactly what you need.",
    "The seller delivers as agreed in the order chat.",
    "You confirm delivery, and the payment is released.",
  ],
};

export function ListingDialog({
  listing,
  open,
  game,
  onOpenChange,
}: {
  listing: Listing | null;
  open: boolean;
  game: Pick<Game, "name">;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open && Boolean(listing)} onOpenChange={onOpenChange}>
      {listing && <ListingDialogBody listing={listing} game={game} />}
    </Dialog>
  );
}

function ListingDialogBody({ listing, game }: { listing: Listing; game: Pick<Game, "name"> }) {
  const seller = getSellerOrThrow(listing.sellerId);
  const meta = LISTING_TYPE_META[listing.type];
  const Icon = meta.icon;
  const perUnit = perUnitLabel(listing);

  return (
    <DialogContent className="glass-raised max-h-[90dvh] gap-0 overflow-y-auto rounded-[20px] p-0 sm:max-w-xl">
      <DialogHeader className="space-y-3 border-b border-line p-5 text-left sm:p-6">
        <p className="flex flex-wrap items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.06em] uppercase" style={{ color: meta.accent }}>
          <Icon className="size-3.5" aria-hidden />
          {meta.label}
          <span className="text-fg-subtle">·</span>
          <span className="text-fg-muted normal-case tracking-normal">{game.name}</span>
        </p>
        <DialogTitle className="pr-8 text-[1.125rem] leading-snug">{listing.title}</DialogTitle>
        <DialogDescription className="sr-only">Listing details and purchase options</DialogDescription>
        <div className="flex flex-wrap items-center gap-1.5">
          {listing.attributes.map((a) => (
            <span key={a} className="rounded-full border border-line bg-white/[0.03] px-2 py-0.5 text-[0.75rem] text-fg-muted">
              {a}
            </span>
          ))}
          <DeliveryBadge minutes={listing.deliveryMinutes} />
        </div>
      </DialogHeader>

      <div className="space-y-6 p-5 sm:p-6">
        <p className="text-fg-muted">{listing.description}</p>

        <section aria-labelledby="delivery-steps">
          <h3 id="delivery-steps" className="mb-3 text-sm font-semibold text-fg">
            How delivery works
          </h3>
          <ol className="space-y-2.5">
            {STEPS[listing.type].map((step, i) => (
              <li key={step} className="flex gap-3 text-sm text-fg-muted">
                <span className="grid size-6 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-xs text-fg">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-label="Seller" className="glass-subtle flex items-center gap-3 rounded-2xl p-4">
          <SellerAvatar seller={seller} showStatus />
          <div className="min-w-0 flex-1 text-[0.8125rem]">
            <p className="flex items-center gap-1.5 text-[0.9375rem] font-semibold text-fg">
              <span className="truncate">{seller.handle}</span>
              {seller.verified && (
                <>
                  <BadgeCheck className="size-4 text-brand-2" aria-hidden />
                  <span className="sr-only">(verified)</span>
                </>
              )}
            </p>
            <p className="tabular flex flex-wrap items-center gap-x-2 text-fg-muted">
              <RatingStars rating={seller.rating} />
              <span>
                {seller.rating.toFixed(1)} · {formatCompact(seller.completedOrders)} orders · replies in{" "}
                {formatResponse(seller.responseMinutes)}
              </span>
            </p>
          </div>
          <Link href={`/sellers/${seller.id}`} className="shrink-0 text-[0.8125rem] font-medium text-brand-2 hover:underline">
            Profile
          </Link>
        </section>

        <div className="flex flex-wrap items-end justify-between gap-2 border-t border-line pt-5">
          <div>
            <PriceTag price={listing.price} originalPrice={listing.originalPrice} size="lg" />
            {perUnit && <p className="tabular mt-0.5 text-xs text-fg-subtle">{perUnit}</p>}
          </div>
          <p className="flex items-center gap-1.5 text-xs text-fg-muted">
            <ShieldCheck className="size-4 text-success" aria-hidden />
            Covered by buyer protection
          </p>
        </div>
        <BuyActions listing={listing} game={game} layout="stack" />
      </div>
    </DialogContent>
  );
}
