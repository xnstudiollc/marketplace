"use client";

import { LETTERS } from "@/lib/letters";
import { cn } from "@/lib/utils";

export function LetterBar({
  counts,
  active,
  onSelect,
}: {
  counts: Record<string, number>;
  active: string | null;
  onSelect: (letter: string | null) => void;
}) {
  const base =
    "grid h-9 min-w-9 shrink-0 place-items-center rounded-lg px-2 text-[0.8125rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-30";
  return (
    <nav aria-label="Filter by first letter" className="-mx-4 sm:mx-0">
      <ul className="no-scrollbar flex gap-1 overflow-x-auto px-4 py-1 sm:flex-wrap sm:px-0">
        <li>
          <button
            type="button"
            aria-pressed={active === null}
            onClick={() => onSelect(null)}
            className={cn(base, active === null ? "bg-brand/15 text-fg ring-1 ring-brand/60" : "text-fg-muted hover:bg-surface-hover hover:text-fg")}
          >
            All
          </button>
        </li>
        {LETTERS.map((letter) => {
          const count = counts[letter] ?? 0;
          const selected = active === letter;
          return (
            <li key={letter}>
              <button
                type="button"
                aria-pressed={selected}
                aria-label={`${letter === "#" ? "Numbers and symbols" : letter}, ${count} ${count === 1 ? "game" : "games"}`}
                disabled={count === 0 && !selected}
                onClick={() => onSelect(selected ? null : letter)}
                className={cn(base, selected ? "bg-brand/15 text-fg ring-1 ring-brand/60" : "text-fg-muted hover:bg-surface-hover hover:text-fg")}
              >
                {letter}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
