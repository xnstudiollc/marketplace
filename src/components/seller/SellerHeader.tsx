import Link from "next/link";
import { BadgeCheck, CalendarDays, CheckCircle2, Clock, Languages, Package, Star, Trophy } from "lucide-react";
import { GameImage } from "@/components/game/GameImage";
import { SellerAvatar } from "@/components/seller/SellerAvatar";
import { formatNumber, formatResponse } from "@/lib/format";
import type { SellerCatalog } from "@/lib/data";
import type { Seller } from "@/lib/types";
import { cn } from "@/lib/utils";

function bannerBackground(hue: number) {
  return [
    `radial-gradient(120% 140% at 0% 0%, hsl(${hue} 80% 55% / 0.55), transparent 60%)`,
    `radial-gradient(90% 120% at 100% 10%, hsl(${(hue + 60) % 360} 75% 50% / 0.4), transparent 65%)`,
    `linear-gradient(135deg, hsl(${hue} 45% 16%), hsl(${(hue + 40) % 360} 40% 10%))`,
  ].join(", ");
}

export function SellerHeader({ seller, games }: { seller: Seller; games: SellerCatalog["games"] }) {
  const stats = [
    { icon: Star, label: "Rating", value: `${seller.rating.toFixed(1)} / 5`, hint: `${formatNumber(seller.reviewCount)} reviews` },
    { icon: Package, label: "Completed orders", value: formatNumber(seller.completedOrders) },
    { icon: Clock, label: "Response time", value: formatResponse(seller.responseMinutes) },
    { icon: CheckCircle2, label: "Completion rate", value: `${seller.completionRate.toFixed(1)}%` },
  ];

  return (
    <section aria-labelledby="seller-title" className="glass overflow-hidden rounded-3xl">
      <div aria-hidden className="relative h-28 sm:h-40" style={{ background: bannerBackground(seller.hue) }}>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,rgba(7,8,13,0.55))]" />
      </div>
      <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:gap-6">
          <SellerAvatar seller={seller} size="lg" showStatus className="ring-4 ring-bg sm:size-24" />
          <div className="min-w-0 flex-1 sm:pt-12">
            <h1 id="seller-title" className="flex flex-wrap items-center gap-2 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
              <span className="truncate">{seller.handle}</span>
              {seller.verified && (
                <span className="inline-flex items-center gap-1 rounded-full border border-brand-2/40 bg-brand-2/10 px-2 py-0.5 text-[0.6875rem] font-semibold tracking-[0.06em] text-brand-2 uppercase">
                  <BadgeCheck className="size-3.5" aria-hidden /> Verified
                </span>
              )}
              {seller.topSeller && (
                <span className="inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-[0.6875rem] font-semibold tracking-[0.06em] text-warning uppercase">
                  <Trophy className="size-3.5" aria-hidden /> Top seller
                </span>
              )}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className={cn("size-2 rounded-full", seller.online ? "bg-success" : "bg-fg-subtle")} aria-hidden />
                {seller.online ? "Online now" : "Offline"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden /> Member since {seller.memberSince}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Languages className="size-4" aria-hidden /> {seller.languages.join(", ")}
              </span>
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4">
          {stats.map(({ icon: Icon, label, value, hint }) => (
            <div key={label} className="rounded-xl border border-line bg-white/[0.02] px-3 py-2.5">
              <dt className="flex items-center gap-1.5 text-[0.75rem] text-fg-subtle">
                <Icon className="size-3.5" aria-hidden />
                {label}
              </dt>
              <dd className="tabular mt-0.5 text-base font-semibold text-fg">
                {value}
                {hint && <span className="block text-xs font-normal text-fg-subtle sm:ml-1.5 sm:inline">{hint}</span>}
              </dd>
            </div>
          ))}
        </dl>

        {games.length > 0 && (
          <div className="mt-6">
            <h2 className="text-[0.6875rem] font-semibold tracking-[0.06em] text-fg-subtle uppercase">Games</h2>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {games.map((g) => (
                <li key={g.slug} className="max-w-full">
                  <Link
                    href={`/games/${g.slug}`}
                    className="glass-subtle inline-flex min-h-9 max-w-full items-center gap-2 rounded-full py-1 pr-3 pl-1 text-[0.8125rem] font-medium text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
                  >
                    <GameImage game={g} size="sm" className="size-7" />
                    <span className="truncate">{g.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
