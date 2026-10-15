import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlowCard } from "@/components/common/GlowCard";
import { Reveal, Stagger } from "@/components/common/Reveal";
import { SectionHeader } from "@/components/common/SectionHeader";
import { LISTING_TYPE_META } from "@/lib/categories";
import { formatNumber } from "@/lib/format";
import type { ListingTypeId } from "@/lib/types";

const TYPES: ListingTypeId[] = ["accounts", "currency", "items", "services", "keys"];

export function TypeTiles({ counts }: { counts: Record<ListingTypeId, number> }) {
  return (
    <section aria-labelledby="types-title" className="container-page section-y">
      <Reveal>
        <SectionHeader id="types-title" eyebrow="Shop by type" title="What are you looking for?" />
      </Reveal>
      <Stagger
        as="ul"
        className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5"
        itemClassName="h-full last:col-span-2 md:last:col-span-1"
      >
        {TYPES.map((id) => {
          const meta = LISTING_TYPE_META[id];
          const Icon = meta.icon;
          return (
            <GlowCard key={id} asChild accent={meta.accent} className="h-full rounded-2xl">
              <Link href={`/browse?type=${id}`} className="group flex h-full flex-col gap-6 p-5 sm:min-h-52">
                <span
                  className="grid size-12 place-items-center rounded-2xl border border-white/10"
                  style={{ color: meta.accent, background: `color-mix(in srgb, ${meta.accent} 14%, transparent)` }}
                >
                  <Icon className="size-6" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="mt-auto">
                  <h3 className="text-[1.125rem] font-semibold text-fg">{meta.label}</h3>
                  <p className="mt-1 text-[0.8125rem] text-fg-muted">{meta.blurb}</p>
                  <p className="tabular mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-fg">
                    {formatNumber(counts[id])} games
                    <ArrowRight
                      className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </p>
                </div>
              </Link>
            </GlowCard>
          );
        })}
      </Stagger>
    </section>
  );
}
