import type { Game, Listing, ListingTypeId } from "../types";
import { createRng, type Rng } from "./rng";
import { SELLERS } from "./sellers";

type ListingGame = Pick<Game, "slug" | "name" | "category" | "labels" | "variants" | "experiences">;

const APP_CATEGORIES = new Set(["ai-software", "platforms-gift-cards", "social-streaming"]);

const ADJECTIVES = ["Rare", "Legendary", "Pristine", "Limited", "Mythic", "Exclusive", "Seasonal", "Vintage", "Radiant", "Elite"];
const NOUNS = ["bundle", "set", "collection", "pack", "drop", "loadout", "cache", "showcase"];
const ACCOUNT_PERKS = ["rare skins", "full access", "ranked ready", "all DLC", "a high win rate", "max gear", "a starter bonus", "exclusive cosmetics", "a clean history"];
const PLATFORMS = ["PC", "PlayStation", "Xbox", "Switch", "Mobile"];
const PLAN_TIERS = ["Pro", "Plus", "Premium", "Team"];
const DURATIONS = ["1 month", "3 months", "12 months"];
const CURRENCY_LOTS = [100, 250, 500, 1_000, 2_500, 5_000, 10_000, 50_000, 100_000, 500_000, 1_000_000, 10_000_000];
const DELIVERY_METHODS = ["Face-to-face trade", "Mail delivery", "Auction house", "Direct top-up"];

const compactLot = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

function skewLow(rng: Rng, min: number, max: number, power = 2) {
  return min + (max - min) * Math.pow(rng.next(), power);
}

const money = (n: number) => Math.round(n * 100) / 100;

function delivery(rng: Rng, type: ListingTypeId): number {
  switch (type) {
    case "currency":
    case "keys":
      return rng.chance(0.7) ? 0 : rng.pick([5, 10, 15, 20, 30]);
    case "accounts":
      return rng.chance(0.4) ? 0 : rng.pick([10, 20, 30, 60]);
    case "items":
      return rng.pick([0, 0, 5, 15, 30, 60]);
    case "services":
      return rng.pick([60, 120, 240, 480, 720, 1440]);
    default:
      return rng.pick([15, 30, 60, 120]);
  }
}

function listingCount(game: ListingGame, type: ListingTypeId) {
  const ofType = game.labels.filter((l) => l.type === type).length;
  const richness = ofType * 4 + game.labels.length + (game.variants?.length ?? 0) * 3;
  return Math.max(10, Math.min(40, 8 + richness));
}

function buildListing(game: ListingGame, type: ListingTypeId, index: number): Listing {
  const rng = createRng("listing", game.slug, type, index);
  const app = APP_CATEGORIES.has(game.category);
  const typeLabels = game.labels.filter((l) => l.type === type).map((l) => l.name);
  const labelName = typeLabels.length ? rng.pick(typeLabels) : type === "accounts" ? "Accounts" : "Other";
  const variant = game.variants?.length ? rng.pick(game.variants) : undefined;
  const experience =
    game.experiences?.length && (type === "items" || type === "accounts") && rng.chance(0.75)
      ? rng.pick(game.experiences)
      : undefined;
  const seller = rng.pick(SELLERS);
  const server = variant ?? "Global";

  let title = "";
  let price = 0;
  let unit: Listing["unit"];
  let stock = 1;
  let attributes: string[] = [];
  let description = "";

  switch (type) {
    case "currency": {
      const amount = rng.pick(CURRENCY_LOTS);
      price = money(skewLow(rng, 2, 300, 2.4));
      unit = { amount, label: labelName };
      stock = rng.int(5, 99);
      title = `${compactLot.format(amount)} ${labelName} | ${server}${rng.pick([" | Fast", " | In stock", " | Safe delivery", ""])}`;
      attributes = [server, `${compactLot.format(amount)} per lot`, rng.pick(DELIVERY_METHODS)];
      description = `${compactLot.format(amount)} ${labelName} delivered to your character on ${server}. Stock is kept topped up, so larger orders ship in a single trade.`;
      break;
    }
    case "accounts": {
      price = money(skewLow(rng, 8, 400));
      if (app) {
        title = `${rng.pick(PLAN_TIERS)} ${game.name} account · ${rng.pick(DURATIONS)}`;
        attributes = [rng.pick(["Personal", "Shared seat", "Private"]), rng.pick(["Email included", "Login change allowed", "Instant access"])];
      } else {
        const level = rng.int(10, 300);
        title = experience
          ? `${experience} account, level ${level} with ${rng.pick(ACCOUNT_PERKS)}`
          : `Level ${level} account with ${rng.pick(ACCOUNT_PERKS)}`;
        attributes = [`Level ${level}`, rng.pick(PLATFORMS), rng.pick(["Full access", "Email changeable", "Original owner"])];
        if (variant) attributes.unshift(variant);
      }
      description = `Hand-checked ${app ? "account" : "profile"} with full details sent after purchase. The seller walks you through securing it and changing credentials.`;
      break;
    }
    case "items": {
      price = money(skewLow(rng, 1, 250, 2.2));
      stock = rng.int(1, 10);
      const flavor = `${rng.pick(ADJECTIVES)} ${rng.pick(NOUNS)}`;
      title = experience ? `${experience}: ${flavor}` : `${labelName}: ${flavor}`;
      attributes = [labelName, rng.pick(["Tradeable", "Account-bound", "Gift delivery"]), ...(variant ? [variant] : [])].slice(0, 3);
      description = `${flavor.charAt(0).toUpperCase() + flavor.slice(1)} for ${game.name}. Delivered by trade or gift as soon as you are online.`;
      break;
    }
    case "services": {
      price = money(skewLow(rng, 5, 150, 1.6));
      stock = rng.int(1, 5);
      const hours = rng.int(2, 48);
      title = rng.pick([
        `${labelName} by a top player`,
        `${labelName}, done in about ${hours} hours`,
        `${labelName} with live progress updates`,
        `Pro ${labelName.toLowerCase()} session`,
      ]);
      attributes = [labelName, rng.pick(["Piloted", "Self-play", "Duo queue"]), `~${hours} h`];
      if (variant) attributes[2] = variant;
      description = `${labelName} handled by an experienced player. You get progress updates in chat and can pause the order at any time.`;
      break;
    }
    case "keys": {
      price = money(skewLow(rng, 4, 80, 1.7));
      stock = rng.int(5, 99);
      const lower = labelName.toLowerCase();
      if (lower === "keys" || lower === "cd keys") title = `${game.name} key (Global)`;
      else if (lower.includes("top up")) title = `${game.name} top-up, ${rng.pick(["small", "medium", "large", "mega"])} pack`;
      else if (lower.includes("pass")) title = `${labelName}, current season`;
      else if (lower.includes("subscription") || lower === "premium" || lower === "nitro" || lower === "plus") title = `${labelName}, ${rng.pick(DURATIONS)}`;
      else if (lower.includes("activation")) title = `${labelName}: full ${game.name} library`;
      else title = `${labelName} (Global)`;
      attributes = [rng.pick(["Global", "EU", "NA", "Region free"]), rng.pick(["Digital code", "Account top-up", "Gift link"])];
      description = `${labelName} for ${game.name}. Codes arrive in your order chat and the seller confirms activation with you.`;
      break;
    }
    default: {
      price = money(skewLow(rng, 3, 60));
      stock = rng.int(1, 20);
      title = rng.pick([`${labelName}: custom request`, `${game.name} bundle deal`, `${labelName} for ${game.name}`]);
      attributes = [labelName, rng.pick(["Flexible", "Custom", "Chat first"])];
      description = `Anything that does not fit the other tabs. Message the seller with what you need before ordering.`;
    }
  }

  const sale = rng.chance(0.15);
  const originalPrice = sale ? money(price / (1 - rng.float(0.1, 0.3))) : undefined;
  if (type === "accounts") stock = 1;

  return {
    id: `${game.slug}~${type}~${index}`,
    gameSlug: game.slug,
    sellerId: seller.id,
    title,
    type,
    labelName,
    variant,
    experience,
    price,
    originalPrice,
    unit,
    stock,
    deliveryMinutes: delivery(rng, type),
    attributes,
    description,
    createdOrder: index,
  };
}

const cache = new Map<string, Listing[]>();

/** All listings for a game tab. Pass `variant` to keep only that server/region. */
export function getListings(game: ListingGame, type: ListingTypeId, variant?: string): Listing[] {
  const key = `${game.slug}~${type}`;
  let all = cache.get(key);
  if (!all) {
    const count = listingCount(game, type);
    all = Array.from({ length: count }, (_, i) => buildListing(game, type, i));
    cache.set(key, all);
  }
  return variant ? all.filter((l) => l.variant === variant) : all;
}

export function parseListingId(id: string): { slug: string; type: ListingTypeId; index: number } | null {
  const [slug, type, index] = id.split("~");
  if (!slug || !type || index === undefined) return null;
  return { slug, type: type as ListingTypeId, index: Number(index) };
}

export function perUnitLabel(listing: Listing): string | null {
  if (!listing.unit) return null;
  const perOne = listing.price / listing.unit.amount;
  const steps: [number, string][] = [
    [1, ""],
    [1_000, "1K "],
    [1_000_000, "1M "],
  ];
  for (const [mult, prefix] of steps) {
    const value = perOne * mult;
    if (value >= 0.01) {
      return `${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: value < 1 ? 3 : 2 }).format(value)} per ${prefix}${listing.unit.label}`;
    }
  }
  return null;
}
