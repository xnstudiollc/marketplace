import type { Seller } from "../types";
import { createRng } from "./rng";

const HANDLES = [
  "NovaTrade", "QuietFalcon", "ByteMonk", "LumenForge", "OrbitVault", "SableKnight",
  "PixelHarbor", "CinderLoop", "VelvetCrate", "NorthPeak", "EmberCoin", "TidalRune",
  "GlitchGarden", "IronLantern", "MossyCastle", "ZenithDrop", "CopperWisp", "FrostMarket",
  "HollowOak", "KiteRunner", "NeonTortoise", "RapidLotus", "SilverMoth", "AmberSignal",
  "DriftPilot", "EchoBazaar", "FableSmith", "GrimMango", "HazelBolt", "JadeOutpost",
  "LunarCraft", "MintyRaven", "OpalTrader", "PrismFox", "RustyComet", "WillowKeys",
] as const;

const LANGUAGES = ["English", "Spanish", "German", "French", "Portuguese", "Polish", "Turkish", "Japanese"];
const RESPONSE = [2, 3, 5, 8, 10, 15, 20, 30, 45, 60, 90];

function buildSeller(handle: string): Seller {
  const rng = createRng("seller", handle);
  const r = rng.next();
  const rating = Math.round((5 - 0.9 * r * r) * 10) / 10;
  const reviewCount = rng.int(40, 4200);
  const completedOrders = Math.round(reviewCount * rng.float(1.3, 2.2));
  const languages = ["English", ...rng.shuffle(LANGUAGES.slice(1)).slice(0, rng.int(0, 2))];
  return {
    id: handle.toLowerCase(),
    handle,
    hue: rng.int(0, 359),
    rating,
    reviewCount,
    completedOrders,
    responseMinutes: rng.pick(RESPONSE),
    completionRate: Math.round(rng.float(94, 100) * 10) / 10,
    verified: rng.chance(0.82),
    memberSince: rng.int(2017, 2025),
    languages,
    online: rng.chance(0.55),
    topSeller: rating >= 4.8 && completedOrders > 2500,
  };
}

export const SELLERS: Seller[] = HANDLES.map(buildSeller);
const SELLER_BY_ID = new Map(SELLERS.map((s) => [s.id, s]));

export function getSeller(id: string): Seller | undefined {
  return SELLER_BY_ID.get(id);
}

export function getSellerOrThrow(id: string): Seller {
  const seller = SELLER_BY_ID.get(id);
  if (!seller) throw new Error(`Unknown seller ${id}`);
  return seller;
}

export function getSpotlightSellers(count = 4): Seller[] {
  return SELLERS.slice()
    .sort((a, b) => b.rating - a.rating || b.completedOrders - a.completedOrders)
    .slice(0, count);
}
