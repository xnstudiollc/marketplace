"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown, Menu, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { cartTotals, useCart } from "@/store/cart";
import { useModKey } from "@/hooks/use-mod-key";
import { useUi } from "@/store/ui";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const setPaletteOpen = useUi((s) => s.setPaletteOpen);
  const mod = useModKey();
  const setCartOpen = useUi((s) => s.setCartOpen);
  const setMobileNavOpen = useUi((s) => s.setMobileNavOpen);
  const count = useCart((s) => cartTotals(s.items).count);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--header-h", scrolled ? "60px" : "72px");
  }, [scrolled]);

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        "sticky top-0 z-40 border-b transition-[height,background-color,border-color] duration-300 ease-out-expo",
        "bg-bg/60 backdrop-blur-xl backdrop-saturate-150",
        scrolled ? "h-[60px] border-line-strong bg-bg/80" : "h-[72px] border-transparent",
      )}
    >
      <div className="container-page flex h-full items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="-ml-2 md:hidden"
          aria-label="Open menu"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu className="size-5" />
        </Button>

        <Logo className="mr-2" />

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          <Button asChild variant="ghost">
            <Link href="/browse">Browse</Link>
          </Button>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                Categories <ChevronDown className="size-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="glass-raised w-64 p-1.5">
              {CATEGORY_ORDER.map((id) => {
                const meta = CATEGORY_META[id];
                return (
                  <DropdownMenuItem key={id} asChild className="rounded-lg px-3 py-2.5">
                    <Link href={`/category/${id}`}>
                      <span className="size-2 rounded-full" style={{ background: meta.accent }} aria-hidden />
                      {meta.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild variant="ghost">
            <Link href="/help">Help</Link>
          </Button>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="glass-subtle hidden h-11 w-64 items-center gap-2.5 rounded-xl px-3.5 text-left text-fg-muted transition-colors hover:border-line-strong hover:text-fg lg:flex"
          >
            <Search className="size-[18px]" strokeWidth={1.75} />
            <span className="flex-1 text-[0.875rem]">Search games…</span>
            <kbd className="rounded-md border border-line-strong px-1.5 py-0.5 font-mono text-[0.6875rem] text-fg-subtle">
              {mod}K
            </kbd>
          </button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Search games"
                onClick={() => setPaletteOpen(true)}
              >
                <Search className="size-5" strokeWidth={1.75} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search ({mod}K)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="relative"
                aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="size-5" strokeWidth={1.75} />
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={reduceMotion ? false : { scale: 0.4 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 520, damping: 18 }}
                    className="tabular absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[0.6875rem] font-semibold text-white shadow-[0_0_0_2px_var(--bg)]"
                  >
                    {count > 99 ? "99+" : count}
                  </motion.span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Cart</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <MobileNav />
    </header>
  );
}
