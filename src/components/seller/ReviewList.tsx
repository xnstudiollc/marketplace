"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { RatingStars } from "@/components/common/RatingStars";
import { formatDaysAgo, formatNumber } from "@/lib/format";
import type { Review } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RatingDistribution({
  rating,
  reviewCount,
  distribution,
}: {
  rating: number;
  reviewCount: number;
  distribution: { stars: number; share: number }[];
}) {
  return (
    <div className="glass-subtle rounded-2xl p-5">
      <p className="tabular text-4xl font-bold tracking-tight text-fg">{rating.toFixed(1)}</p>
      <RatingStars rating={rating} size="md" className="mt-1.5" />
      <p className="mt-1 text-sm text-fg-muted">{formatNumber(reviewCount)} reviews</p>
      <ul className="mt-5 space-y-2" aria-label="Rating distribution">
        {distribution.map(({ stars, share }) => {
          const pct = Math.round(share * 100);
          return (
            <li key={stars} className="grid grid-cols-[3.25rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs text-fg-muted">
              <span className="tabular">{stars} star{stars === 1 ? "" : "s"}</span>
              <span className="h-2 overflow-hidden rounded-full bg-white/[0.06]" aria-hidden>
                <span
                  className="block h-full rounded-full bg-[linear-gradient(90deg,var(--brand),var(--brand-2))]"
                  style={{ width: `${Math.max(pct, share > 0 ? 1 : 0)}%` }}
                />
              </span>
              <span className="tabular text-right">
                {pct}%<span className="sr-only"> of reviews</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  const [voted, setVoted] = useState<Record<string, boolean>>({});

  return (
    <ul className="space-y-3">
      {reviews.map((r) => {
        const pressed = Boolean(voted[r.id]);
        return (
          <li key={r.id} className="glass-subtle rounded-2xl p-4 sm:p-5">
            <article aria-label={`Review by ${r.author}`}>
              <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="grid size-8 place-items-center rounded-full border border-line bg-white/[0.04] text-xs font-semibold text-fg-muted uppercase"
                  >
                    {r.author.charAt(0)}
                  </span>
                  <span className="font-medium text-fg">{r.author}</span>
                </p>
                <p className="flex items-center gap-2 text-xs text-fg-subtle">
                  <RatingStars rating={r.rating} />
                  <span>{formatDaysAgo(r.daysAgo)}</span>
                </p>
              </header>
              <p className="mt-3 text-[0.9375rem] text-fg">{r.text}</p>
              <footer className="mt-3 flex flex-wrap items-center justify-between gap-2">
                {r.gameName ? <span className="text-xs text-fg-subtle">Order: {r.gameName}</span> : <span />}
                <button
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => setVoted((v) => ({ ...v, [r.id]: !pressed }))}
                  className={cn(
                    "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    pressed ? "border-brand/60 bg-brand/15 text-fg" : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
                  )}
                >
                  <ThumbsUp className="size-3.5" fill={pressed ? "currentColor" : "none"} aria-hidden />
                  Helpful
                  <span className="tabular">({r.helpful + (pressed ? 1 : 0)})</span>
                </button>
              </footer>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
