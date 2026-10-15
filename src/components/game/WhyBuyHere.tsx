import Link from "next/link";
import { Headphones, ShieldCheck, Zap } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export function WhyBuyHere({ instantOffers, className }: { instantOffers: number; className?: string }) {
  const points = [
    {
      icon: ShieldCheck,
      title: "Buyer protection",
      text: "Payment is held until you confirm delivery. Full refund if an order is not delivered.",
      href: "/help#buyer-protection",
    },
    {
      icon: Zap,
      title: "Instant delivery",
      text: `${formatNumber(instantOffers)} offers on this page deliver automatically, usually within a minute.`,
      href: "/help#delivery",
    },
    {
      icon: Headphones,
      title: "Support around the clock",
      text: "Real people answer order questions day and night, in several languages.",
      href: "/help",
    },
  ];
  return (
    <aside aria-labelledby="why-title" className={cn("glass rounded-2xl p-5", className)}>
      <h2 id="why-title" className="text-[1.125rem] font-semibold text-fg">
        Why buy here
      </h2>
      <ul className="mt-4 space-y-4">
        {points.map(({ icon: Icon, title, text, href }) => (
          <li key={title} className="flex gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-success/10 text-success">
              <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="text-sm">
              <Link href={href} className="font-semibold text-fg hover:text-brand-2 hover:underline">
                {title}
              </Link>
              <p className="mt-0.5 text-fg-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
