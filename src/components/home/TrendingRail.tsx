import { Flame } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { ScrollRail } from "@/components/common/ScrollRail";
import { SectionHeader } from "@/components/common/SectionHeader";
import { GameCard } from "@/components/game/GameCard";
import { getTrendingGames, toBrowseEntry } from "@/lib/data";
import { getCurrentWeekKey } from "@/lib/trending";

export async function TrendingRail() {
  const week = await getCurrentWeekKey();
  const games = getTrendingGames(`trending:${week}`).map(toBrowseEntry);

  return (
    <section aria-labelledby="trending-title" className="container-page section-y">
      <Reveal>
        <SectionHeader
          id="trending-title"
          eyebrow="This week"
          title="Trending now"
          description="A fresh set of picks every week."
          className="pr-0 sm:pr-24"
        />
        <ScrollRail label="Trending games">
          {games.map((g, i) => (
            <li key={g.slug} className="relative w-[46%] shrink-0 snap-start min-[480px]:w-[36%] sm:w-[220px]">
              <span className="tabular pointer-events-none absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full border border-line bg-bg/70 px-2 py-0.5 text-[0.6875rem] font-semibold text-fg backdrop-blur">
                <Flame className="size-3 text-brand-3" aria-hidden />
                <span className="sr-only">Trending rank </span>#{i + 1}
              </span>
              <GameCard game={g} className="h-full" />
            </li>
          ))}
        </ScrollRail>
      </Reveal>
    </section>
  );
}
