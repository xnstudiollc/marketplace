"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Info, ShoppingCart } from "lucide-react";
import { CartTotals } from "@/components/cart/CartSummary";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderItems } from "@/components/checkout/OrderSummary";
import { EmptyState } from "@/components/common/EmptyState";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ORDER_KEY, type Order } from "@/lib/checkout";
import { formatPrice, pluralize } from "@/lib/format";
import { cartTotals, useCart, useCartHydrated, type CartItem } from "@/store/cart";

export function CheckoutView() {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const cartItems = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [placedItems, setPlacedItems] = useState<CartItem[] | null>(null);
  const items = placedItems ?? cartItems;
  const { count, total } = cartTotals(items);

  const onPlaced = (order: Order) => {
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
    setPlacedItems(order.items);
    clear();
    router.push("/checkout/success");
  };

  return (
    <>
      <p role="note" className="mb-6 flex items-start gap-2.5 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-fg">
        <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
        <span>
          <strong className="font-semibold">Demo only. No payment is processed.</strong> Use any email and the test card 4242 4242 4242 4242.
        </span>
      </p>

      {!hydrated ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]" aria-busy="true" aria-label="Loading checkout">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Add an offer from any game page, then come back here to check out."
          action={
            <Button asChild>
              <Link href="/browse">Browse games</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
          <div className="glass rounded-2xl px-5 lg:hidden">
            <Accordion type="single" collapsible>
              <AccordionItem value="summary" className="border-0">
                <AccordionTrigger className="py-4 hover:no-underline">
                  <span className="flex flex-1 items-center justify-between gap-3 pr-3">
                    <span className="flex items-center gap-2 text-fg">
                      <ShoppingCart className="size-4 text-fg-muted" aria-hidden />
                      Order summary <span className="font-normal text-fg-subtle">({pluralize(count, "item")})</span>
                    </span>
                    <span className="tabular font-semibold text-fg">{formatPrice(total)}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-5">
                  <OrderItems items={items} />
                  <div className="border-t border-line pt-4">
                    <CartTotals items={items} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <CheckoutForm items={items} onPlaced={onPlaced} />

          <aside
            aria-labelledby="checkout-summary-title"
            className="glass hidden rounded-2xl p-5 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:block"
          >
            <div className="mb-4 flex items-baseline justify-between">
              <h2 id="checkout-summary-title" className="text-[1.125rem] font-semibold text-fg">
                Order summary
              </h2>
              <Link href="/cart" className="text-[0.8125rem] font-medium text-brand-2 hover:underline">
                Edit cart
              </Link>
            </div>
            <OrderItems items={items} />
            <div className="mt-4 border-t border-line pt-4">
              <CartTotals items={items} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
