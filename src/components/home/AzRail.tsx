"use client";

import { useEffect, useRef, useState } from "react";
import { azSectionId } from "@/lib/letters";
import { cn } from "@/lib/utils";

export function AzRail({ letters }: { letters: { letter: string; count: number }[] }) {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = letters
      .filter((l) => l.count > 0)
      .map((l) => document.getElementById(azSectionId(l.letter)))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.getAttribute("data-letter"));
      },
      { rootMargin: "-140px 0px -60% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [letters]);

  useEffect(() => {
    if (!active) return;
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-letter="${CSS.escape(active)}"]`);
    if (!list || !el || list.scrollWidth <= list.clientWidth) return;
    list.scrollLeft = el.offsetLeft - list.clientWidth / 2 + el.offsetWidth / 2;
  }, [active]);

  return (
    <nav
      aria-label="Jump to letter"
      className="sticky top-[var(--header-h)] z-30 -mx-4 mb-6 border-y border-line bg-bg/85 backdrop-blur-xl transition-[top] duration-200 sm:-mx-6 lg:mx-0 lg:rounded-2xl lg:border-x"
    >
      <ul ref={listRef} className="no-scrollbar flex gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:justify-between lg:px-2">
        {letters.map(({ letter, count }) => {
          const label = letter === "#" ? "Numbers and symbols" : letter;
          const base = "grid h-9 min-w-9 shrink-0 place-items-center rounded-lg px-1.5 text-[0.8125rem] font-semibold lg:min-w-8";
          return (
            <li key={letter} data-letter={letter}>
              {count > 0 ? (
                <a
                  href={`#${azSectionId(letter)}`}
                  aria-label={`${label}, ${count} games`}
                  aria-current={active === letter ? "location" : undefined}
                  className={cn(
                    base,
                    "transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
                    active === letter ? "bg-brand/18 text-fg ring-1 ring-brand/60" : "text-fg-muted hover:bg-surface-hover hover:text-fg",
                  )}
                >
                  {letter}
                </a>
              ) : (
                <span aria-disabled="true" aria-label={`${label}, no games`} className={cn(base, "text-fg-subtle/50")}>
                  {letter}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
