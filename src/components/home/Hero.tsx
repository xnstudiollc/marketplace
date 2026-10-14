import Link from "next/link";
import { ArrowRight, Headphones, LayoutGrid, Sparkles, Zap, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameImage } from "@/components/game/GameImage";
import { HeroSearch } from "@/components/home/HeroSearch";
import { formatCompact, formatNumber } from "@/lib/format";
import type { SiteStats } from "@/lib/data";
import type { Game } from "@/lib/types";

function Marquee({ games }: { games: Game[] }) {
  const row = (key: string) => (
    <ul key={key} className="flex shrink-0 gap-4 pr-4">
      {games.map((g) => (
        <li key={g.slug} className="flex items-center gap-3 rounded-2xl border border-line bg-white/[0.025] py-2 pr-4 pl-2">
          <GameImage game={g} size="sm" className="size-11" />
          <span className="text-sm font-medium whitespace-nowrap text-fg-muted">{g.name}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div
      aria-hidden
      className="motion-hide group relative mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]"
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

export function Hero({ stats, marquee }: { stats: SiteStats; marquee: Game[] }) {
  const pills = [
    { icon: Gamepad2, value: formatNumber(stats.games), label: "games and apps" },
    { icon: LayoutGrid, value: String(stats.categories), label: "categories" },
    { icon: Zap, value: formatCompact(stats.instantOffers), label: "instant offers" },
    { icon: Headphones, value: "24/7", label: "buyer support" },
  ];

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 h-[80vh]" />
      <div
        aria-hidden
        className="absolute top-[-10%] left-1/2 -z-10 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.22),transparent)] blur-2xl"
      />
      <div className="container-page flex flex-col items-center pt-16 pb-12 text-center sm:pt-24 lg:min-h-[80dvh] lg:justify-center lg:pt-20">
        <p className="glass-subtle inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium text-fg-muted">
          <Sparkles className="size-3.5 text-brand-2" aria-hidden />
          Marketplace for gamers
        </p>
        <h1 id="hero-title" className="text-hero text-gradient mt-6 max-w-4xl font-bold">
          Everything for your next level, in one place
        </h1>
        <p className="mt-5 max-w-xl text-base text-fg-muted sm:text-lg">
          Accounts, in-game currency, items, boosting and keys from verified sellers, with protected checkout and
          delivery you can track.
        </p>
        <div className="mt-8 flex w-full justify-center">
          <HeroSearch count={stats.games} />
        </div>
        <div className="mt-5 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button asChild size="lg">
            <Link href="/browse">
              Browse all games
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="#how-it-works">How it works</Link>
          </Button>
        </div>
        <ul className="mt-10 grid w-full max-w-3xl grid-cols-2 gap-2.5 sm:grid-cols-4">
          {pills.map(({ icon: Icon, value, label }) => (
            <li key={label} className="glass flex items-center gap-3 rounded-2xl px-3.5 py-3 text-left">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/12 text-brand-2">
                <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="tabular block text-base font-semibold text-fg">{value}</span>
                <span className="block text-xs text-fg-muted">{label}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Marquee games={marquee} />
    </section>
  );
}
