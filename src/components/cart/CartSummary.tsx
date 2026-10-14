"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import { GameImage } from "@/components/game/GameImage";
import { Button } from "@/components/ui/button";
import { formatPrice, pluralize } from "@/lib/format";
import { getSeller } from "@/lib/mock/sellers";
import type { SearchEntry } from "@/lib/types";
import { cartTotals, SERVICE_FEE_RATE, type CartItem } from "@/store/cart";
import { CartLine } from "./CartLine";

export function groupBySeller(items: CartItem[]) {
  const groups = new Map<string, { sellerId: string; sellerHandle: string; items: { item: CartItem; index: number }[] }>();
  items.forEach((item, index) => {
    const group = groups.get(item.sellerId) ?? { sellerId: item.sellerId, sellerHandle: item.sellerHandle, items: [] };
    group.items.push({ item, index });
    groups.set(item.sellerId, group);
  });
  return [...groups.values()];
}

export function CartLines({ items, onNavigate }: { items: CartItem[]; onNavigate?: () => void }) {
  const reduce = useReducedMotion();
  return (
    <div className="space-y-4">
      {groupBySeller(items).map((group) => (
        <section key={group.sellerId} aria-label={`Items from ${group.sellerHandle}`} className="glass-subtle px-4">
          <div className="flex items-center justify-between border-b border-line py-3">
            <Link
              href={`/sellers/${group.sellerId}`}
              onClick={onNavigate}
              className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-fg hover:text-brand-2"
            >
              {group.sellerHandle}
              {getSeller(group.sellerId)?.verified && <BadgeCheck className="size-4 text-brand-2" aria-label="Verified seller" />}
            </Link>
            <span className="text-[0.75rem] text-fg-subtle">{pluralize(group.items.length, "item")}</span>
          </div>
          <div className="divide-y divide-line">
            <AnimatePresence initial={false}>
              {group.items.map(({ item, index }) => (
                <motion.div
                  key={item.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <CartLine item={item} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      ))}
    </div>
  );
}

export function CartTotals({ items, cta }: { items: CartItem[]; cta?: React.ReactNode }) {
  const { subtotal, fee, total } = cartTotals(items);
  return (
    <div className="space-y-3">
      <dl className="space-y-2 text-[0.875rem]">
        <div className="flex justify-between text-fg-muted">
          <dt>Subtotal</dt>
          <dd>
            <AnimatedNumber value={formatPrice(subtotal)} />
          </dd>
        </div>
        <div className="flex justify-between text-fg-muted">
          <dt>Service fee ({(SERVICE_FEE_RATE * 100).toFixed(1)}%)</dt>
          <dd>
            <AnimatedNumber value={formatPrice(fee)} />
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-line pt-3 text-fg">
          <dt className="font-medium">Total</dt>
          <dd className="text-[1.25rem] font-semibold">
            <AnimatedNumber value={formatPrice(total)} />
          </dd>
        </div>
      </dl>
      {cta}
      <p className="flex items-center gap-2 text-[0.75rem] text-fg-subtle">
        <ShieldCheck className="size-4 text-success" aria-hidden /> Buyer protection on every order. Demo only.
      </p>
    </div>
  );
}

export function CartEmpty({ suggestions, onNavigate }: { suggestions: SearchEntry[]; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 py-10 text-center">
      <div className="flex -space-x-3" aria-hidden>
        {suggestions.slice(0, 3).map((g) => (
          <GameImage key={g.slug} game={g} size="md" className="ring-4 ring-bg" />
        ))}
      </div>
      <div>
        <p className="text-[1.125rem] font-semibold text-fg">Your cart is empty</p>
        <p className="text-fg-muted">Find something for your next session.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((g) => (
          <Button key={g.slug} asChild variant="secondary" size="sm">
            <Link href={`/games/${g.slug}`} onClick={onNavigate}>
              {g.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
