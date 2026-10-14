import Link from "next/link";
import { BadgeCheck, Clock, Star } from "lucide-react";
import { SellerAvatar } from "@/components/seller/SellerAvatar";
import { formatCompact, formatResponse } from "@/lib/format";
import type { Seller } from "@/lib/types";

export function SellerMini({ seller }: { seller: Seller }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <SellerAvatar seller={seller} size="md" showStatus className="size-10 text-xs" />
      <div className="min-w-0 text-[0.8125rem] leading-tight">
        <p className="flex items-center gap-1">
          <Link
            href={`/sellers/${seller.id}`}
            className="relative z-10 truncate font-semibold text-fg hover:text-brand-2 hover:underline"
          >
            {seller.handle}
          </Link>
          {seller.verified && (
            <>
              <BadgeCheck className="size-3.5 shrink-0 text-brand-2" aria-hidden />
              <span className="sr-only">(verified)</span>
            </>
          )}
        </p>
        <p className="tabular mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-fg-muted">
          <span className="inline-flex items-center gap-1">
            <Star className="size-3 text-warning" fill="currentColor" strokeWidth={0} aria-hidden />
            <span className="font-medium text-fg">{seller.rating.toFixed(1)}</span>
            <span className="sr-only">out of 5,</span>
            <span>({formatCompact(seller.reviewCount)})</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" aria-hidden />
            <span className="sr-only">Replies in</span>
            {formatResponse(seller.responseMinutes)}
          </span>
        </p>
      </div>
    </div>
  );
}
