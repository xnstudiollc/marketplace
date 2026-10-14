# Decisions

Short notes on choices where the build prompt was silent or where the framework forced a deviation.

## Foundation

- **Next.js 16.4 with Cache Components and Partial Prefetching** (the `create-next-app` defaults). Every route is prerendered. Dynamic `params` routes list every known value in `generateStaticParams` and call `notFound()` for anything else, because `dynamicParams` is not allowed with Cache Components.
- **Brand accent tokens are named `--brand`, `--brand-2`, `--brand-3`** instead of `--accent*`, because shadcn already uses `--accent` for the menu hover surface. All other tokens use the names from the prompt.
- **`--text-subtle` is `#838CA8`** rather than `#6B7490`. The original measured 4.31:1 on the page background and 3.85:1 on raised surfaces, below WCAG AA for body text. The new value is 5.98:1 and 5.34:1.
- **Primary button gradient runs `#6D4AFF` to `#4F46E5`** (violet to indigo). White text on pure `#7C5CFF` is 4.35:1, just under AA; the darker start keeps the look and passes.
- **The cursor-follow glow is one delegated `pointermove` listener** (`ClientEffects`) that writes `--mx`/`--my` onto the closest `.glow-card`. Cards stay server components instead of each becoming a client island.
- **Persisted Zustand stores use `skipHydration`** and rehydrate after mount, so server HTML and the first client render always match.
- **The search index is a static file** (`public/search-index.json`, generated in `predev`/`prebuild`) loaded the first time the palette opens, so it is not in every page's payload.
- **Search uses a small custom scorer** (`src/lib/search.ts`) instead of `fuse.js`: exact, prefix and word-prefix matches rank highest, and punctuation and apostrophes are ignored so "r.e.p.o", "83" and "tom clancy" all match.
- **`typecheck` runs `next typegen` first** so the global `PageProps`/`LayoutProps` helpers exist without a full build.

## Browse

- **URL state uses a small `useSyncExternalStore` hook** (`src/hooks/use-query-state.ts`) over `window.location.search` and `history.pushState`, instead of `nuqs` or `useSearchParams`. `useSearchParams` would force the browse grid to render on the client only; this way `/browse` and every `/category/*` page prerender the full A to Z grid. The trade-off: on a hard reload of a filtered URL, the unfiltered grid is in the HTML and the filters apply right after hydration. Client-side navigation has no such step.
- **Filter clicks push a history entry; typing in search replaces it**, so Back undoes one filter at a time without stepping through every keystroke.
- **Listing type filters match any selected type** (Accounts or Currency), the same as categories. Matching all types would empty the grid on most combinations.
- **Facet counts exclude their own dimension**: the category counts reflect the current search, type and letter filters, but not the selected categories. A count of 0 disables that option.
- **A letter filter (`?letter=`) was added** next to the prompt's `q`, `cat`, `type`, `variants` and `sort`, reusing the A to Z grouping rules from `groupAlphabetically()`.
- **"Best match" sort appears only while searching** and is the default then; otherwise A to Z is the default. Default values are left out of the URL.
- **Card prices ("From $X")** come from `getGameStats()`, the same deterministic listings the game page uses, so the numbers agree.
- **`/dev/tiles` returns 404 in production builds** via `notFound()`, as specified; it renders under `next dev`.

## Home

- **Featured shows 12 of the 16 featured games** so the grid fills evenly at 2, 3 and 4 columns. The marquee uses the same 12.
- **Trending is seeded by the ISO week** read inside a `"use cache"` function with `cacheLife("days")`. The home page stays prerendered, revalidates daily, and the picks change once a week. This is the only place the clock is read, and it happens in a cache scope, never during render. The pool is non-collection games with at least four listing types.
- **"Instant offers" in the hero** is the sum of instant-delivery mock listings across all games, so it matches what the game pages show.
- **A to Z "popular" styling** (bold name and a star) marks the featured games, and never collections. Letters with no games are disabled in the rail.
- **The A to Z sections do not use `content-visibility: auto`.** Their real heights vary too much from any estimate, and jumping to a letter landed hundreds of pixels off as sections rendered. The sections are a client component fed compact `[name, slug, initials, flags]` tuples, and tile styles live in a `.game-tile` CSS class, which cut the home HTML from 2.5 MB to under 0.8 MB.
- **A to Z links use `prefetch={false}`** so scrolling the full catalog does not fire 858 prefetches.
- **Reveal animations stay hydration-safe** by always rendering the motion element; under reduced motion a `[data-reveal]` CSS rule pins them visible, instead of branching on `useReducedMotion()` during render.
- **Section spacing**: `section-y` pads 24px or 36px on each side, so adjacent sections sit 48px (mobile) or 72px (desktop) apart, as specified.
- **The shortcut hint shows "⌘K" on Apple platforms and "Ctrl K" elsewhere.**
