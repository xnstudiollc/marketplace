"use client";

import { useEffect, useMemo, useState } from "react";
import { ActiveFilters } from "@/components/browse/ActiveFilters";
import { BrowseFilters } from "@/components/browse/BrowseFilters";
import { BrowseToolbar } from "@/components/browse/BrowseToolbar";
import { LetterBar } from "@/components/browse/LetterBar";
import { EmptyState } from "@/components/common/EmptyState";
import { GameGrid } from "@/components/game/GameGrid";
import { Button } from "@/components/ui/button";
import { useQueryState } from "@/hooks/use-query-state";
import { PAGE_SIZE, parseBrowseState, runBrowse, stateSignature, type SortId } from "@/lib/browse";
import { pluralize } from "@/lib/format";
import { createSearcher } from "@/lib/search";
import type { BrowseEntry, CategoryId, ListingTypeId } from "@/lib/types";

const toggle = <T,>(list: T[], value: T): T[] =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

export function BrowseClient({ entries, showCategories = true }: { entries: BrowseEntry[]; showCategories?: boolean }) {
  const { params, update } = useQueryState();
  const state = useMemo(() => {
    const parsed = parseBrowseState(params);
    return showCategories ? parsed : { ...parsed, cats: [] };
  }, [params, showCategories]);

  const [draft, setDraft] = useState(state.q);
  const [syncedQ, setSyncedQ] = useState(state.q);
  if (state.q !== syncedQ) {
    setSyncedQ(state.q);
    setDraft(state.q);
  }

  useEffect(() => {
    if (draft === syncedQ) return;
    const id = window.setTimeout(() => update({ q: draft, letter: null }, "replace"), 150);
    return () => window.clearTimeout(id);
  }, [draft, syncedQ, update]);

  const searcher = useMemo(() => createSearcher(entries), [entries]);
  const result = useMemo(() => runBrowse(entries, searcher, state), [entries, searcher, state]);

  const signature = stateSignature(state);
  const [paging, setPaging] = useState({ signature, limit: PAGE_SIZE });
  const limit = paging.signature === signature ? paging.limit : PAGE_SIZE;
  const visible = result.results.slice(0, limit);
  const remaining = result.results.length - visible.length;

  const handlers = {
    onToggleCategory: (id: CategoryId) => update({ cat: toggle(state.cats, id) }),
    onToggleType: (id: ListingTypeId) => update({ type: toggle(state.types, id) }),
    onVariants: (value: boolean) => update({ variants: value ? "1" : null }),
    onLetter: (letter: string | null) => update({ letter }),
  };
  const clearFilters = () => update({ cat: null, type: null, variants: null, letter: null });
  const clearAll = () => {
    setDraft("");
    update({ q: null, cat: null, type: null, variants: null, letter: null, sort: null });
  };
  const filterProps = {
    state,
    counts: result,
    showCategories,
    ...handlers,
    onClear: clearFilters,
  };

  return (
    <div className="lg:grid lg:grid-cols-[272px_minmax(0,1fr)] lg:gap-8">
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="glass no-scrollbar sticky top-[calc(var(--header-h)+1.5rem)] max-h-[calc(100dvh-var(--header-h)-3rem)] overflow-y-auto rounded-2xl p-4">
          <BrowseFilters idPrefix="side" {...filterProps} />
        </div>
      </aside>

      <div className="min-w-0 space-y-5">
        <BrowseToolbar
          query={draft}
          onQuery={setDraft}
          sort={state.sort}
          onSort={(sort: SortId) => update({ sort: sort === (state.q.trim() ? "relevance" : "az") ? null : sort })}
          resultCount={result.results.length}
          filters={filterProps}
        />
        <LetterBar counts={result.letterCounts} active={state.letter} onSelect={handlers.onLetter} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="tabular text-sm text-fg-muted" aria-live="polite" aria-atomic>
            <span className="font-semibold text-fg">{pluralize(result.results.length, "game")}</span>
            {state.q.trim() && <> for &ldquo;{state.q.trim()}&rdquo;</>}
          </p>
          <ActiveFilters state={state} {...handlers} onClearAll={clearAll} />
        </div>

        {visible.length ? (
          <GameGrid games={visible} priorityCount={4} />
        ) : (
          <EmptyState
            title="No games match those filters"
            description="Try a shorter search, or remove a filter to widen the results."
            action={<Button onClick={clearAll}>Clear filters</Button>}
          />
        )}

        {remaining > 0 && (
          <div className="flex flex-col items-center gap-2 pt-4">
            <Button variant="secondary" size="lg" onClick={() => setPaging({ signature, limit: limit + PAGE_SIZE })}>
              Load {Math.min(remaining, PAGE_SIZE)} more
            </Button>
            <p className="tabular text-xs text-fg-subtle">
              Showing {visible.length} of {result.results.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
