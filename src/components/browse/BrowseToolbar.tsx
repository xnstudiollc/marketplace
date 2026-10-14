"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BrowseFilters, type BrowseFiltersProps } from "@/components/browse/BrowseFilters";
import { SORT_OPTIONS, activeFilterCount, type SortId } from "@/lib/browse";
import { pluralize } from "@/lib/format";

interface BrowseToolbarProps {
  query: string;
  onQuery: (value: string) => void;
  sort: SortId;
  onSort: (value: SortId) => void;
  resultCount: number;
  filters: Omit<BrowseFiltersProps, "idPrefix">;
}

export function BrowseToolbar({ query, onQuery, sort, onSort, resultCount, filters }: BrowseToolbarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const active = activeFilterCount(filters.state);
  const sortOptions = SORT_OPTIONS.filter((o) => o.id !== "relevance" || query.trim());

  return (
    <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
      <div className="glass-subtle flex h-11 w-full min-w-0 items-center gap-2 rounded-xl px-3 focus-within:border-brand/60 sm:flex-1">
        <Search className="size-[18px] shrink-0 text-fg-subtle" aria-hidden />
        <label htmlFor="browse-search" className="sr-only">
          Search games
        </label>
        <input
          id="browse-search"
          type="search"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search by name, initials or listing"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          className="h-full w-full min-w-0 bg-transparent text-[0.9375rem] text-fg outline-none placeholder:text-fg-subtle [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQuery("")}
            className="-mr-1.5 grid size-8 shrink-0 place-items-center rounded-lg text-fg-subtle hover:bg-surface-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-ring"
            aria-label="Clear search"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>

      <Button
        variant="secondary"
        className="relative flex-1 lg:hidden"
        onClick={() => setSheetOpen(true)}
        aria-label={active ? `Filters, ${active} active` : "Filters"}
      >
        <SlidersHorizontal aria-hidden />
        Filters
        {active > 0 && (
          <span className="tabular grid min-w-5 place-items-center rounded-full bg-brand px-1.5 text-[0.6875rem] leading-5 font-semibold text-white">
            {active}
          </span>
        )}
      </Button>

      <Select value={sort} onValueChange={(v) => onSort(v as SortId)}>
        <SelectTrigger
          aria-label="Sort games"
          className="glass-subtle h-11! flex-1 rounded-xl border-line px-3 text-sm sm:w-48 sm:flex-none"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" align="end" className="glass-raised rounded-xl">
          {sortOptions.map((o) => (
            <SelectItem key={o.id} value={o.id} className="min-h-10 rounded-lg">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          className="glass-raised max-h-[85dvh] gap-0 rounded-t-[20px] border-x-0 border-b-0 p-0 lg:hidden"
        >
          <SheetHeader className="border-b border-line p-5">
            <SheetTitle className="text-[1.125rem]">Filters</SheetTitle>
            <SheetDescription>Narrow the list by category, type and variants.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto overscroll-contain p-5">
            <BrowseFilters idPrefix="sheet" {...filters} />
          </div>
          <SheetFooter className="border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Button onClick={() => setSheetOpen(false)} className="w-full">
              Show {pluralize(resultCount, "game")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
