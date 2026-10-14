import type { CSSProperties, ComponentProps, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChipProps extends Omit<ComponentProps<"button">, "children"> {
  selected?: boolean;
  accent?: string;
  icon?: ReactNode;
  children: ReactNode;
}

/** Pill toggle. Selected state uses border, fill and a check icon so color is never the only signal. */
export function Chip({ selected = false, accent = "#7C5CFF", icon, className, style, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[0.8125rem] font-medium whitespace-nowrap transition-colors duration-150",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-40",
        selected
          ? "border-[var(--chip-accent)] bg-[color-mix(in_srgb,var(--chip-accent)_12%,transparent)] text-fg"
          : "glass-subtle text-fg-muted hover:border-line-strong hover:text-fg",
        className,
      )}
      style={{ ...style, "--chip-accent": accent } as CSSProperties}
      {...props}
    >
      {selected ? <Check className="size-3.5" aria-hidden /> : icon}
      {children}
    </button>
  );
}
