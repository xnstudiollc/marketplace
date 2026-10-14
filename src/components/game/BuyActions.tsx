"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { QuantityStepper } from "@/components/cart/CartLine";
import { Button } from "@/components/ui/button";
import { QUANTITY_TYPES, toCartItem } from "@/lib/cart-item";
import type { Game, Listing } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useUi } from "@/store/ui";

export function BuyActions({
  listing,
  game,
  layout = "row",
  className,
}: {
  listing: Listing;
  game: Pick<Game, "name">;
  layout?: "row" | "stack";
  className?: string;
}) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const setCartOpen = useUi((s) => s.setCartOpen);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const withQuantity = QUANTITY_TYPES.includes(listing.type) && listing.stock > 1;
  const max = Math.min(99, listing.stock);

  useEffect(() => {
    if (!added) return;
    const id = window.setTimeout(() => setAdded(false), 1200);
    return () => window.clearTimeout(id);
  }, [added]);

  const addToCart = () => {
    add(toCartItem(listing, game), quantity);
    setAdded(true);
    toast.success("Added to cart", {
      description: quantity > 1 ? `${quantity} × ${listing.title}` : listing.title,
      action: { label: "View cart", onClick: () => setCartOpen(true) },
    });
  };

  const buyNow = () => {
    add(toCartItem(listing, game), quantity);
    router.push("/checkout");
  };

  return (
    <div
      className={cn(
        "relative z-10 flex gap-2",
        layout === "stack" ? "flex-col items-stretch" : "flex-wrap items-center justify-end",
        className,
      )}
    >
      {withQuantity && (
        <div className={layout === "stack" ? "flex items-center justify-between gap-3" : "contents"}>
          {layout === "stack" && <span className="text-sm text-fg-muted">Quantity</span>}
          <QuantityStepper value={quantity} max={max} onChange={(n) => setQuantity(Math.max(1, Math.min(max, n)))} label={listing.title} />
        </div>
      )}
      <div className={cn("flex gap-2", layout === "stack" ? "flex-col sm:flex-row" : "")}>
        <Button
          variant="secondary"
          onClick={addToCart}
          aria-label={added ? "Added to cart" : "Add to cart"}
          className={cn("relative min-w-11 overflow-hidden", layout === "stack" && "sm:flex-1")}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {added ? (
              <motion.span
                key="added"
                className="flex items-center gap-2 text-success"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              >
                <Check aria-hidden />
                <span className={layout === "row" ? "sr-only xl:not-sr-only" : undefined}>Added</span>
              </motion.span>
            ) : (
              <motion.span
                key="add"
                className="flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              >
                <ShoppingCart aria-hidden />
                <span className={layout === "row" ? "sr-only xl:not-sr-only" : undefined}>Add to cart</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
        <Button onClick={buyNow} className={cn(layout === "stack" && "sm:flex-1")}>
          Buy now
        </Button>
      </div>
    </div>
  );
}
