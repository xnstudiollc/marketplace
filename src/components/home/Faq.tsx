import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeader } from "@/components/common/SectionHeader";
import { LogoMark } from "@/components/layout/Logo";

const FAQ = [
  {
    q: "How does buyer protection work?",
    a: "Your payment is held until you confirm the order arrived as described. If a seller does not deliver, or the item is not what was listed, open a dispute from your order and the payment is returned.",
  },
  {
    q: "How fast is delivery?",
    a: "Each offer shows its delivery time. Offers marked Instant are delivered automatically, usually within a minute. Others are handed over by the seller, most within an hour.",
  },
  {
    q: "Which payment methods can I use?",
    a: "Cards and popular wallets are shown at checkout. This site is a design demo, so no real payment is ever taken and no card details leave your browser.",
  },
  {
    q: "What does the service fee cover?",
    a: "A flat 4.5% fee on each order pays for buyer protection, dispute handling and round-the-clock support. It is shown before you pay, never added later.",
  },
  {
    q: "How are sellers verified?",
    a: "Verified sellers have confirmed their identity and kept a high completion rate. Ratings and order counts only come from completed orders, so they cannot be bought.",
  },
  {
    q: "Can I sell on Vaultline?",
    a: "Yes. Create a seller profile, list what you have, and get paid once buyers confirm delivery. Listing is free; a small commission applies to completed sales.",
  },
];

export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="container-page section-y">
      <Reveal className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
        <SectionHeader
          id="faq-title"
          eyebrow="FAQ"
          title="Questions, answered"
          description="Short answers to what buyers ask most. The help center has the details."
          action={
            <Button asChild variant="secondary" size="sm">
              <Link href="/help">
                Visit the help center
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          }
          className="flex-col items-start justify-start self-start lg:mb-0"
        />
        <Accordion type="single" collapsible className="glass rounded-2xl px-5 sm:px-6">
          {FAQ.map(({ q, a }, i) => (
            <AccordionItem key={q} value={`faq-${i}`} className="border-line last:border-b-0">
              <AccordionTrigger className="min-h-14 py-4 text-left text-[0.9375rem] font-semibold text-fg hover:no-underline">
                {q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-fg-muted">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}

export function CtaBand() {
  return (
    <section aria-labelledby="cta-title" className="container-page section-y pt-0">
      <Reveal>
        <div className="glass relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_20%_0%,rgba(124,92,255,0.28),transparent),radial-gradient(50%_70%_at_90%_100%,rgba(34,211,238,0.18),transparent)]"
          />
          <LogoMark className="mx-auto size-12" />
          <h2 id="cta-title" className="text-gradient mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Your next upgrade is a search away
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-fg-muted">
            Browse every game, compare sellers side by side, and check out with protection on every order.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/browse">Browse all games</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/help#sellers">Start selling</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
