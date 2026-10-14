# Decisions

Short notes on choices where the build prompt was silent or where the framework forced a deviation.

## Foundation

- **Next.js 16.4 with Cache Components and Partial Prefetching** (the `create-next-app` defaults). Every route is prerendered; dynamic `params` routes use `generateStaticParams` with `dynamicParams = false`.
- **Brand accent tokens are named `--brand`, `--brand-2`, `--brand-3`** instead of `--accent*`, because shadcn already uses `--accent` for the menu hover surface. All other tokens use the names from the prompt.
- **`--text-subtle` is `#838CA8`** rather than `#6B7490`. The original measured 4.31:1 on the page background and 3.85:1 on raised surfaces, below WCAG AA for body text. The new value is 5.98:1 and 5.34:1.
- **Primary button gradient runs `#6D4AFF` to `#4F46E5`** (violet to indigo). White text on pure `#7C5CFF` is 4.35:1, just under AA; the darker start keeps the look and passes.
- **The cursor-follow glow is one delegated `pointermove` listener** (`ClientEffects`) that writes `--mx`/`--my` onto the closest `.glow-card`. Cards stay server components instead of each becoming a client island.
- **Persisted Zustand stores use `skipHydration`** and rehydrate after mount, so server HTML and the first client render always match.
- **The search index is a static file** (`public/search-index.json`, generated in `predev`/`prebuild`) loaded the first time the palette opens, so it is not in every page's payload.
- **Search uses a small custom scorer** (`src/lib/search.ts`) instead of `fuse.js`: exact, prefix and word-prefix matches rank highest, and punctuation and apostrophes are ignored so "r.e.p.o", "83" and "tom clancy" all match.
- **`typecheck` runs `next typegen` first** so the global `PageProps`/`LayoutProps` helpers exist without a full build.
