"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CartEmpty, CartLines, CartTotals } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { SearchEntry } from "@/lib/types";
import { cartTotals, useCart } from "@/store/cart";
import { useUi } from "@/store/ui";

export function CartDrawer({ suggestions }: { suggestions: SearchEntry[] }) {
  const open = useUi((s) => s.cartOpen);
  const setOpen = useUi((s) => s.setCartOpen);
  const items = useCart((s) => s.items);
  const { count } = cartTotals(items);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="glass-raised h-dvh w-full gap-0 rounded-none border-y-0 border-r-0 p-0 sm:max-w-md sm:rounded-l-[20px]"
      >
        <SheetHeader className="border-b border-line p-5">
          <SheetTitle className="text-[1.125rem]">Your cart</SheetTitle>
          <SheetDescription>{count === 0 ? "No items yet" : `${count} item${count === 1 ? "" : "s"}`}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto overscroll-contain p-5">
          {items.length === 0 ? (
            <CartEmpty suggestions={suggestions} onNavigate={close} />
          ) : (
            <CartLines items={items} onNavigate={close} />
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-line p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <CartTotals
              items={items}
              cta={
                <div className="grid grid-cols-[auto_1fr] gap-2">
                  <Button asChild variant="secondary">
                    <Link href="/cart" onClick={close}>
                      View cart
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/checkout" onClick={close}>
                      Checkout <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              }
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
