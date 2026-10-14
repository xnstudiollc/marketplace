import type { Metadata } from "next";
import { AzBrowser } from "@/components/home/AzBrowser";
import { CategoryRow } from "@/components/home/CategoryRow";
import { CtaBand, Faq } from "@/components/home/Faq";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { SellerSpotlight } from "@/components/home/SellerSpotlight";
import { TrendingRail } from "@/components/home/TrendingRail";
import { TypeTiles } from "@/components/home/TypeTiles";
import {
  getBrowseEntries,
  getCategoryCounts,
  getFeatured,
  getListingTypeCounts,
  getSiteStats,
  groupAlphabetically,
} from "@/lib/data";
import { getSpotlightSellers } from "@/lib/mock/sellers";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE.name} | ${SITE.tagline}` },
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const featured = getFeatured();
  return (
    <>
      <Hero stats={getSiteStats()} marquee={featured.slice(0, 12)} />
      <CategoryRow counts={getCategoryCounts()} />
      <FeaturedGrid games={getBrowseEntries(featured.slice(0, 12))} />
      <TypeTiles counts={getListingTypeCounts()} />
      <TrendingRail />
      <HowItWorks />
      <AzBrowser groups={groupAlphabetically()} popular={featured.map((g) => g.slug)} />
      <SellerSpotlight sellers={getSpotlightSellers(4)} />
      <Faq />
      <CtaBand />
    </>
  );
}
