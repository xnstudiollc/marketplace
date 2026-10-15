import type { Seller } from "@/lib/types";
import { cn } from "@/lib/utils";

const SIZE = { sm: "size-8 text-[0.6875rem]", md: "size-12 text-sm", lg: "size-20 text-2xl" } as const;

export function SellerAvatar({
  seller,
  size = "md",
  showStatus = false,
  className,
}: {
  seller: Pick<Seller, "handle" | "hue" | "online">;
  size?: keyof typeof SIZE;
  showStatus?: boolean;
  className?: string;
}) {
  const letters = seller.handle.replace(/[^A-Z]/g, "").slice(0, 2) || seller.handle.slice(0, 2).toUpperCase();
  return (
    <span className={cn("relative inline-grid shrink-0 place-items-center rounded-full font-bold text-white/92", SIZE[size], className)}>
      <span
        aria-hidden
        className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
        style={{
          background: `linear-gradient(135deg, hsl(${seller.hue} 75% 52%), hsl(${(seller.hue + 40) % 360} 70% 38%))`,
        }}
      />
      <span className="relative [text-shadow:0_1px_6px_rgba(0,0,0,0.35)]" aria-hidden>
        {letters}
      </span>
      {showStatus && (
        <span
          className={cn(
            "absolute right-0 bottom-0 size-[28%] min-h-2.5 min-w-2.5 rounded-full ring-2 ring-bg",
            seller.online ? "bg-success" : "bg-fg-subtle",
          )}
        >
          <span className="sr-only">{seller.online ? "Online" : "Offline"}</span>
        </span>
      )}
    </span>
  );
}
