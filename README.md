# Vaultline

A front-end-only gaming marketplace demo: browse 858 games, compare mock offers for accounts, currency, items, boosting and keys, then go through a cart and a validated mock checkout. There is no backend and no payment processing. Every seller, offer, price and review is generated from a seeded random generator, so the output is the same on every visit and every build.

Built with Next.js 16 (App Router, Cache Components), React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui on Radix, Motion, Zustand, React Hook Form and Zod.

## Setup

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

| Script | What it does |
| --- | --- |
| `npm run build` | Production build. Prerenders every page, including all 858 game pages, 36 seller pages and their Open Graph images. |
| `npm start` | Serves the production build. |
| `npm run lint` | ESLint (Next.js and React Compiler rules). |
| `npm run typecheck` | Generates route types (`next typegen`), then runs `tsc --noEmit`. |
| `npm run data:build` | Rebuilds the game data files from the raw export (see below). |
| `npm run assets:index` | Re-scans `public/games/` for logos and rewrites the search index. Runs automatically before `dev`, `build`, `lint` and `typecheck`. |

Set `NEXT_PUBLIC_SITE_URL` to the deployed origin so canonical URLs, the sitemap and Open Graph tags use it. It defaults to `http://localhost:3000`.

## Game data

The catalog comes only from `data/raw/games.raw.json`. Never edit the generated files by hand.

```bash
npm run data:build
```

This reads the raw export and `data/category-overrides.json`, then writes:

- `data/games.json`: one record per game (name, slug, initials, category, listing types, labels, variants, experiences, collection flag).
- `data/categories.json`: the six categories with counts.
- `data/featured.json`: featured slugs for the home page.

Restart `npm run dev` after rebuilding so the new data is picked up.

### Editing category overrides

`data/category-overrides.json` maps a game slug to one of six category ids:

`pc-console`, `online-mmo`, `mobile`, `ai-software`, `platforms-gift-cards`, `social-streaming`

```json
{
  "categories": {
    "world-of-warcraft": "online-mmo",
    "8-ball-pool": "mobile"
  }
}
```

Change or add entries, then run `npm run data:build`. Slugs that are not in the raw export are ignored. Games without an override fall back to the rules in `scripts/lib/normalize.mjs`.

## Adding real game logos

Games ship without artwork. Each one gets a generated tile with its initials and a color derived from its slug. To use a real logo:

1. Add a PNG at `public/games/{slug}/logo.png`, for example `public/games/minecraft/logo.png`. A square image with a transparent background, at least 256 × 256, works best.
2. Restart `npm run dev`, or run `npm run assets:index`.

The asset index (`src/generated/game-assets.json`) records which slugs have a logo, so the app only requests images that exist and never causes a 404. Only add artwork you have the rights to use.

## Renaming the brand

The brand name, tagline, description and site URL live in one place, `src/lib/site.ts`:

```ts
export const SITE = {
  name: "Vaultline",
  tagline: "Everything for your next level, in one place",
  ...
};
```

Every page, metadata entry and Open Graph image reads from it. To finish a rebrand:

- Swap the logo mark: `LogoMark` in `src/components/layout/Logo.tsx`, and `Mark` in `src/lib/og.tsx` for Open Graph images.
- Replace `src/app/favicon.ico`.
- Optionally rename `name` in `package.json`, and the `vaultline-cart` and `vaultline-recent` storage keys in `src/store/`. Renaming the keys empties existing carts.

## Project layout

```
data/                 raw export, overrides, generated JSON
scripts/              data build and asset index
assets/fonts/         Geist TTFs for Open Graph images (SIL OFL, see OFL.txt)
src/app/              routes, metadata, sitemap, robots, OG images
src/components/       ui (shadcn), layout, home, browse, game, seller, cart, checkout, common
src/lib/              data access, search, formatting, checkout schema, mock data (src/lib/mock)
src/store/            Zustand stores (cart, recently viewed, UI)
DECISIONS.md          judgment calls and deviations from the original brief
```

## Notes

- This is a demo. No real payments, accounts or sellers exist, and nothing typed at checkout leaves the browser. Use the test card `4242 4242 4242 4242` with any future expiry date.
- Game names belong to their respective owners. This project is not affiliated with any publisher or platform.
- `/dev/tiles` previews generated tiles in development and returns 404 in production.
