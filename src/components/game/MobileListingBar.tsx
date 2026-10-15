"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, pluralize } from "@/lib/format";
import { cn } from "@/lib/utils";

export function MobileListingBar({
  visible,
  lowest,
  count,
  activeFilters,
  onFilters,
}: {
  visible: boolean;
  lowest: number | null;
  count: number;
  activeFilters: number;
  onFilters: () => void;
}) {
  return (
    <div
      aria-hidden={!visible || undefined}
      inert={!visible || undefined}
      className={cn(
        "glass-raised fixed inset-x-0 bottom-0 z-40 rounded-none border-x-0 border-b-0 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 ease-out-expo lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
        <div className="tabular leading-tight">
          <p className="text-xs text-fg-muted">{pluralize(count, "offer")} from</p>
          <p className="text-lg font-semibold text-fg">{lowest === null ? "–" : formatPrice(lowest)}</p>
        </div>
        <Button variant="secondary" onClick={onFilters} aria-label={activeFilters ? `Filters, ${activeFilters} active` : "Filters"}>
          <SlidersHorizontal aria-hidden />
          Filters
          {activeFilters > 0 && (
            <span className="tabular grid min-w-5 place-items-center rounded-full bg-brand px-1.5 text-[0.6875rem] leading-5 font-semibold text-white">
              {activeFilters}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
