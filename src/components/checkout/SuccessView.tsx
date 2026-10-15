"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { MessageSquareText, ShieldCheck } from "lucide-react";
import { CartTotals } from "@/components/cart/CartSummary";
import { OrderItems } from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ORDER_KEY, type Order } from "@/lib/checkout";

const noopSubscribe = () => () => {};
const readRaw = () => sessionStorage.getItem(ORDER_KEY);
const serverRaw = () => undefined;

function parse(raw: string): Order | null {
  try {
    return JSON.parse(raw) as Order;
  } catch {
    return null;
  }
}

const PAYMENT_LABEL: Record<Order["payment"], string> = { card: "Card", wallet: "Wallet balance", crypto: "Crypto" };

function AnimatedCheck() {
  return (
    <div className="relative mx-auto size-20">
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full bg-success/15 ring-1 ring-success/40"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      />
      <svg viewBox="0 0 52 52" className="relative size-20 text-success" aria-hidden>
        <motion.path
          d="M15 27 l8 8 l15 -17"
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  );
}

export function SuccessView() {
  const router = useRouter();
  const raw = useSyncExternalStore(noopSubscribe, readRaw, serverRaw);
  const order = useMemo(() => (raw ? parse(raw) : null), [raw]);

  useEffect(() => {
    if (raw !== undefined && !order) router.replace("/");
  }, [raw, order, router]);

  if (!order) {
    return (
      <div className="mx-auto max-w-xl space-y-4" aria-busy="true" aria-label="Loading order">
        <Skeleton className="mx-auto size-20 rounded-full" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="text-center">
        <AnimatedCheck />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-fg sm:text-4xl">Order placed</h1>
        <p className="mt-2 text-fg-muted">
          Thanks! A receipt is on its way to <span className="text-fg">{order.email}</span>.
        </p>
        <p className="mt-5 inline-flex flex-wrap items-center justify-center gap-2 rounded-xl border border-line bg-white/[0.03] px-4 py-2.5 text-sm text-fg-muted">
          Order number
          <span className="font-mono text-base font-semibold tracking-wider text-fg">{order.id}</span>
        </p>
      </div>

      <section aria-labelledby="success-items" className="glass mt-8 rounded-2xl p-5 sm:p-6">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 id="success-items" className="text-[1.0625rem] font-semibold text-fg">
            Summary
          </h2>
          <span className="text-[0.8125rem] text-fg-subtle">Paid with {PAYMENT_LABEL[order.payment]} (demo)</span>
        </div>
        <OrderItems items={order.items} />
        <div className="mt-4 border-t border-line pt-4">
          <CartTotals items={order.items} />
        </div>
      </section>

      <ul className="mt-6 space-y-3 text-sm text-fg-muted">
        <li className="flex gap-3">
          <MessageSquareText className="mt-0.5 size-4 shrink-0 text-brand-2" aria-hidden />
          Each seller opens an order chat to arrange delivery. Instant offers are delivered there right away.
        </li>
        <li className="flex gap-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
          Payment stays on hold until you confirm each delivery.
        </li>
      </ul>

      <div className="mt-8 flex justify-center">
        <Button asChild size="lg">
          <Link href="/browse">Back to browsing</Link>
        </Button>
      </div>
    </div>
  );
}
