"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { LISTING_TYPE_META } from "@/lib/categories";
import type { ListingTypeId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ListingTabList({ types, active, counts }: { types: ListingTypeId[]; active: ListingTypeId; counts: Record<string, number> }) {
  const listRef = useRef<HTMLDivElement>(null);

  // Adjusting scrollLeft directly keeps the page from jumping vertically, which scrollIntoView would do.
  useEffect(() => {
    const list = listRef.current;
    const trigger = list?.querySelector<HTMLElement>('[data-state="active"]');
    if (!list || !trigger) return;
    const left = trigger.offsetLeft;
    const right = left + trigger.offsetWidth;
    const pad = 16;
    const visible = left >= list.scrollLeft + pad && right <= list.scrollLeft + list.clientWidth - pad;
    // Aligning to the trigger's snap-start position avoids mandatory snapping pulling it back out of view.
    if (!visible) list.scrollLeft = Math.max(0, left - pad);
  }, [active]);

  return (
    <TabsPrimitive.List
      ref={listRef}
      aria-label="Listing types"
      className="no-scrollbar relative -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-1 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0"
    >
      {types.map((t) => {
        const meta = LISTING_TYPE_META[t];
        const Icon = meta.icon;
        const selected = t === active;
        return (
          <TabsPrimitive.Trigger
            key={t}
            value={t}
            className={cn(
              "relative flex min-h-12 shrink-0 snap-start items-center gap-2 px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
              selected ? "text-fg" : "text-fg-muted hover:text-fg",
            )}
          >
            <Icon className="size-4" strokeWidth={1.75} style={selected ? { color: meta.accent } : undefined} aria-hidden />
            {meta.label}
            <span className="tabular rounded-full bg-white/[0.06] px-1.5 text-[0.6875rem] leading-5 text-fg-muted">{counts[t] ?? 0}</span>
            {selected && (
              <motion.span
                layoutId="listing-tab-underline"
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full"
                style={{ background: meta.accent }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
          </TabsPrimitive.Trigger>
        );
      })}
    </TabsPrimitive.List>
  );
}
