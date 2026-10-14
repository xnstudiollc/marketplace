import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameImage } from "@/components/game/GameImage";
import { getAllGames } from "@/lib/data";

export const metadata: Metadata = {
  title: "Tile preview",
  robots: { index: false, follow: false },
};

export default function DevTilesPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const all = getAllGames();
  const step = Math.max(1, Math.floor(all.length / 60));
  const sample = all.filter((_, i) => i % step === 0).slice(0, 60);
  const collections = all.filter((g) => g.collection).slice(0, 4);

  return (
    <div className="container-page section-y space-y-10">
      <header>
        <h1 className="text-2xl font-bold text-fg">Generated tiles</h1>
        <p className="mt-1 text-sm text-fg-muted">Every 1 in {step} games, plus collections and the three sizes.</p>
      </header>
      <ul className="grid grid-cols-3 gap-4 sm:grid-cols-6 lg:grid-cols-10">
        {sample.map((g) => (
          <li key={g.slug} className="flex flex-col items-center gap-2 text-center">
            <GameImage game={g} size="md" />
            <span className="line-clamp-2 text-[0.6875rem] text-fg-subtle" title={g.name}>
              {g.name}
            </span>
          </li>
        ))}
      </ul>
      <section className="flex flex-wrap items-end gap-6">
        {collections.map((g) => (
          <GameImage key={g.slug} game={g} size="lg" />
        ))}
        {sample.slice(0, 3).map((g) => (
          <div key={g.slug} className="flex items-end gap-3">
            <GameImage game={g} size="sm" />
            <GameImage game={g} size="md" />
            <GameImage game={g} size="lg" />
          </div>
        ))}
      </section>
    </div>
  );
}
