"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatDelivery, formatPrice } from "@/lib/format";
import { LISTING_TYPE_META } from "@/lib/categories";
import { useCart, type CartItem } from "@/store/cart";

export function QuantityStepper({
  value,
  max,
  onChange,
  label,
}: {
  value: number;
  max: number;
  onChange: (next: number) => void;
  label: string;
}) {
  const limit = Math.min(99, max);
  return (
    <div className="glass-subtle inline-flex h-10 items-center rounded-xl p-0.5" role="group" aria-label={`Quantity for ${label}`}>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="size-4" />
      </Button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={limit}
        value={value}
        aria-label="Quantity"
        onChange={(e) => onChange(Number(e.target.value))}
        className="tabular w-10 [appearance:textfield] bg-transparent text-center font-medium text-fg outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Increase quantity"
        disabled={value >= limit}
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}

export function CartLine({ item, index }: { item: CartItem; index: number }) {
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const restore = useCart((s) => s.restore);
  const meta = LISTING_TYPE_META[item.type];

  const onRemove = () => {
    remove(item.id);
    toast("Removed from cart", {
      description: item.title,
      action: { label: "Undo", onClick: () => restore(item, index) },
    });
  };

  return (
    <div className="flex gap-3 py-4">
      <span
        className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl border border-line"
        style={{ background: `color-mix(in srgb, ${meta.accent} 14%, transparent)`, color: meta.accent }}
        aria-hidden
      >
        <meta.icon className="size-[18px]" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1 space-y-2">
        <div>
          <p className="line-clamp-2 font-medium text-fg" title={item.title}>
            {item.title}
          </p>
          <p className="text-[0.8125rem] text-fg-subtle">
            <Link href={`/games/${item.gameSlug}`} className="hover:text-fg">
              {item.gameName}
            </Link>{" "}
            · {meta.label} · {formatDelivery(item.deliveryMinutes)}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <QuantityStepper
            value={item.quantity}
            max={item.maxQuantity}
            label={item.title}
            onChange={(q) => setQuantity(item.id, q)}
          />
          <div className="flex items-center gap-1">
            <span className="tabular font-semibold text-fg">{formatPrice(item.unitPrice * item.quantity)}</span>
            <Button variant="ghost" size="icon-sm" aria-label={`Remove ${item.title}`} onClick={onRemove}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
