import Link from "next/link";
import { BadgeCheck, Clock, PackageCheck } from "lucide-react";
import { GlowCard } from "@/components/common/GlowCard";
import { RatingStars } from "@/components/common/RatingStars";
import { Reveal, Stagger } from "@/components/common/Reveal";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SellerAvatar } from "@/components/seller/SellerAvatar";
import { formatCompact, formatResponse } from "@/lib/format";
import type { Seller } from "@/lib/types";

export function SellerSpotlight({ sellers }: { sellers: Seller[] }) {
  return (
    <section aria-labelledby="sellers-title" className="container-page section-y">
      <Reveal>
        <SectionHeader
          id="sellers-title"
          eyebrow="Seller spotlight"
          title="Sellers buyers keep coming back to"
          description="Ratings, order counts and response times come from completed orders only."
        />
      </Reveal>
      <Stagger as="ul" className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4" itemClassName="h-full">
        {sellers.map((s) => (
          <GlowCard key={s.id} asChild accent={`hsl(${s.hue} 75% 60%)`} className="h-full rounded-2xl">
            <Link href={`/sellers/${s.id}`} className="flex h-full flex-col gap-4 p-5">
              <div className="flex items-center gap-3">
                <SellerAvatar seller={s} showStatus />
                <div className="min-w-0">
                  <h3 className="flex items-center gap-1.5 font-semibold text-fg">
                    <span className="truncate">{s.handle}</span>
                    {s.verified && (
                      <>
                        <BadgeCheck className="size-4 shrink-0 text-brand-2" aria-hidden />
                        <span className="sr-only">(verified)</span>
                      </>
                    )}
                  </h3>
                  <p className="flex flex-wrap items-center gap-x-1.5 text-[0.8125rem] text-fg-muted">
                    <RatingStars rating={s.rating} />
                    <span className="tabular font-medium text-fg">{s.rating.toFixed(1)}</span>
                    <span className="tabular">({formatCompact(s.reviewCount)})</span>
                  </p>
                </div>
              </div>
              <dl className="mt-auto grid grid-cols-2 gap-2 text-[0.8125rem]">
                <div className="rounded-xl border border-line bg-white/[0.02] p-2.5">
                  <dt className="flex items-center gap-1.5 text-fg-subtle">
                    <PackageCheck className="size-3.5" aria-hidden />
                    Orders
                  </dt>
                  <dd className="tabular mt-0.5 font-semibold text-fg">{formatCompact(s.completedOrders)}</dd>
                </div>
                <div className="rounded-xl border border-line bg-white/[0.02] p-2.5">
                  <dt className="flex items-center gap-1.5 text-fg-subtle">
                    <Clock className="size-3.5" aria-hidden />
                    Replies in
                  </dt>
                  <dd className="tabular mt-0.5 font-semibold text-fg">{formatResponse(s.responseMinutes)}</dd>
                </div>
              </dl>
            </Link>
          </GlowCard>
        ))}
      </Stagger>
    </section>
  );
}
