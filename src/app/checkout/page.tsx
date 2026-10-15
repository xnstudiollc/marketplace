import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Confirm delivery details and place your order.",
  alternates: { canonical: "/checkout" },
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-page pt-6 pb-16 sm:pt-8">
      <Breadcrumbs className="mb-5" items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-fg sm:text-4xl">Checkout</h1>
      <CheckoutView />
    </div>
  );
}
