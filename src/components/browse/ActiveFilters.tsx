"use client";

import { X } from "lucide-react";
import { CATEGORY_META, LISTING_TYPE_META } from "@/lib/categories";
import type { BrowseState } from "@/lib/browse";
import type { CategoryId, ListingTypeId } from "@/lib/types";

interface Pill {
  key: string;
  label: string;
  accent: string;
  onRemove: () => void;
}

export function ActiveFilters({
  state,
  onToggleCategory,
  onToggleType,
  onVariants,
  onLetter,
  onClearAll,
}: {
  state: BrowseState;
  onToggleCategory: (id: CategoryId) => void;
  onToggleType: (id: ListingTypeId) => void;
  onVariants: (value: boolean) => void;
  onLetter: (letter: string | null) => void;
  onClearAll: () => void;
}) {
  const pills: Pill[] = [
    ...state.cats.map((id) => ({
      key: `cat-${id}`,
      label: CATEGORY_META[id].label,
      accent: CATEGORY_META[id].accent,
      onRemove: () => onToggleCategory(id),
    })),
    ...state.types.map((id) => ({
      key: `type-${id}`,
      label: LISTING_TYPE_META[id].label,
      accent: LISTING_TYPE_META[id].accent,
      onRemove: () => onToggleType(id),
    })),
    ...(state.variants ? [{ key: "variants", label: "Has variants", accent: "#22D3EE", onRemove: () => onVariants(false) }] : []),
    ...(state.letter
      ? [{ key: "letter", label: `Starts with ${state.letter}`, accent: "#7C5CFF", onRemove: () => onLetter(null) }]
      : []),
  ];

  if (!pills.length && !state.q.trim()) return null;

  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {pills.map((p) => (
        <li key={p.key}>
          <button
            type="button"
            onClick={p.onRemove}
            className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-line bg-white/[0.03] py-1 pr-2 pl-3 text-[0.8125rem] text-fg transition-colors hover:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span className="size-1.5 rounded-full" style={{ background: p.accent }} aria-hidden />
            {p.label}
            <X className="size-3.5 text-fg-subtle" aria-hidden />
            <span className="sr-only">(remove filter)</span>
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={onClearAll}
          className="min-h-8 rounded-full px-3 text-[0.8125rem] font-medium text-brand-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Clear all
        </button>
      </li>
    </ul>
  );
}
