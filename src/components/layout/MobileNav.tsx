"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/categories";
import { SITE } from "@/lib/site";
import { useUi } from "@/store/ui";
import { LogoMark } from "./Logo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse all games" },
  { href: "/cart", label: "Cart" },
  { href: "/help", label: "Help" },
  { href: "/about", label: "About" },
];

export function MobileNav() {
  const open = useUi((s) => s.mobileNavOpen);
  const setOpen = useUi((s) => s.setMobileNavOpen);
  const setPaletteOpen = useUi((s) => s.setPaletteOpen);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="glass-raised h-dvh w-[88vw] max-w-sm rounded-none rounded-r-[20px] border-y-0 border-l-0 p-0">
        <SheetHeader className="flex-row items-center gap-2.5 border-b border-line p-4">
          <LogoMark />
          <div>
            <SheetTitle className="text-base">{SITE.name}</SheetTitle>
            <SheetDescription className="sr-only">Site navigation</SheetDescription>
          </div>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="glass-subtle flex h-12 items-center gap-2.5 rounded-xl px-4 text-left text-fg-muted"
          >
            <Search className="size-[18px]" strokeWidth={1.75} />
            Search games…
          </button>
          <nav aria-label="Mobile" className="flex flex-col">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="flex h-12 items-center rounded-xl px-3 text-[1rem] font-medium text-fg hover:bg-surface-hover"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div>
            <p className="mb-2 px-3 text-[0.75rem] font-medium tracking-[0.06em] text-fg-subtle uppercase">Categories</p>
            <div className="flex flex-col">
              {CATEGORY_ORDER.map((id) => (
                <Link
                  key={id}
                  href={`/category/${id}`}
                  onClick={close}
                  className="flex h-11 items-center gap-3 rounded-xl px-3 text-fg-muted hover:bg-surface-hover hover:text-fg"
                >
                  <span className="size-2 rounded-full" style={{ background: CATEGORY_META[id].accent }} aria-hidden />
                  {CATEGORY_META[id].label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
