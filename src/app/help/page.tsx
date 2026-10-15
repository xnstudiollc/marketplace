import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CreditCard, LifeBuoy, ShieldCheck, Store, Timer } from "lucide-react";
import { InfoSection, PageIntro } from "@/components/common/PageIntro";
import { FaqAccordion } from "@/components/home/Faq";
import { Button } from "@/components/ui/button";
import { LISTING_TYPE_META, LISTING_TYPE_ORDER } from "@/lib/categories";
import type { ListingTypeId } from "@/lib/types";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Help center",
  description: `How buyer protection, delivery, payments and selling work on ${SITE.name}.`,
  alternates: { canonical: "/help" },
};

const TOPICS = [
  { href: "#buyer-protection", label: "Buyer protection", text: "How your payment is held", icon: ShieldCheck },
  { href: "#delivery", label: "Delivery", text: "Typical times per offer type", icon: Timer },
  { href: "#payments", label: "Payments", text: "Methods and fees", icon: CreditCard },
  { href: "#sellers", label: "Selling", text: "Open a seller profile", icon: Store },
];

const DELIVERY: Record<ListingTypeId, string> = {
  accounts: "Usually under an hour. Login details arrive in the order chat, then you secure the account with the seller.",
  currency: "Often instant. Otherwise the seller trades or mails it to your character, usually within 30 minutes.",
  items: "Minutes to an hour, depending on when you are both online to trade.",
  services: "Hours to a few days. Boosts and coaching are scheduled with you and post progress updates.",
  keys: "Mostly instant. Codes and top-ups are posted in the order chat as soon as you pay.",
  other: "Agreed with the seller before you order.",
};

const PROTECTION_STEPS = [
  `You pay, and ${SITE.name} holds the money. The seller can see the order but not the payment.`,
  "The seller delivers in the order chat, by trade, mail, code or login.",
  "You confirm it arrived as listed, and the payment is released. Nothing arrives? Open a dispute and get a refund.",
];

const SELLER_STEPS = [
  "Create a profile and confirm your identity to earn the Verified badge.",
  "List offers for any game in the catalog, with your price, stock and delivery time.",
  "Deliver through the order chat and get paid when the buyer confirms.",
];

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="space-y-3">
      {items.map((step, i) => (
        <li key={step} className="flex gap-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-xs text-fg">
            {i + 1}
          </span>
          <span className="pt-0.5">{step}</span>
        </li>
      ))}
    </ol>
  );
}

export default function HelpPage() {
  return (
    <div className="container-page pb-16">
      <PageIntro
        eyebrow="Help center"
        title={`How ${SITE.name} works`}
        description="Everything about paying, receiving your order and selling, in one place. Can't find it here? Support is available around the clock."
      >
        <nav aria-label="Help topics" className="mt-8">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TOPICS.map(({ href, label, text, icon: Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  className="glass-subtle flex min-h-11 items-center gap-3 rounded-2xl p-4 transition-colors hover:border-line-strong"
                >
                  <Icon className="size-5 shrink-0 text-brand-2" strokeWidth={1.75} aria-hidden />
                  <span className="min-w-0">
                    <span className="block font-semibold text-fg">{label}</span>
                    <span className="block text-[0.8125rem] text-fg-subtle">{text}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageIntro>

      <div className="grid gap-6">
        <InfoSection id="buyer-protection" icon={<ShieldCheck className="size-5" />} title="Buyer protection">
          <p>Every order is covered. Your money only moves to the seller after you confirm delivery.</p>
          <Steps items={PROTECTION_STEPS} />
        </InfoSection>

        <InfoSection id="delivery" icon={<Timer className="size-5" />} title="Delivery times">
          <p>Each offer shows its own delivery time. Offers marked Instant are delivered automatically. As a guide:</p>
          <dl className="divide-y divide-line rounded-xl border border-line">
            {LISTING_TYPE_ORDER.map((t) => {
              const meta = LISTING_TYPE_META[t];
              return (
                <div key={t} className="grid gap-1 p-4 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-4">
                  <dt className="flex items-center gap-2 font-medium text-fg">
                    <meta.icon className="size-4" style={{ color: meta.accent }} strokeWidth={1.75} aria-hidden />
                    {meta.label}
                  </dt>
                  <dd>{DELIVERY[t]}</dd>
                </div>
              );
            })}
          </dl>
        </InfoSection>

        <InfoSection id="payments" icon={<CreditCard className="size-5" />} title="Payments and fees">
          <p>
            Checkout accepts cards, a wallet balance and crypto. A flat 4.5% service fee is shown in the cart before you pay and covers
            buyer protection, disputes and support.
          </p>
          <p className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-fg">
            This site is a design demo. No payment is processed, and card details never leave your browser.
          </p>
        </InfoSection>

        <InfoSection id="sellers" icon={<Store className="size-5" />} title="Become a seller">
          <p>Listing is free. A small commission applies to completed sales only.</p>
          <Steps items={SELLER_STEPS} />
          <p className="text-sm text-fg-subtle">Seller sign-up is not part of this demo.</p>
        </InfoSection>

        <section aria-labelledby="help-faq-title" className="scroll-mt-[calc(var(--header-h)+1.5rem)]" id="faq">
          <h2 id="help-faq-title" className="mb-4 flex items-center gap-3 text-xl font-bold tracking-tight text-fg sm:text-2xl">
            <LifeBuoy className="size-5 text-brand-2" aria-hidden /> Frequently asked
          </h2>
          <FaqAccordion />
        </section>

        <div className="flex flex-col items-center gap-3 pt-4 text-center">
          <p className="text-fg-muted">Ready to find something?</p>
          <Button asChild size="lg">
            <Link href="/browse">
              Browse all games <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
