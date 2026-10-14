import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { SellerHeader } from "@/components/seller/SellerHeader";
import { SellerTabs } from "@/components/seller/SellerTabs";
import { getSellerCatalog } from "@/lib/data";
import { formatNumber, formatResponse } from "@/lib/format";
import { getSellerReviews, ratingDistribution } from "@/lib/mock/reviews";
import { SELLERS, getSeller } from "@/lib/mock/sellers";

export function generateStaticParams() {
  return SELLERS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/sellers/[id]">): Promise<Metadata> {
  const { id } = await params;
  const seller = getSeller(id);
  if (!seller) return {};
  const description = `${seller.handle} on Vaultline: rated ${seller.rating.toFixed(1)} from ${formatNumber(seller.reviewCount)} reviews, ${formatNumber(seller.completedOrders)} completed orders, replies in about ${formatResponse(seller.responseMinutes)}.`;
  return {
    title: `${seller.handle}, seller profile`,
    description,
    alternates: { canonical: `/sellers/${seller.id}` },
    openGraph: { title: `${seller.handle} on Vaultline`, description, url: `/sellers/${seller.id}` },
  };
}

export default async function SellerPage({ params }: PageProps<"/sellers/[id]">) {
  const { id } = await params;
  const seller = getSeller(id);
  if (!seller) notFound();
  const catalog = getSellerCatalog(seller.id);
  const reviews = getSellerReviews(
    seller,
    catalog.games.map((g) => g.name),
  );

  return (
    <div className="container-page pt-6 pb-16 sm:pt-8">
      <Breadcrumbs className="mb-5" items={[{ label: "Home", href: "/" }, { label: "Sellers" }, { label: seller.handle }]} />
      <SellerHeader seller={seller} games={catalog.games} />
      <div className="mt-10">
        <SellerTabs seller={seller} catalog={catalog} reviews={reviews} distribution={ratingDistribution(seller)} />
      </div>
    </div>
  );
}
