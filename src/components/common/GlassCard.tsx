import type { CSSProperties, ComponentProps } from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

type Variant = "default" | "subtle" | "raised" | "interactive";

const VARIANT_CLASS: Record<Variant, string> = {
  default: "glass",
  subtle: "glass-subtle",
  raised: "glass-raised",
  interactive: "glass glow-card",
};

export interface GlassCardProps extends ComponentProps<"div"> {
  variant?: Variant;
  accent?: string;
  asChild?: boolean;
}

export function GlassCard({ variant = "default", accent, asChild, className, style, ...props }: GlassCardProps) {
  const Comp = asChild ? Slot.Root : "div";
  const mergedStyle = accent ? ({ ...style, "--card-accent": accent } as CSSProperties) : style;
  return <Comp className={cn(VARIANT_CLASS[variant], className)} style={mergedStyle} {...props} />;
}
