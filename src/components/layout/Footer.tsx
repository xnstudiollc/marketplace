import Link from "next/link";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/categories";
import { SITE } from "@/lib/site";
import { BackToTop } from "./BackToTop";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Marketplace",
    links: [
      { href: "/browse", label: "All games" },
      { href: "/browse?type=currency", label: "Currency" },
      { href: "/browse?type=accounts", label: "Accounts" },
      { href: "/browse?type=services", label: "Boosting & services" },
    ],
  },
  {
    title: "Categories",
    links: CATEGORY_ORDER.slice(0, 4).map((id) => ({ href: `/category/${id}`, label: CATEGORY_META[id].label })),
  },
  {
    title: "Support",
    links: [
      { href: "/help", label: "Help center" },
      { href: "/help#buyer-protection", label: "Buyer protection" },
      { href: "/help#delivery", label: "Delivery times" },
      { href: "/cart", label: "Your cart" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/about#demo", label: "About this demo" },
      { href: "/help#sellers", label: "Become a seller" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-bg-elevated/60">
      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1.2fr_2fr]">
        <div className="max-w-sm space-y-5">
          <Logo />
          <p className="text-fg-muted">{SITE.description}</p>
          <NewsletterForm />
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="mb-3 text-[0.8125rem] font-semibold tracking-[0.06em] text-fg uppercase">{col.title}</h2>
              <ul className="space-y-1">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-9 items-center text-fg-muted transition-colors hover:text-fg"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-3 py-6 text-[0.8125rem] text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-[0.6875rem] font-semibold tracking-[0.06em] text-warning uppercase">
              Demo data
            </span>
            {SITE.name} is a design demo. Listings, sellers and prices are generated. No payments are processed.
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
