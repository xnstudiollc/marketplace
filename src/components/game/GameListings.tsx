"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { EmptyState } from "@/components/common/EmptyState";
import { ListingCard } from "@/components/game/ListingCard";
import { ListingDialog } from "@/components/game/ListingDialog";
import { ListingFilters } from "@/components/game/ListingFilters";
import { ListingTabList } from "@/components/game/ListingTabs";
import { MobileListingBar } from "@/components/game/MobileListingBar";
import { VariantSelector } from "@/components/game/VariantSelector";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useQueryState } from "@/hooks/use-query-state";
import { LISTING_TYPE_META, LISTING_TYPE_ORDER, isListingTypeId } from "@/lib/categories";
import { pluralize } from "@/lib/format";
import {
  DEFAULT_FILTERS,
  LISTING_PAGE_SIZE,
  activeListingFilterCount,
  applyListingFilters,
  priceBounds,
  type ListingFilterState,
} from "@/lib/listing-filters";
import { getListings } from "@/lib/mock/listings";
import type { Game, Listing, ListingTypeId } from "@/lib/types";

const unique = (values: (string | undefined)[]) => [...new Set(values.filter((v): v is string => Boolean(v)))];

export function GameListings({ game }: { game: Game }) {
  const { params, update } = useQueryState();
  const types = useMemo(() => LISTING_TYPE_ORDER.filter((t) => game.listingTypes.includes(t)), [game.listingTypes]);
  const rawTab = params.get("tab") ?? "";
  const tab: ListingTypeId = isListingTypeId(rawTab) && types.includes(rawTab) ? rawTab : types[0];
  const rawVariant = params.get("v");
  const variant = rawVariant && game.variants?.includes(rawVariant) ? rawVariant : null;

  const [filtersByTab, setFiltersByTab] = useState<Partial<Record<ListingTypeId, ListingFilterState>>>({});
  const filters = filtersByTab[tab] ?? DEFAULT_FILTERS;
  const setFilters = useCallback(
    (next: Partial<ListingFilterState>) => setFiltersByTab((prev) => ({ ...prev, [tab]: { ...(prev[tab] ?? DEFAULT_FILTERS), ...next } })),
    [tab],
  );

  const counts = useMemo(
    () => Object.fromEntries(types.map((t) => [t, getListings(game, t, variant ?? undefined).length])),
    [game, types, variant],
  );
  const base = useMemo(() => getListings(game, tab, variant ?? undefined), [game, tab, variant]);
  const bounds = useMemo(() => priceBounds(base), [base]);
  const effective = useMemo<ListingFilterState>(() => {
    if (!filters.price) return filters;
    const lo = Math.max(bounds[0], filters.price[0]);
    const hi = Math.min(bounds[1], filters.price[1]);
    return { ...filters, price: lo <= bounds[0] && hi >= bounds[1] ? null : [lo, hi] };
  }, [filters, bounds]);
  const results = useMemo(() => applyListingFilters(base, effective), [base, effective]);
  const labels = useMemo(() => {
    const present = new Set(base.map((l) => l.labelName));
    return unique(game.labels.filter((l) => l.type === tab).map((l) => l.name)).filter((n) => present.has(n));
  }, [base, game.labels, tab]);
  const experiences = useMemo(() => unique(base.map((l) => l.experience)).sort((a, b) => a.localeCompare(b)), [base]);

  const signature = JSON.stringify([tab, variant, effective]);
  const [paging, setPaging] = useState({ signature, limit: LISTING_PAGE_SIZE });
  const limit = paging.signature === signature ? paging.limit : LISTING_PAGE_SIZE;
  const visible = results.slice(0, limit);
  const remaining = results.length - visible.length;

  const [selected, setSelected] = useState<Listing | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const openListing = (listing: Listing) => {
    setSelected(listing);
    setDialogOpen(true);
  };

  const [sheetOpen, setSheetOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "0px 0px -35% 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const accent = LISTING_TYPE_META[tab].accent;
  const active = activeListingFilterCount(effective);
  const filterProps = { state: effective, onChange: setFilters, bounds, labels, experiences, accent };
  const lowest = results.length ? Math.min(...results.map((l) => l.price)) : null;

  return (
    <section ref={sectionRef} aria-labelledby="offers-title" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="offers-title" className="text-2xl font-bold tracking-tight text-fg">
          Offers
        </h2>
        {game.variants?.length ? (
          <VariantSelector variants={game.variants} value={variant} onChange={(v) => update({ v })} />
        ) : null}
      </div>

      <TabsPrimitive.Root value={tab} onValueChange={(t) => update({ tab: t === types[0] ? null : t })} activationMode="manual">
        <ListingTabList types={types} active={tab} counts={counts} />
        <div className="mt-6 lg:grid lg:grid-cols-[272px_minmax(0,1fr)] lg:gap-8">
          <aside aria-label="Offer filters" className="hidden lg:block">
            <div className="glass no-scrollbar sticky top-[calc(var(--header-h)+1.5rem)] max-h-[calc(100dvh-var(--header-h)-3rem)] overflow-y-auto rounded-2xl p-4">
              <ListingFilters idPrefix="side" {...filterProps} />
            </div>
          </aside>
          {types.map((t) => (
            <TabsPrimitive.Content key={t} value={t} className="min-w-0 space-y-3 focus-visible:outline-none">
              {t === tab && (
                <>
                  <p className="tabular text-sm text-fg-muted" aria-live="polite" aria-atomic>
                    <span className="font-semibold text-fg">{pluralize(results.length, "offer")}</span>
                    {variant && <> on {variant}</>}
                    {active > 0 && <> · {pluralize(active, "filter")} applied</>}
                  </p>
                  {visible.length ? (
                    <ul className="space-y-3">
                      {visible.map((l) => (
                        <li key={l.id}>
                          <ListingCard listing={l} game={game} onOpen={openListing} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState
                      title="No offers match these filters"
                      description="Widen the price range or remove a filter to see more sellers."
                      action={<Button onClick={() => setFilters({ ...DEFAULT_FILTERS, sort: filters.sort })}>Clear filters</Button>}
                    />
                  )}
                  {remaining > 0 && (
                    <div className="flex flex-col items-center gap-2 pt-3">
                      <Button variant="secondary" size="lg" onClick={() => setPaging({ signature, limit: limit + LISTING_PAGE_SIZE })}>
                        Load {Math.min(remaining, LISTING_PAGE_SIZE)} more
                      </Button>
                      <p className="tabular text-xs text-fg-subtle">
                        Showing {visible.length} of {results.length}
                      </p>
                    </div>
                  )}
                </>
              )}
            </TabsPrimitive.Content>
          ))}
        </div>
      </TabsPrimitive.Root>

      <MobileListingBar visible={inView && !sheetOpen} lowest={lowest} count={results.length} activeFilters={active} onFilters={() => setSheetOpen(true)} />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="glass-raised max-h-[85dvh] gap-0 rounded-t-[20px] border-x-0 border-b-0 p-0 lg:hidden">
          <SheetHeader className="border-b border-line p-5">
            <SheetTitle className="text-[1.125rem]">Filter {LISTING_TYPE_META[tab].label.toLowerCase()}</SheetTitle>
            <SheetDescription>Price, delivery, seller rating and more.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto overscroll-contain p-5">
            <ListingFilters idPrefix="sheet" {...filterProps} />
          </div>
          <SheetFooter className="border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Button className="w-full" onClick={() => setSheetOpen(false)}>
              Show {pluralize(results.length, "offer")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <ListingDialog listing={selected} open={dialogOpen} game={game} onOpenChange={setDialogOpen} />
    </section>
  );
}
