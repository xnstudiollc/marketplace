import type { Game } from "../types";
import { getListings } from "./listings";

export interface GameStats {
  offers: number;
  sellers: number;
  fromPrice: number;
  medianDeliveryMinutes: number;
  instantShare: number;
}

const cache = new Map<string, GameStats>();

export function getGameStats(game: Pick<Game, "slug" | "name" | "category" | "labels" | "variants" | "experiences" | "listingTypes">): GameStats {
  const cached = cache.get(game.slug);
  if (cached) return cached;
  const listings = game.listingTypes.flatMap((t) => getListings(game, t));
  const sellers = new Set(listings.map((l) => l.sellerId));
  const deliveries = listings.map((l) => l.deliveryMinutes).sort((a, b) => a - b);
  const stats: GameStats = {
    offers: listings.length,
    sellers: sellers.size,
    fromPrice: listings.length ? Math.min(...listings.map((l) => l.price)) : 0,
    medianDeliveryMinutes: deliveries.length ? deliveries[Math.floor(deliveries.length / 2)] : 0,
    instantShare: listings.length ? listings.filter((l) => l.deliveryMinutes === 0).length / listings.length : 0,
  };
  cache.set(game.slug, stats);
  return stats;
}
