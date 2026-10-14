import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, Stagger } from "@/components/common/Reveal";
import { SectionHeader } from "@/components/common/SectionHeader";
import { GameCard, type GameCardData } from "@/components/game/GameCard";
import { Button } from "@/components/ui/button";

export function FeaturedGrid({ games }: { games: GameCardData[] }) {
  return (
    <section aria-labelledby="featured-title" className="container-page section-y">
      <Reveal>
        <SectionHeader
          id="featured-title"
          eyebrow="Featured"
          title="Popular right now"
          description="The games with the most active sellers and the widest range of listings."
          action={
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/browse">
                View all games
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          }
        />
      </Reveal>
      <Stagger as="ul" className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4" itemClassName="h-full">
        {games.map((g) => (
          <GameCard key={g.slug} game={g} className="h-full" />
        ))}
      </Stagger>
      <div className="mt-6 sm:hidden">
        <Button asChild variant="secondary" className="w-full">
          <Link href="/browse">View all games</Link>
        </Button>
      </div>
    </section>
  );
}
