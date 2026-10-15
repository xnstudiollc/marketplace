"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";
import { useRecent } from "@/store/recent";
import { useUi } from "@/store/ui";

/** App-wide side effects: store rehydration, the glow pointer tracker, and the Cmd/Ctrl+K shortcut. */
export function ClientEffects() {
  useEffect(() => {
    void useCart.persist.rehydrate();
    void useRecent.persist.rehydrate();
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let target: HTMLElement | null = null;
    let x = 0;
    let y = 0;

    const onMove = (event: PointerEvent) => {
      if (!fine.matches || reduced.matches) return;
      const el = (event.target as Element | null)?.closest<HTMLElement>(".glow-card");
      if (!el) return;
      target = el;
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!target) return;
        const rect = target.getBoundingClientRect();
        target.style.setProperty("--mx", `${x - rect.left}px`);
        target.style.setProperty("--my", `${y - rect.top}px`);
      });
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        const { paletteOpen, setPaletteOpen } = useUi.getState();
        setPaletteOpen(!paletteOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}
