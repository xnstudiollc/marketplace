import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { tileBackground } from "@/components/game/GameImage";
import { Button } from "@/components/ui/button";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/categories";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-16 text-center sm:py-24">
      <div aria-hidden className="relative mb-8 grid h-28 w-56 place-items-center">
        {["nf-a", "nf-c", "nf-b"].map((seed, i) => (
          <div
            key={seed}
            className={
              i === 2
                ? "absolute z-10 size-24 rounded-[22%] border border-white/15 shadow-[0_18px_40px_rgba(0,0,0,0.4)]"
                : `absolute size-20 rounded-[22%] border border-white/15 opacity-55 ${i === 0 ? "-translate-x-16 -rotate-12" : "translate-x-16 rotate-12"}`
            }
            style={{ background: tileBackground(seed) }}
          />
        ))}
        <span className="relative z-20 font-mono text-3xl font-bold text-white/92 [text-shadow:0_2px_10px_rgba(0,0,0,0.35)]">404</span>
      </div>
      <p className="text-[0.6875rem] font-semibold tracking-[0.06em] text-brand-2 uppercase">Page not found</p>
      <h1 className="text-gradient mt-3 max-w-xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        This level does not exist
      </h1>
      <p className="mt-3 max-w-md text-fg-muted">The page may have moved, or the link has a typo. Search for a game instead.</p>

      <form action="/browse" method="get" role="search" className="mt-8 flex w-full max-w-md gap-2">
        <label htmlFor="nf-search" className="sr-only">
          Search games
        </label>
        <div className="glass-subtle flex h-12 flex-1 items-center gap-2 rounded-xl px-3 focus-within:border-brand/60">
          <Search className="size-4 shrink-0 text-fg-subtle" aria-hidden />
          <input
            id="nf-search"
            name="q"
            type="search"
            placeholder="Search games"
            autoComplete="off"
            className="h-full w-full min-w-0 bg-transparent text-base text-fg outline-none placeholder:text-fg-subtle"
          />
        </div>
        <Button type="submit" size="lg">
          Search
        </Button>
      </form>

      <nav aria-label="Popular categories" className="mt-10">
        <ul className="flex flex-wrap justify-center gap-2">
          {CATEGORY_ORDER.map((id) => (
            <li key={id}>
              <Link
                href={`/category/${id}`}
                className="glass-subtle inline-flex min-h-10 items-center gap-2 rounded-full px-3.5 text-[0.8125rem] font-medium text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
              >
                <span className="size-1.5 rounded-full" style={{ background: CATEGORY_META[id].accent }} aria-hidden />
                {CATEGORY_META[id].label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Button asChild variant="ghost" className="mt-8">
        <Link href="/">
          Back to home <ArrowRight aria-hidden />
        </Link>
      </Button>
    </div>
  );
}
