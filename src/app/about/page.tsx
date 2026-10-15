import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, FlaskConical, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { InfoSection, PageIntro } from "@/components/common/PageIntro";
import { Button } from "@/components/ui/button";
import { getSiteStats } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `What ${SITE.name} is, how it is built, and what is real in this demo.`,
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  { icon: Compass, title: "Find it fast", text: "Every game has its own page, with offers split by type and filters that stay out of the way." },
  { icon: ShieldCheck, title: "Pay with confidence", text: "Payment is held until you confirm delivery, and seller ratings only come from completed orders." },
  { icon: Gauge, title: "Calm, not loud", text: "A dark, focused interface that puts prices, delivery times and seller history first." },
];

export default function AboutPage() {
  const stats = getSiteStats();
  const facts = [
    { label: "Games", value: formatNumber(stats.games) },
    { label: "Categories", value: formatNumber(stats.categories) },
    { label: "Demo offers", value: formatNumber(stats.offers) },
    { label: "Instant offers", value: formatNumber(stats.instantOffers) },
  ];

  return (
    <div className="container-page pb-16">
      <PageIntro
        eyebrow={`About ${SITE.name}`}
        title="A calmer way to buy for the games you play"
        description={`${SITE.name} brings accounts, currency, items, boosting and keys for hundreds of games into one place, with the same protection on every order.`}
      >
        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="glass-subtle rounded-2xl px-4 py-3">
              <dt className="text-[0.8125rem] text-fg-subtle">{f.label}</dt>
              <dd className="tabular mt-0.5 text-2xl font-bold tracking-tight text-fg">{f.value}</dd>
            </div>
          ))}
        </dl>
      </PageIntro>

      <ul className="grid gap-4 md:grid-cols-3">
        {PRINCIPLES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="glass rounded-2xl p-5 sm:p-6">
            <Icon className="size-6 text-brand-2" strokeWidth={1.75} aria-hidden />
            <h2 className="mt-4 text-lg font-semibold text-fg">{title}</h2>
            <p className="mt-1.5 text-fg-muted">{text}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-6">
        <InfoSection id="demo" icon={<FlaskConical className="size-5" />} title="About this demo">
          <p>
            {SITE.name} is a front-end design demo. There is no backend: no accounts, no real sellers and no payments. Nothing you enter
            leaves your browser, and the cart lives in local storage.
          </p>
          <ul className="list-disc space-y-2 pl-5 marker:text-fg-subtle">
            <li>The game catalog comes from a fixed data file. Every game listed there has a page.</li>
            <li>
              Sellers, offers, prices, reviews and stats are generated from each game&apos;s name with a seeded random generator, so
              they are the same on every visit and every build.
            </li>
            <li>Game tiles are generated from initials and a color derived from the name. No logos or artwork are included.</li>
            <li>Game names belong to their respective owners. This demo is not affiliated with or endorsed by any publisher or platform.</li>
          </ul>
        </InfoSection>

        <InfoSection id="built" icon={<Sparkles className="size-5" />} title="How it is built">
          <p>
            Every page is generated ahead of time with Next.js, so the catalog, game pages and seller profiles load as static HTML. Only
            the interactive parts, such as filters, the cart and checkout, run in the browser.
          </p>
        </InfoSection>
      </div>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/browse">
            Browse all games <ArrowRight aria-hidden />
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href="/help">Visit the help center</Link>
        </Button>
      </div>
    </div>
  );
}
