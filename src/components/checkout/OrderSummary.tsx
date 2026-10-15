import { LISTING_TYPE_META } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import type { CartItem } from "@/store/cart";

export function OrderItems({ items }: { items: CartItem[] }) {
  return (
    <ul className="divide-y divide-line">
      {items.map((item) => {
        const meta = LISTING_TYPE_META[item.type];
        return (
          <li key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
            <span
              aria-hidden
              className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg border border-line"
              style={{ background: `color-mix(in srgb, ${meta.accent} 14%, transparent)`, color: meta.accent }}
            >
              <meta.icon className="size-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1 text-[0.8125rem]">
              <p className="line-clamp-2 font-medium text-fg" title={item.title}>
                {item.title}
              </p>
              <p className="text-fg-subtle">
                {item.gameName} · {item.sellerHandle}
                {item.quantity > 1 && <> · ×{item.quantity}</>}
              </p>
            </div>
            <span className="tabular shrink-0 text-[0.875rem] font-medium text-fg">{formatPrice(item.unitPrice * item.quantity)}</span>
          </li>
        );
      })}
    </ul>
  );
}
