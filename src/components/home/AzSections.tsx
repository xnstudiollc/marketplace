"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { GameImage } from "@/components/game/GameImage";
import { azSectionId } from "@/lib/letters";

/** [name, slug, initials, flags] where flags bit 1 = collection, bit 2 = popular. */
export type AzTuple = [string, string, string, number];

export function AzSections({ groups }: { groups: { letter: string; games: AzTuple[] }[] }) {
  return (
    <div className="space-y-10">
      {groups.map(({ letter, games }) => {
        const id = azSectionId(letter);
        return (
          <section
            key={letter}
            id={id}
            data-letter={letter}
            aria-labelledby={`${id}-title`}
            className="scroll-mt-20"
          >
            <h3 id={`${id}-title`} className="mb-3 flex items-baseline gap-3 border-b border-line pb-2">
              <span className="text-2xl font-bold text-fg">{letter}</span>
              <span className="tabular text-[0.8125rem] text-fg-subtle">{games.length} games</span>
            </h3>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-1 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {games.map(([name, slug, initials, flags]) => {
                const popular = (flags & 2) !== 0;
                return (
                  <li key={slug}>
                    <Link href={`/games/${slug}`} title={name} prefetch={false} className="az-link" data-popular={popular || undefined}>
                      <GameImage game={{ name, slug, initials, ...(flags & 1 ? { collection: true } : {}) }} size="sm" className="size-8" />
                      <span>{name}</span>
                      {popular && (
                        <>
                          <Star className="size-3.5 shrink-0 text-warning" fill="currentColor" strokeWidth={0} aria-hidden />
                          <span className="sr-only">(popular)</span>
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
