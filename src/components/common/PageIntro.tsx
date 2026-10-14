import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageIntro({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("relative isolate py-10 sm:py-14", className)}>
      <div
        aria-hidden
        className="absolute -top-10 left-1/2 -z-10 h-56 w-[min(720px,90vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.22),transparent)] blur-2xl"
      />
      <p className="text-[0.6875rem] font-semibold tracking-[0.06em] text-brand-2 uppercase">{eyebrow}</p>
      <h1 className="text-gradient mt-3 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-[1.0625rem] text-fg-muted">{description}</p>
      {children}
    </header>
  );
}

export function InfoSection({
  id,
  icon,
  title,
  children,
  className,
}: {
  id: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("glass scroll-mt-[calc(var(--header-h)+1.5rem)] rounded-2xl p-5 sm:p-8", className)}
    >
      <h2 id={`${id}-title`} className="flex items-center gap-3 text-xl font-bold tracking-tight text-fg sm:text-2xl">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.04] text-brand-2" aria-hidden>
          {icon}
        </span>
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-fg-muted">{children}</div>
    </section>
  );
}
