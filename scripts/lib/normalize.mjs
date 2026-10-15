const STOP_WORDS = new Set(["the", "of", "and", "a", "an", "to", "for", "in", "on", "vs"]);

export function slugify(name) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function initials(name) {
  const words = name
    .normalize("NFKD")
    .replace(/[’'`]/g, "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);
  const significant = words.filter((w) => !STOP_WORDS.has(w.toLowerCase()));
  const pool = significant.length ? significant : words;
  if (pool.length === 0) return "??";
  if (pool.length === 1) return pool[0].slice(0, 2).toUpperCase();
  if (/^\d{3,}$/.test(pool[0])) return pool[0].slice(0, 3);
  return (pool[0][0] + pool[1][0]).toUpperCase();
}

export const CATEGORIES = [
  { id: "pc-console", label: "PC & Console" },
  { id: "online-mmo", label: "Online & MMO" },
  { id: "mobile", label: "Mobile" },
  { id: "ai-software", label: "AI & Software" },
  { id: "platforms-gift-cards", label: "Platforms & Gift Cards" },
  { id: "social-streaming", label: "Social & Streaming" },
];

export const LISTING_TYPES = [
  { id: "accounts", label: "Accounts" },
  { id: "currency", label: "Currency" },
  { id: "items", label: "Items" },
  { id: "services", label: "Boosting & Services" },
  { id: "keys", label: "Keys & Passes" },
  { id: "other", label: "Other" },
];

const set = (...values) => new Set(values.map((v) => v.toLowerCase()));

const ACCOUNTS = set("Accounts");
const OTHER = set("Other", "Referrals", "Clans", "Guilds");
const ITEMS = set(
  "Items", "Skins", "Containers", "Ships", "Equipment", "Pets", "Plants", "Animals",
  "Brainrots", "Deviants", "Capes", "Base Layouts", "Mods", "Wallpapers", "Templates",
  "Plugins", "Resource packs", "Limiteds", "Pins", "Cards", "Bundles", "Decoration",
  "Servers", "Boxes",
);
const SERVICES = set(
  "Boosting", "Coaching", "Services", "Raids", "Dungeons", "Quests", "Farm", "Calibration",
  "LP Removal", "Achievements", "Guides", "Builds", "Gathering", "Professions", "Reputations",
  "Gearing", "Expeditions", "Delves", "Personal missions", "Silver farm", "Credits farm",
  "Trophy Boost", "Brawlers Rank Boost", "Boost: Other", "MMR Boosting", "RM boosting",
  "Spec ops boosting", "Wins boosting", "Stats boosting", "Qualification", "Dota+ services",
  "VHS Pool", "PvE", "PvP", "Exploring locations", "Bosses & dungeons", "Nightmare dungeons",
  "The Pit", "Conqueror", "Events", "City exploration", "Egg Heist", "Merge Tactics",
  "DMZ Recon", "Metro Royale", "Popularity", "Combo", "Astral Realm", "Chronal Nexus",
  "Addons and interface", "Configs", "Region change", "Dark Carnival", "Advertising",
);
const KEYS = set(
  "Keys", "CD Keys", "Offline activation", "Online activation", "Game Pass", "Prime Gaming",
  "Twitch Prime", "Twitch Drops", "Kick Drops", "Subscription", "Battle Pass", "Season Pass",
  "Brawl Pass", "Pro Pass", "Gold Pass", "Pass Royale", "Boom Pass", "Epic Pass",
  "Phantom Pass", "Aurum Pass", "Hyperlink Pass", "Phantasium Pass", "Super Pass",
  "Monthly Card", "Welkin Moon", "Mining Permit", "VIP pass", "Premium", "Time Cards",
  "EA Play subscription", "Nitro", "Server boost", "GTA+", "Plus", "Studio", "Prime",
  "FACEIT Premium", "The Armory", "Lord of Hatred", "Pre-order", "CBT invite",
  "Founders Edition", "Founder's Packs", "Coupons", "Bonus codes", "Gift Cards", "Gifts",
  "Vouchers", "API-key", "API Top Up", "Top Up", "Robux Top Up (Packages)",
  "Diamonds (Packages)", "Midnight keys", "New Eridu City Plan", "Card", "Packs",
);

export function listingType(label) {
  const key = label.trim().toLowerCase();
  if (ACCOUNTS.has(key)) return "accounts";
  if (OTHER.has(key)) return "other";
  if (ITEMS.has(key)) return "items";
  if (SERVICES.has(key)) return "services";
  if (KEYS.has(key)) return "keys";
  return "currency";
}

export function isKnownLabel(label) {
  return listingType(label) !== "currency" || label.trim().toLowerCase() === "currency";
}

export function heuristicCategory(labels) {
  const has = new Set(labels.map((l) => l.trim().toLowerCase()));
  const hasItems = has.has("items");
  if (has.has("offline activation")) return "pc-console";
  const hasKeys = ["keys", "cd keys", "online activation", "game pass", "pre-order", "cbt invite"].some((k) => has.has(k));
  if (hasKeys && !hasItems) return "pc-console";
  if (has.has("top up") && !hasItems && !has.has("boosting")) return "mobile";
  return "online-mmo";
}

export function labelText(entry) {
  if (typeof entry === "string") return entry;
  if (entry && typeof entry === "object") {
    return entry.label ?? entry.name ?? entry.title ?? entry.text ?? null;
  }
  return null;
}
