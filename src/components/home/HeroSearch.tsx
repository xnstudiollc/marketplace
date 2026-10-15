"use client";

import { Search } from "lucide-react";
import { useModKey } from "@/hooks/use-mod-key";
import { useUi } from "@/store/ui";

export function HeroSearch({ count }: { count: number }) {
  const setPaletteOpen = useUi((s) => s.setPaletteOpen);
  const mod = useModKey();
  return (
    <button
      type="button"
      onClick={() => setPaletteOpen(true)}
      aria-haspopup="dialog"
      className="glass group flex h-14 w-full max-w-xl items-center gap-3 rounded-2xl px-4 text-left transition-[border-color,box-shadow] duration-200 hover:border-brand/50 hover:shadow-[0_0_0_1px_rgba(124,92,255,0.25),0_16px_48px_-16px_rgba(124,92,255,0.55)] sm:h-16 sm:px-5"
    >
      <Search className="size-5 shrink-0 text-fg-muted group-hover:text-fg" strokeWidth={1.75} aria-hidden />
      <span className="flex-1 truncate text-[0.9375rem] text-fg-muted sm:text-base">
        Search {count.toLocaleString("en-US")} games, apps and platforms
      </span>
      <kbd className="hidden rounded-lg border border-line-strong px-2 py-1 font-mono text-xs text-fg-subtle sm:inline-block">
        {mod}K
      </kbd>
    </button>
  );
}
