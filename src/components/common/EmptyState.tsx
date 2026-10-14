import type { ReactNode } from "react";
import { tileBackground } from "@/components/game/GameImage";
import { cn } from "@/lib/utils";

const TILES = [
  { seed: "empty-a", className: "-rotate-12 -translate-x-10 translate-y-2 opacity-60" },
  { seed: "empty-c", className: "rotate-12 translate-x-10 translate-y-2 opacity-60" },
  { seed: "empty-b", className: "z-10" },
];

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass-subtle flex flex-col items-center rounded-2xl px-6 py-14 text-center", className)}>
      <div aria-hidden className="relative mb-6 grid h-20 w-40 place-items-center">
        {TILES.map((t) => (
          <div
            key={t.seed}
            className={cn(
              "absolute size-16 rounded-[22%] border border-white/15 shadow-[0_12px_30px_rgba(0,0,0,0.35)]",
              t.className,
            )}
            style={{ background: tileBackground(t.seed) }}
          />
        ))}
        <span className="relative z-20 text-2xl font-bold text-white/90 [text-shadow:0_2px_10px_rgba(0,0,0,0.35)]">?</span>
      </div>
      <h2 className="text-lg font-semibold text-fg">{title}</h2>
      {description && <p className="mt-1.5 max-w-sm text-sm text-fg-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
