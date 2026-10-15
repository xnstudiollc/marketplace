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

const imagesPath = resolve(root, "data/game-images.json");
const art = {};
if (existsSync(imagesPath)) {
  const raw = JSON.parse(readFileSync(imagesPath, "utf8"));
  const igdbId = (url) => url?.match(/\/([a-z0-9]+)\.jpg$/i)?.[1];
  for (const [slug, e] of Object.entries(raw)) {
    if (!known.has(slug)) continue;
    const entry = {};
    if (e.source === "igdb") {
      const cover = igdbId(e.cover_big);
      const artwork = igdbId(e.artworks?.[0]);
      const shot = igdbId(e.screenshots?.[0]);
      if (cover) entry.c = cover;
      if (artwork) entry.a = artwork;
      if (shot && (cover || artwork)) entry.s = shot;
    } else if (e.source === "steam") {
      const appid = e.header?.match(/\/apps\/(\d+)\//)?.[1];
      if (appid) entry.h = Number(appid);
    }
    if (entry.c || entry.a || entry.h) art[slug] = entry;
  }
}

mkdirSync(generatedDir, { recursive: true });
writeFileSync(resolve(generatedDir, "game-art.json"), JSON.stringify(art) + "\n");
writeFileSync(resolve(generatedDir, "game-assets.json"), JSON.stringify(assets, null, 2) + "\n");
mkdirSync(resolve(root, "public"), { recursive: true });
writeFileSync(resolve(root, "public/search-index.json"), JSON.stringify(searchIndex));

console.log(`Indexed ${Object.keys(art).length} game art entries, ${Object.keys(assets).length} game logos, ${searchIndex.length} search entries.`);
