"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { ArrowRight, Clock, Compass, HelpCircle, Home, Search, ShoppingCart, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { GameImage } from "@/components/game/GameImage";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/categories";
import { createSearcher, normalize, type Searcher } from "@/lib/search";
import type { SearchEntry } from "@/lib/types";
import { useRecent } from "@/store/recent";
import { useUi } from "@/store/ui";

let indexPromise: Promise<SearchEntry[]> | null = null;
function loadIndex() {
  indexPromise ??= fetch("/search-index.json")
    .then((r) => (r.ok ? (r.json() as Promise<SearchEntry[]>) : []))
    .catch(() => {
      indexPromise = null;
      return [];
    });
  return indexPromise;
}

const PAGES = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse", label: "Browse all games", icon: Compass },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/help", label: "Help center", icon: HelpCircle },
];

const itemClass =
  "group flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-fg-muted outline-none data-[selected=true]:bg-surface-hover data-[selected=true]:text-fg";
const groupClass =
  "px-2 pb-2 **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:pt-3 **:[[cmdk-group-heading]]:pb-1.5 **:[[cmdk-group-heading]]:text-[0.6875rem] **:[[cmdk-group-heading]]:font-semibold **:[[cmdk-group-heading]]:tracking-[0.06em] **:[[cmdk-group-heading]]:text-fg-subtle **:[[cmdk-group-heading]]:uppercase";

export function CommandPalette() {
  const router = useRouter();
  const open = useUi((s) => s.paletteOpen);
  const setOpen = useUi((s) => s.setPaletteOpen);
  const recent = useRecent((s) => s.searches);
  const addSearch = useRecent((s) => s.addSearch);
  const clearSearches = useRecent((s) => s.clearSearches);

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [searcher, setSearcher] = useState<Searcher<SearchEntry> | null>(null);

  useEffect(() => {
    if (!open || searcher) return;
    let cancelled = false;
    loadIndex().then((entries) => {
      if (!cancelled) setSearcher(createSearcher(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [open, searcher]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 120);
    return () => clearTimeout(t);
  }, [query]);

  const games = useMemo(
    () => (searcher && normalize(debounced) ? searcher.search(debounced, 8) : []),
    [searcher, debounced],
  );
  const categories = useMemo(() => {
    const q = normalize(debounced);
    return CATEGORY_ORDER.filter((id) => !q || normalize(CATEGORY_META[id].label).includes(q));
  }, [debounced]);
  const pages = useMemo(() => {
    const q = normalize(debounced);
    return PAGES.filter((p) => !q || normalize(p.label).includes(q));
  }, [debounced]);

  const go = (href: string) => {
    if (normalize(query)) addSearch(query);
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const hasQuery = normalize(query).length > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="glass-raised top-[12dvh] w-[calc(100vw-24px)] max-w-[640px] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-[640px]"
        onOpenAutoFocus={() => void loadIndex()}
      >
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">Search games, categories and pages</DialogDescription>
        <CommandPrimitive shouldFilter={false} loop className="flex flex-col" label="Search games">
          <div className="flex items-center gap-3 border-b border-line px-4">
            <Search className="size-5 text-fg-subtle" strokeWidth={1.75} aria-hidden />
            <CommandPrimitive.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search 850+ games, categories, pages…"
              className="h-14 flex-1 bg-transparent text-[1rem] text-fg outline-none placeholder:text-fg-subtle"
            />
            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="grid size-9 place-items-center rounded-lg text-fg-subtle hover:bg-surface-hover hover:text-fg"
              >
                <X className="size-4" />
              </button>
            ) : (
              <kbd className="hidden rounded-md border border-line-strong px-1.5 py-0.5 font-mono text-[0.6875rem] text-fg-subtle sm:block">
                Esc
              </kbd>
            )}
          </div>
          <CommandPrimitive.List className="max-h-[min(60dvh,460px)] overflow-y-auto overscroll-contain py-1">
            {hasQuery && searcher && games.length === 0 && categories.length === 0 && pages.length === 0 && (
              <div className="px-6 py-10 text-center text-fg-muted">
                No matches for <span className="text-fg">“{query}”</span>. Try a shorter name.
              </div>
            )}
            {hasQuery && !searcher && <div className="px-6 py-10 text-center text-fg-muted">Loading games…</div>}

            {!hasQuery && recent.length > 0 && (
              <CommandPrimitive.Group heading="Recent searches" className={groupClass}>
                {recent.map((term) => (
                  <CommandPrimitive.Item key={term} value={`recent-${term}`} onSelect={() => setQuery(term)} className={itemClass}>
                    <Clock className="size-4" aria-hidden />
                    <span className="flex-1 truncate">{term}</span>
                  </CommandPrimitive.Item>
                ))}
                <CommandPrimitive.Item value="recent-clear" onSelect={clearSearches} className={`${itemClass} text-[0.8125rem]`}>
                  <X className="size-4" aria-hidden /> Clear recent searches
                </CommandPrimitive.Item>
              </CommandPrimitive.Group>
            )}

            {games.length > 0 && (
              <CommandPrimitive.Group heading="Games" className={groupClass}>
                {games.map((game) => (
                  <CommandPrimitive.Item
                    key={game.slug}
                    value={`game-${game.slug}`}
                    onSelect={() => go(`/games/${game.slug}`)}
                    className={itemClass}
                  >
                    <GameImage game={game} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-fg">{game.name}</span>
                      <span className="block truncate text-[0.8125rem] text-fg-subtle">
                        {CATEGORY_META[game.category].label}
                      </span>
                    </span>
                    <ArrowRight className="size-4 opacity-0 group-data-[selected=true]:opacity-100" aria-hidden />
                  </CommandPrimitive.Item>
                ))}
              </CommandPrimitive.Group>
            )}

            {categories.length > 0 && (
              <CommandPrimitive.Group heading="Categories" className={groupClass}>
                {categories.map((id) => {
                  const meta = CATEGORY_META[id];
                  const Icon = meta.icon;
                  return (
                    <CommandPrimitive.Item key={id} value={`cat-${id}`} onSelect={() => go(`/category/${id}`)} className={itemClass}>
                      <span
                        className="grid size-10 place-items-center rounded-xl border border-line"
                        style={{ background: `color-mix(in srgb, ${meta.accent} 14%, transparent)`, color: meta.accent }}
                      >
                        <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
                      </span>
                      <span className="flex-1">{meta.label}</span>
                    </CommandPrimitive.Item>
                  );
                })}
              </CommandPrimitive.Group>
            )}

            {pages.length > 0 && (
              <CommandPrimitive.Group heading="Pages" className={groupClass}>
                {pages.map((page) => (
                  <CommandPrimitive.Item key={page.href} value={`page-${page.href}`} onSelect={() => go(page.href)} className={itemClass}>
                    <page.icon className="size-4" aria-hidden />
                    <span className="flex-1">{page.label}</span>
                  </CommandPrimitive.Item>
                ))}
              </CommandPrimitive.Group>
            )}
          </CommandPrimitive.List>
          <div className="hidden items-center gap-4 border-t border-line px-4 py-2.5 text-[0.75rem] text-fg-subtle sm:flex">
            <span>↑↓ to navigate</span>
            <span>↵ to open</span>
            <span>Esc to close</span>
          </div>
        </CommandPrimitive>
      </DialogContent>
    </Dialog>
  );
}
