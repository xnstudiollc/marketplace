import Link from "next/link";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8", className)}>
      <defs>
        <linearGradient id="vl-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b6dff" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path
        d="M16 2.5 27.7 9.25v13.5L16 29.5 4.3 22.75V9.25z"
        fill="rgba(124,92,255,0.12)"
        stroke="url(#vl-mark)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="6.2" fill="none" stroke="url(#vl-mark)" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="1.7" fill="url(#vl-mark)" />
      <path d="M16 9.8v2.4M16 19.8v2.4M9.8 16h2.4M19.8 16h2.4" stroke="url(#vl-mark)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 rounded-lg", className)} aria-label={`${SITE.name} home`}>
      <LogoMark />
      <span className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-fg">{SITE.name}</span>
    </Link>
  );
}
