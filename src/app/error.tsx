"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="container-page flex flex-col items-center py-20 text-center sm:py-28">
      <p className="text-[0.6875rem] font-semibold tracking-[0.06em] text-danger uppercase">Something went wrong</p>
      <h1 className="mt-3 max-w-xl text-3xl font-bold tracking-tight text-balance text-fg sm:text-4xl">This page hit a snag</h1>
      <p className="mt-3 max-w-md text-fg-muted">Try again, or head back to browsing. Your cart is saved on this device.</p>
      {error.digest && <p className="mt-2 font-mono text-xs text-fg-subtle">Reference {error.digest}</p>}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={() => retry()}>
          <RotateCcw aria-hidden /> Try again
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href="/browse">Browse games</Link>
        </Button>
      </div>
    </div>
  );
}
