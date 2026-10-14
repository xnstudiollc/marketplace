#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const gamesDir = resolve(root, "public/games");
const generatedDir = resolve(root, "src/generated");
const gamesPath = resolve(root, "data/games.json");

if (!existsSync(gamesPath)) {
  console.error("data/games.json is missing. Run `npm run data:build` first.");
  process.exit(1);
}

const games = JSON.parse(readFileSync(gamesPath, "utf8"));
const known = new Set(games.map((g) => g.slug));

const assets = {};
if (existsSync(gamesDir)) {
  for (const slug of readdirSync(gamesDir)) {
    if (known.has(slug) && existsSync(resolve(gamesDir, slug, "logo.png"))) assets[slug] = true;
  }
}

const searchIndex = games.map(({ name, slug, category, initials, collection }) => ({
  name,
  slug,
  category,
  initials,
  ...(collection ? { collection } : {}),
}));

mkdirSync(generatedDir, { recursive: true });
writeFileSync(resolve(generatedDir, "game-assets.json"), JSON.stringify(assets, null, 2) + "\n");
writeFileSync(resolve(root, "public/search-index.json"), JSON.stringify(searchIndex));

console.log(`Indexed ${Object.keys(assets).length} game logos, ${searchIndex.length} search entries.`);
