import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({ rating, className, size = "sm" }: { rating: number; className?: string; size?: "sm" | "md" }) {
  const icon = size === "sm" ? "size-3.5" : "size-4";
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className={cn("relative", icon)} aria-hidden>
            <Star className={cn("absolute inset-0 text-white/15", icon)} fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={cn("text-warning", icon)} fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </span>
  );
}
