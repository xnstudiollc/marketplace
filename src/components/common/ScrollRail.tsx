"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Horizontal snap-scrolling list with previous/next buttons on pointer devices. */
export function ScrollRail({ children, label, className }: { children: ReactNode; label: string; className?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure]);

  const scroll = (direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <ul
        ref={ref}
        aria-label={label}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pt-1 pb-3 sm:-mx-6 sm:scroll-px-6 sm:gap-4 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8"
      >
        {children}
      </ul>
      <div className="pointer-events-none absolute -top-16 right-0 hidden gap-2 [@media(hover:hover)]:sm:flex">
        <Button
          variant="secondary"
          size="icon-sm"
          className="pointer-events-auto"
          aria-label="Scroll back"
          disabled={edges.start}
          onClick={() => scroll(-1)}
        >
          <ChevronLeft aria-hidden />
        </Button>
        <Button
          variant="secondary"
          size="icon-sm"
          className="pointer-events-auto"
          aria-label="Scroll forward"
          disabled={edges.end}
          onClick={() => scroll(1)}
        >
          <ChevronRight aria-hidden />
        </Button>
      </div>
    </div>
  );
}
