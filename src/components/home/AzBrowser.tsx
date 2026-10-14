import { SectionHeader } from "@/components/common/SectionHeader";
import { AzRail } from "@/components/home/AzRail";
import { AzSections, type AzTuple } from "@/components/home/AzSections";
import type { Game } from "@/lib/types";

export function AzBrowser({ groups, popular }: { groups: { letter: string; games: Game[] }[]; popular: string[] }) {
  const popularSet = new Set(popular);
  const compact = groups
    .filter((g) => g.games.length)
    .map(({ letter, games }) => ({
      letter,
      games: games.map(
        (g): AzTuple => [g.name, g.slug, g.initials, (g.collection ? 1 : 0) | (popularSet.has(g.slug) && !g.collection ? 2 : 0)],
      ),
    }));

  return (
    <section aria-labelledby="az-title" className="container-page section-y">
      <SectionHeader
        id="az-title"
        eyebrow="A to Z"
        title="Every game, alphabetically"
        description="Jump to a letter, or scroll the full catalog. Starred titles are the most popular."
      />
      <AzRail letters={groups.map((g) => ({ letter: g.letter, count: g.games.length }))} />
      <AzSections groups={compact} />
    </section>
  );
}
