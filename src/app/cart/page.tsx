import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { CartPageView } from "@/components/cart/CartPageView";
import { getFeatured } from "@/lib/data";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review the offers in your cart before checkout.",
  alternates: { canonical: "/cart" },
  robots: { index: false },
};

export default function CartPage() {
  const suggestions = getFeatured()
    .slice(0, 4)
    .map(({ name, slug, category, initials }) => ({ name, slug, category, initials }));
  return (
    <div className="container-page pt-6 pb-16 sm:pt-8">
      <Breadcrumbs className="mb-5" items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-fg sm:text-4xl">Your cart</h1>
      <CartPageView suggestions={suggestions} />
    </div>
  );
}
