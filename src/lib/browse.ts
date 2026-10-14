import { CATEGORY_ORDER, LISTING_TYPE_ORDER, isCategoryId, isListingTypeId } from "./categories";
import { LETTERS, letterOf } from "./letters";
import { hash } from "./mock/rng";
import type { Searcher } from "./search";
import type { BrowseEntry, CategoryId, ListingTypeId } from "./types";

export type SortId = "relevance" | "az" | "za" | "types" | "new";

export const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: "relevance", label: "Best match" },
  { id: "az", label: "A to Z" },
  { id: "za", label: "Z to A" },
  { id: "types", label: "Most listing types" },
  { id: "new", label: "Newest-looking" },
];

export const PAGE_SIZE = 48;

export interface BrowseState {
  q: string;
  cats: CategoryId[];
  types: ListingTypeId[];
  variants: boolean;
  letter: string | null;
  sort: SortId;
}

function list(params: URLSearchParams, key: string): string[] {
  return [...new Set((params.get(key) ?? "").split(",").filter(Boolean))];
}

export function parseBrowseState(params: URLSearchParams): BrowseState {
  const q = params.get("q") ?? "";
  const rawSort = params.get("sort");
  const explicit = SORT_OPTIONS.find((o) => o.id === rawSort)?.id;
  const sort: SortId = explicit && (explicit !== "relevance" || q.trim()) ? explicit : q.trim() ? "relevance" : "az";
  const letter = params.get("letter")?.toUpperCase() ?? null;
  return {
    q,
    cats: CATEGORY_ORDER.filter((c) => list(params, "cat").some((v) => isCategoryId(v) && v === c)),
    types: LISTING_TYPE_ORDER.filter((t) => list(params, "type").some((v) => isListingTypeId(v) && v === t)),
    variants: params.get("variants") === "1",
    letter: letter && LETTERS.includes(letter) ? letter : null,
    sort,
  };
}

export function activeFilterCount(state: BrowseState): number {
  return state.cats.length + state.types.length + (state.variants ? 1 : 0);
}

type Facet = "cat" | "type" | "letter";

function matches(entry: BrowseEntry, state: BrowseState, skip?: Facet): boolean {
  if (skip !== "cat" && state.cats.length && !state.cats.includes(entry.category)) return false;
  if (skip !== "type" && state.types.length && !state.types.some((t) => entry.listingTypes.includes(t))) return false;
  if (state.variants && !entry.hasVariants) return false;
  if (skip !== "letter" && state.letter && letterOf(entry.name) !== state.letter) return false;
  return true;
}

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

function sortEntries(entries: BrowseEntry[], sort: SortId): BrowseEntry[] {
  if (sort === "relevance") return entries;
  const out = entries.slice();
  if (sort === "az") out.sort((a, b) => collator.compare(a.name, b.name));
  if (sort === "za") out.sort((a, b) => collator.compare(b.name, a.name));
  if (sort === "types") out.sort((a, b) => b.listingTypes.length - a.listingTypes.length || collator.compare(a.name, b.name));
  if (sort === "new") out.sort((a, b) => hash(`${a.slug}:new`) - hash(`${b.slug}:new`));
  return out;
}

export interface BrowseResult {
  results: BrowseEntry[];
  categoryCounts: Record<CategoryId, number>;
  typeCounts: Record<ListingTypeId, number>;
  letterCounts: Record<string, number>;
}

export function runBrowse(entries: BrowseEntry[], searcher: Searcher<BrowseEntry>, state: BrowseState): BrowseResult {
  const matched = state.q.trim() ? searcher.search(state.q) : entries;

  const categoryCounts = Object.fromEntries(CATEGORY_ORDER.map((c) => [c, 0])) as Record<CategoryId, number>;
  const typeCounts = Object.fromEntries(LISTING_TYPE_ORDER.map((t) => [t, 0])) as Record<ListingTypeId, number>;
  const letterCounts: Record<string, number> = Object.fromEntries(LETTERS.map((l) => [l, 0]));
  const results: BrowseEntry[] = [];

  for (const entry of matched) {
    if (matches(entry, state, "cat")) categoryCounts[entry.category] += 1;
    if (matches(entry, state, "type")) for (const t of entry.listingTypes) typeCounts[t] += 1;
    if (matches(entry, state, "letter")) letterCounts[letterOf(entry.name)] += 1;
    if (matches(entry, state)) results.push(entry);
  }

  return { results: sortEntries(results, state.sort), categoryCounts, typeCounts, letterCounts };
}

export function stateSignature(state: BrowseState): string {
  return JSON.stringify([state.q.trim(), state.cats, state.types, state.variants, state.letter, state.sort]);
}
