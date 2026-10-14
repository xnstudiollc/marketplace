#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CATEGORIES,
  LISTING_TYPES,
  heuristicCategory,
  initials,
  labelText,
  listingType,
  slugify,
} from "./lib/normalize.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const inputPath = resolve(root, process.argv[2] ?? "data/raw/games.raw.json");
const outDir = resolve(root, "data");

const COLLECTION_NAMES = new Set(["mobile games", "other games", "vr games"]);
const FEATURED = [
  "counter-strike-2", "valorant", "fortnite", "genshin-impact", "roblox", "minecraft",
  "gta-5-online", "path-of-exile-2", "diablo-4", "world-of-warcraft", "apex-legends",
  "elden-ring", "brawl-stars", "league-of-legends", "pubg-mobile", "ea-sports-fc-26",
];
const EXPERIENCE_SPLIT = {
  roblox: new Set(
    ["Robux", "Gift Cards", "Robux Top Up (Packages)", "Accounts", "Skins", "Limiteds", "Prime Gaming", "Studio", "Plus", "Twitch Drops", "Other"].map((s) => s.toLowerCase()),
  ),
};

if (!existsSync(inputPath)) {
  console.error(`Raw export not found at ${inputPath}\nSave the scraped JSON array there (or pass a path) and re-run.`);
  process.exit(1);
}

const overrides = JSON.parse(readFileSync(resolve(outDir, "category-overrides.json"), "utf8"));
const rawParsed = JSON.parse(readFileSync(inputPath, "utf8"));
const rawList = Array.isArray(rawParsed)
  ? rawParsed
  : rawParsed.games ?? rawParsed.data ?? rawParsed.items ?? [];

const bySlug = new Map();
const report = { input: rawList.length, duplicatesMerged: [], skipped: [], heuristic: [], unknownLabels: new Map() };

for (const item of rawList) {
  const name = String(item?.name ?? item?.title ?? "").trim();
  if (!name) {
    report.skipped.push(item);
    continue;
  }
  const slug = slugify(name);
  const salesLabels = (item.sales_items ?? item.salesItems ?? []).map(labelText).filter(Boolean);
  const variantLabels = (item.variants ?? []).map(labelText).filter(Boolean);

  const existing = bySlug.get(slug);
  if (existing) {
    report.duplicatesMerged.push(name);
    for (const l of salesLabels) if (!existing.labels.includes(l)) existing.labels.push(l);
    for (const v of variantLabels) if (!existing.variants.includes(v)) existing.variants.push(v);
    continue;
  }
  bySlug.set(slug, { name, slug, labels: [...new Set(salesLabels)], variants: [...new Set(variantLabels)] });
}

const games = [];
for (const entry of [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }))) {
  let labels = entry.labels;
  let experiences;
  const split = EXPERIENCE_SPLIT[entry.slug];
  if (split) {
    experiences = labels.filter((l) => !split.has(l.toLowerCase()));
    labels = labels.filter((l) => split.has(l.toLowerCase()));
  }

  let category = overrides.categories[entry.slug];
  if (!category) {
    category = heuristicCategory(labels);
    report.heuristic.push(`${entry.name} -> ${category}`);
  }

  const typed = labels.map((name) => ({ name, type: listingType(name) }));
  for (const t of typed) {
    if (t.type === "currency" && t.name.toLowerCase() !== "currency") {
      report.unknownLabels.set(t.name, (report.unknownLabels.get(t.name) ?? 0) + 1);
    }
  }
  const order = LISTING_TYPES.map((t) => t.id);
  const listingTypes = order.filter((id) => typed.some((t) => t.type === id));

  const game = {
    name: entry.name,
    slug: entry.slug,
    initials: initials(entry.name),
    category,
    ...(COLLECTION_NAMES.has(entry.name.toLowerCase()) ? { collection: true } : {}),
    listingTypes,
    labels: typed,
    ...(entry.variants.length ? { variants: entry.variants } : {}),
    ...(experiences?.length ? { experiences } : {}),
  };
  games.push(game);
}

const validCategories = new Set(CATEGORIES.map((c) => c.id));
const problems = [];
for (const g of games) if (!validCategories.has(g.category)) problems.push(`Invalid category "${g.category}" for ${g.name}`);
const slugs = new Set(games.map((g) => g.slug));
if (slugs.size !== games.length) problems.push("Slug collision detected");
for (const g of games) if (!g.slug) problems.push(`Empty slug for ${g.name}`);
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

const overridesUnused = Object.keys(overrides.categories).filter((s) => !slugs.has(s));
const featured = FEATURED.filter((s) => slugs.has(s));

mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "games.json"), JSON.stringify(games, null, 2) + "\n");
writeFileSync(resolve(outDir, "categories.json"), JSON.stringify({ categories: CATEGORIES, listingTypes: LISTING_TYPES }, null, 2) + "\n");
writeFileSync(resolve(outDir, "featured.json"), JSON.stringify(featured, null, 2) + "\n");

const counts = Object.fromEntries(CATEGORIES.map((c) => [c.id, games.filter((g) => g.category === c.id).length]));
console.log(`Input entries:        ${report.input}`);
console.log(`Unique games written: ${games.length}`);
console.log(`Duplicates merged:    ${report.duplicatesMerged.length}${report.duplicatesMerged.length ? " (" + report.duplicatesMerged.join(", ") + ")" : ""}`);
console.log(`Skipped (no name):    ${report.skipped.length}`);
console.log(`Per category:         ${JSON.stringify(counts)}`);
console.log(`Overrides applied:    ${Object.keys(overrides.categories).length - overridesUnused.length} (ignored, not in data: ${overridesUnused.length})`);
console.log(`Heuristic category (review these): ${report.heuristic.length}`);
for (const line of report.heuristic) console.log(`  - ${line}`);
console.log(`Featured slugs found: ${featured.length}/${FEATURED.length}`);
if (report.unknownLabels.size) {
  console.log(`Labels treated as in-game currency by default (check for mistakes):`);
  const sorted = [...report.unknownLabels.entries()].sort((a, b) => b[1] - a[1]);
  console.log("  " + sorted.map(([l, n]) => `${l} (${n})`).join(", "));
}
