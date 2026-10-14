import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8", className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-[0.6875rem] font-semibold tracking-[0.06em] text-brand-2 uppercase">{eyebrow}</p>
        )}
        <h2 id={id} className="text-2xl font-bold tracking-tight text-fg sm:text-[1.75rem]">
          {title}
        </h2>
        {description && <p className="mt-2 text-fg-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
