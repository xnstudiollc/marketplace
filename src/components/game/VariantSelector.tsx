"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function VariantSelector({
  variants,
  value,
  onChange,
}: {
  variants: string[];
  value: string | null;
  onChange: (variant: string | null) => void;
}) {
  const options: { id: string | null; label: string }[] = [{ id: null, label: "All" }, ...variants.map((v) => ({ id: v, label: v }))];
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span id="variant-label" className="text-[0.8125rem] font-medium text-fg-muted">
        Server / region
      </span>
      <div role="radiogroup" aria-labelledby="variant-label" className="glass-subtle inline-flex flex-wrap gap-1 rounded-xl p-1">
        {options.map((o) => {
          const selected = value === o.id;
          return (
            <button
              key={o.label}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(o.id)}
              className={cn(
                "relative min-h-9 min-w-12 rounded-lg px-3 text-[0.8125rem] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
                selected ? "text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {selected && (
                <motion.span
                  layoutId="variant-pill"
                  className="absolute inset-0 rounded-lg border border-brand/50 bg-brand/15"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
