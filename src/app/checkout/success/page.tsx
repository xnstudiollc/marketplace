import type { Metadata } from "next";
import { SuccessView } from "@/components/checkout/SuccessView";

export const metadata: Metadata = {
  title: "Order placed",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="container-page pt-10 pb-16 sm:pt-14">
      <SuccessView />
    </div>
  );
}
