import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GlowCard } from "@/components/common/GlowCard";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeader } from "@/components/common/SectionHeader";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/categories";
import { formatNumber } from "@/lib/format";
import type { CategoryId } from "@/lib/types";

export function CategoryRow({ counts }: { counts: Record<CategoryId, number> }) {
  return (
    <section aria-labelledby="categories-title" className="container-page section-y">
      <Reveal>
        <SectionHeader id="categories-title" eyebrow="Categories" title="Start with a category" />
        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-6">
          {CATEGORY_ORDER.map((id) => {
            const meta = CATEGORY_META[id];
            const Icon = meta.icon;
            return (
              <li key={id} className="w-[72%] shrink-0 snap-start min-[480px]:w-[44%] sm:w-auto">
                <GlowCard asChild accent={meta.accent} className="h-full rounded-2xl">
                  <Link href={`/category/${id}`} className="flex h-full flex-col gap-4 p-4">
                    <div className="flex items-start justify-between">
                      <span
                        className="grid size-11 place-items-center rounded-xl border border-white/10"
                        style={{ color: meta.accent, background: `color-mix(in srgb, ${meta.accent} 14%, transparent)` }}
                      >
                        <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                      </span>
                      <ArrowUpRight className="size-4 text-fg-subtle" aria-hidden />
                    </div>
                    <div className="mt-auto">
                      <h3 className="leading-snug font-semibold text-fg">{meta.label}</h3>
                      <p className="tabular mt-0.5 text-[0.8125rem] text-fg-muted">{formatNumber(counts[id])} games</p>
                    </div>
                  </Link>
                </GlowCard>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
