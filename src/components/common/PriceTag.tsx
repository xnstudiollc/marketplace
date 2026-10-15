import { Clock, Zap } from "lucide-react";
import { discountPercent } from "@/lib/listing-filters";
import { formatDelivery, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PriceTag({
  price,
  originalPrice,
  size = "md",
  className,
}: {
  price: number;
  originalPrice?: number;
  size?: "md" | "lg";
  className?: string;
}) {
  const off = discountPercent({ price, originalPrice });
  return (
    <div className={cn("tabular flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span className={cn("font-semibold text-fg", size === "lg" ? "text-2xl" : "text-xl")}>{formatPrice(price)}</span>
      {originalPrice && (
        <>
          <s className="text-[0.8125rem] text-fg-subtle">
            <span className="sr-only">Was </span>
            {formatPrice(originalPrice)}
          </s>
          <span className="rounded-md bg-danger/15 px-1.5 py-0.5 text-[0.6875rem] font-semibold tracking-[0.06em] text-danger uppercase">
            −{off}%<span className="sr-only"> sale</span>
          </span>
        </>
      )}
    </div>
  );
}

export function DeliveryBadge({ minutes, className }: { minutes: number; className?: string }) {
  const instant = minutes === 0;
  const Icon = instant ? Zap : Clock;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold tracking-[0.06em] uppercase",
        instant ? "border-success/40 bg-success/10 text-success" : "border-line text-fg-muted",
        className,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {instant ? "Instant delivery" : formatDelivery(minutes)}
    </span>
  );
}
