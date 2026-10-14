"use client";

import { useState, type ReactNode } from "react";
import { Chip } from "@/components/common/Chip";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  DELIVERY_OPTIONS,
  DEFAULT_FILTERS,
  LISTING_SORTS,
  RATING_OPTIONS,
  activeListingFilterCount,
  type ListingFilterState,
  type ListingSort,
} from "@/lib/listing-filters";
import { formatPrice } from "@/lib/format";

const EXPERIENCE_PREVIEW = 12;

function Group({ title, id, children }: { title: string; id: string; children: ReactNode }) {
  return (
    <div className="space-y-2.5" role="group" aria-labelledby={id}>
      <p id={id} className="text-[0.6875rem] font-semibold tracking-[0.06em] text-fg-subtle uppercase">
        {title}
      </p>
      {children}
    </div>
  );
}

export interface ListingFiltersProps {
  idPrefix: string;
  state: ListingFilterState;
  onChange: (next: Partial<ListingFilterState>) => void;
  bounds: [number, number];
  labels: string[];
  experiences: string[];
  accent: string;
}

export function ListingFilters({ idPrefix, state, onChange, bounds, labels, experiences, accent }: ListingFiltersProps) {
  const [showAllExperiences, setShowAllExperiences] = useState(false);
  const price = state.price ?? bounds;
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const shownExperiences = showAllExperiences ? experiences : experiences.slice(0, EXPERIENCE_PREVIEW);
  const id = (s: string) => `${idPrefix}-${s}`;

  return (
    <div className="space-y-6">
      <Group title="Sort by" id={id("sort-label")}>
        <Select value={state.sort} onValueChange={(v) => onChange({ sort: v as ListingSort })}>
          <SelectTrigger aria-labelledby={id("sort-label")} className="glass-subtle h-11! w-full rounded-xl border-line px-3 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" className="glass-raised rounded-xl">
            {LISTING_SORTS.map((s) => (
              <SelectItem key={s.id} value={s.id} className="min-h-10 rounded-lg">
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Group>

      {bounds[1] > bounds[0] && (
        <Group title="Price" id={id("price-label")}>
          <p className="tabular flex justify-between text-sm text-fg" aria-live="polite">
            <span>{formatPrice(price[0])}</span>
            <span>{formatPrice(price[1])}</span>
          </p>
          <Slider
            min={bounds[0]}
            max={bounds[1]}
            step={1}
            minStepsBetweenThumbs={1}
            value={price}
            thumbLabels={["Minimum price", "Maximum price"]}
            onValueChange={(v) => {
              const next: [number, number] = [v[0], v[1]];
              onChange({ price: next[0] <= bounds[0] && next[1] >= bounds[1] ? null : next });
            }}
            className="py-3"
          />
        </Group>
      )}

      <Group title="Delivery" id={id("delivery-label")}>
        <div role="radiogroup" aria-labelledby={id("delivery-label")} className="flex flex-wrap gap-2">
          {DELIVERY_OPTIONS.map((o) => (
            <Chip key={o.id} mode="radio" accent={accent} selected={state.delivery === o.id} onClick={() => onChange({ delivery: o.id })}>
              {o.label}
            </Chip>
          ))}
        </div>
      </Group>

      <Group title="Seller rating" id={id("rating-label")}>
        <div role="radiogroup" aria-labelledby={id("rating-label")} className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((o) => (
            <Chip key={o.id} mode="radio" accent={accent} selected={state.rating === o.id} onClick={() => onChange({ rating: o.id })}>
              {o.label}
            </Chip>
          ))}
        </div>
      </Group>

      <div className="flex min-h-11 items-center justify-between gap-3">
        <label htmlFor={id("online")} className="cursor-pointer text-sm text-fg-muted">
          Online sellers only
        </label>
        <Switch id={id("online")} checked={state.online} onCheckedChange={(online) => onChange({ online })} />
      </div>

      {labels.length > 1 && (
        <Group title="Category" id={id("labels-label")}>
          <div className="flex flex-wrap gap-2">
            {labels.map((l) => (
              <Chip key={l} accent={accent} selected={state.labels.includes(l)} onClick={() => onChange({ labels: toggle(state.labels, l) })}>
                {l}
              </Chip>
            ))}
          </div>
        </Group>
      )}

      {experiences.length > 0 && (
        <Group title="Experience" id={id("exp-label")}>
          <div className="flex flex-wrap gap-2">
            {shownExperiences.map((e) => (
              <Chip
                key={e}
                accent={accent}
                selected={state.experiences.includes(e)}
                onClick={() => onChange({ experiences: toggle(state.experiences, e) })}
              >
                {e}
              </Chip>
            ))}
          </div>
          {experiences.length > EXPERIENCE_PREVIEW && (
            <Button variant="link" size="sm" className="h-auto px-0" onClick={() => setShowAllExperiences((v) => !v)}>
              {showAllExperiences ? "Show fewer" : `Show all ${experiences.length}`}
            </Button>
          )}
        </Group>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="w-full"
        disabled={activeListingFilterCount(state) === 0}
        onClick={() => onChange({ ...DEFAULT_FILTERS, sort: state.sort })}
      >
        Clear filters
      </Button>
    </div>
  );
}
