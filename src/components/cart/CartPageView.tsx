"use client";

import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CartEmpty, CartLines, CartTotals } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { pluralize } from "@/lib/format";
import type { SearchEntry } from "@/lib/types";
import { cartTotals, useCart, useCartHydrated } from "@/store/cart";

export function CartPageView({ suggestions }: { suggestions: SearchEntry[] }) {
  const hydrated = useCartHydrated();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const restore = useCart((s) => s.restore);
  const { count } = cartTotals(items);

  const onClear = () => {
    const snapshot = items;
    clear();
    toast("Cart cleared", {
      description: pluralize(snapshot.length, "offer") + " removed",
      action: { label: "Undo", onClick: () => snapshot.forEach((item, i) => restore(item, i)) },
    });
  };

  if (!hydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]" aria-busy="true" aria-label="Loading cart">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="glass rounded-3xl px-6">
        <CartEmpty suggestions={suggestions} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
      <section aria-labelledby="cart-items-title" className="min-w-0">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="cart-items-title" className="tabular text-sm text-fg-muted">
            <span className="font-semibold text-fg">{pluralize(count, "item")}</span> from{" "}
            {pluralize(new Set(items.map((i) => i.sellerId)).size, "seller")}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClear} className="text-fg-muted">
            <Trash2 className="size-4" /> Clear cart
          </Button>
        </div>
        <CartLines items={items} />
      </section>
      <aside aria-labelledby="cart-summary-title" className="glass rounded-2xl p-5 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
        <h2 id="cart-summary-title" className="mb-4 text-[1.125rem] font-semibold text-fg">
          Order summary
        </h2>
        <CartTotals
          items={items}
          cta={
            <Button asChild size="lg" className="w-full">
              <Link href="/checkout">
                Checkout <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />
      </aside>
    </div>
  );
}
