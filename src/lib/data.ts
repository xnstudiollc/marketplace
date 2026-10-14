import "server-only";
import gamesJson from "../../data/games.json";
import featuredJson from "../../data/featured.json";
import { CATEGORY_ORDER } from "./categories";
import { LETTERS, letterOf } from "./letters";
import { getListings } from "./mock/listings";
import { hash } from "./mock/rng";
import { getGameStats } from "./mock/stats";
import type { BrowseEntry, CategoryId, Game, Listing, ListingTypeId, SearchEntry } from "./types";

const games = (gamesJson as unknown as Game[])
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true, sensitivity: "base" }));
const bySlug = new Map(games.map((g) => [g.slug, g]));

export function getAllGames(): Game[] {
  return games;
}

export function getGame(slug: string): Game | undefined {
  return bySlug.get(slug);
}

export function getGamesByCategory(id: CategoryId): Game[] {
  return games.filter((g) => g.category === id);
}

export function getFeatured(): Game[] {
  return (featuredJson as string[])
    .map((slug) => bySlug.get(slug))
    .filter((g): g is Game => Boolean(g && !g.collection));
}

export function getSearchIndex(): SearchEntry[] {
  return games.map(({ name, slug, category, initials, collection }) => ({ name, slug, category, initials, collection }));
}

export function getCategoryCounts(): Record<CategoryId, number> {
  const counts = Object.fromEntries(CATEGORY_ORDER.map((id) => [id, 0])) as Record<CategoryId, number>;
  for (const g of games) counts[g.category] += 1;
  return counts;
}

export function getListingTypeCounts(): Record<ListingTypeId, number> {
  const counts: Record<ListingTypeId, number> = { accounts: 0, currency: 0, items: 0, services: 0, keys: 0, other: 0 };
  for (const g of games) for (const t of g.listingTypes) counts[t] += 1;
  return counts;
}

export function groupAlphabetically(list: Game[] = games): { letter: string; games: Game[] }[] {
  const groups = new Map<string, Game[]>(LETTERS.map((l) => [l, []]));
  for (const g of list) groups.get(letterOf(g.name))?.push(g);
  return LETTERS.map((letter) => ({ letter, games: groups.get(letter) ?? [] }));
}

export function toBrowseEntry(game: Game): BrowseEntry {
  return {
    name: game.name,
    slug: game.slug,
    category: game.category,
    initials: game.initials,
    ...(game.collection ? { collection: true as const } : {}),
    listingTypes: game.listingTypes,
    hasVariants: Boolean(game.variants?.length),
    labelText: [...new Set(game.labels.map((l) => l.name))].join(" "),
    fromPrice: getGameStats(game).fromPrice,
  };
}

export function getBrowseEntries(list: Game[] = games): BrowseEntry[] {
  return list.map(toBrowseEntry);
}

export interface SiteStats {
  games: number;
  categories: number;
  offers: number;
  instantOffers: number;
}

let siteStats: SiteStats | undefined;

export function getSiteStats(): SiteStats {
  if (siteStats) return siteStats;
  let offers = 0;
  let instantOffers = 0;
  for (const g of games) {
    const s = getGameStats(g);
    offers += s.offers;
    instantOffers += Math.round(s.offers * s.instantShare);
  }
  siteStats = { games: games.length, categories: CATEGORY_ORDER.length, offers, instantOffers };
  return siteStats;
}

/** Up to `count` other games from the same category, ordered by a hash seeded with the game's slug; collections sort last. */
export function getRelatedGames(game: Game, count = 8): Game[] {
  return games
    .filter((g) => g.category === game.category && g.slug !== game.slug)
    .map((g) => ({ g, k: hash(`related:${game.slug}:${g.slug}`) + (g.collection ? 2 ** 32 : 0) }))
    .sort((a, b) => a.k - b.k)
    .slice(0, count)
    .map(({ g }) => g);
}

export interface SellerCatalog {
  games: Pick<Game, "name" | "slug" | "initials" | "category">[];
  listings: Listing[];
}

/**
 * The games a seller trades in and their offers there. Candidate games are ordered by a hash seeded with the seller id;
 * only games where the shared listing generator actually assigns this seller offers are kept, so both pages agree.
 */
export function getSellerCatalog(sellerId: string, maxGames = 8): SellerCatalog {
  const picked: SellerCatalog = { games: [], listings: [] };
  const pool = games
    .filter((g) => !g.collection && g.listingTypes.length >= 3)
    .map((g) => ({ g, k: hash(`seller-games:${sellerId}:${g.slug}`) }))
    .sort((a, b) => a.k - b.k);
  for (const { g } of pool) {
    const own = g.listingTypes.flatMap((t) => getListings(g, t)).filter((l) => l.sellerId === sellerId);
    if (!own.length) continue;
    picked.games.push({ name: g.name, slug: g.slug, initials: g.initials, category: g.category });
    picked.listings.push(...own);
    if (picked.games.length >= maxGames) break;
  }
  return picked;
}

/** Deterministic picks for a seed (for example an ISO week), drawn from games with at least four listing types. */
export function getTrendingGames(seed: string, count = 12): Game[] {
  return games
    .filter((g) => !g.collection && g.listingTypes.length >= 4)
    .map((g) => ({ g, k: hash(`${seed}:${g.slug}`) }))
    .sort((a, b) => a.k - b.k)
    .slice(0, count)
    .map(({ g }) => g);
}
