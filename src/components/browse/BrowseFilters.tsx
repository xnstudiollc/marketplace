"use client";

import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CATEGORY_META, CATEGORY_ORDER, LISTING_TYPE_META, LISTING_TYPE_ORDER } from "@/lib/categories";
import { activeFilterCount, type BrowseResult, type BrowseState } from "@/lib/browse";
import { formatNumber } from "@/lib/format";
import type { CategoryId, ListingTypeId } from "@/lib/types";

export interface BrowseFiltersProps {
  idPrefix: string;
  state: BrowseState;
  counts: Pick<BrowseResult, "categoryCounts" | "typeCounts">;
  showCategories: boolean;
  onToggleCategory: (id: CategoryId) => void;
  onToggleType: (id: ListingTypeId) => void;
  onVariants: (value: boolean) => void;
  onClear: () => void;
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="min-w-0 space-y-1">
      <legend className="mb-2 text-[0.6875rem] font-semibold tracking-[0.06em] text-fg-subtle uppercase">{title}</legend>
      {children}
    </fieldset>
  );
}

function Option({
  id,
  label,
  count,
  checked,
  accent,
  icon,
  onChange,
}: {
  id: string;
  label: string;
  count: number;
  checked: boolean;
  accent: string;
  icon: ReactNode;
  onChange: () => void;
}) {
  const disabled = count === 0 && !checked;
  return (
    <label
      htmlFor={id}
      data-disabled={disabled || undefined}
      className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl px-2 text-sm text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg data-disabled:cursor-not-allowed data-disabled:opacity-45 data-disabled:hover:bg-transparent"
    >
      <Checkbox id={id} checked={checked} disabled={disabled} onCheckedChange={onChange} />
      <span className="grid size-5 shrink-0 place-items-center" style={{ color: accent }} aria-hidden>
        {icon}
      </span>
      <span className="min-w-0 flex-1 leading-snug">{label}</span>
      <span className="tabular text-xs text-fg-subtle">{formatNumber(count)}</span>
    </label>
  );
}

export function BrowseFilters({
  idPrefix,
  state,
  counts,
  showCategories,
  onToggleCategory,
  onToggleType,
  onVariants,
  onClear,
}: BrowseFiltersProps) {
  const active = activeFilterCount(state) + (state.letter ? 1 : 0);
  return (
    <div className="space-y-6">
      {showCategories && (
        <Group title="Category">
          {CATEGORY_ORDER.map((id) => {
            const meta = CATEGORY_META[id];
            const Icon = meta.icon;
            return (
              <Option
                key={id}
                id={`${idPrefix}-cat-${id}`}
                label={meta.label}
                count={counts.categoryCounts[id]}
                checked={state.cats.includes(id)}
                accent={meta.accent}
                icon={<Icon className="size-4" strokeWidth={1.75} />}
                onChange={() => onToggleCategory(id)}
              />
            );
          })}
        </Group>
      )}
      <Group title="Listing type">
        {LISTING_TYPE_ORDER.map((id) => {
          const meta = LISTING_TYPE_META[id];
          const Icon = meta.icon;
          return (
            <Option
              key={id}
              id={`${idPrefix}-type-${id}`}
              label={meta.label}
              count={counts.typeCounts[id]}
              checked={state.types.includes(id)}
              accent={meta.accent}
              icon={<Icon className="size-4" strokeWidth={1.75} />}
              onChange={() => onToggleType(id)}
            />
          );
        })}
      </Group>
      <div className="flex min-h-11 items-center justify-between gap-3 rounded-xl px-2">
        <label htmlFor={`${idPrefix}-variants`} className="cursor-pointer text-sm text-fg-muted">
          Has variants
          <span className="block text-xs text-fg-subtle">Regions, servers or editions</span>
        </label>
        <Switch id={`${idPrefix}-variants`} checked={state.variants} onCheckedChange={onVariants} />
      </div>
      <Button variant="ghost" size="sm" className="w-full" onClick={onClear} disabled={active === 0}>
        Clear filters
      </Button>
    </div>
  );
}
