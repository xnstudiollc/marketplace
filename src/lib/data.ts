import "server-only";
import gamesJson from "../../data/games.json";
import featuredJson from "../../data/featured.json";
import { CATEGORY_ORDER } from "./categories";
import { LETTERS, letterOf } from "./letters";
import { getGameStats } from "./mock/stats";
import type { BrowseEntry, CategoryId, Game, ListingTypeId, SearchEntry } from "./types";

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
