import type { Metadata } from "next";
import { BrowseClient } from "@/components/browse/BrowseClient";
import { getAllGames, getBrowseEntries } from "@/lib/data";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Browse all games",
  description: `Search and filter ${getAllGames().length} games by category, listing type and more.`,
  alternates: { canonical: "/browse" },
};

export default function BrowsePage() {
  const entries = getBrowseEntries();
  return (
    <div className="container-page pt-8 pb-16 sm:pt-12">
      <header className="mb-8 max-w-2xl">
        <p className="text-[0.6875rem] font-semibold tracking-[0.06em] text-brand-2 uppercase">Catalog</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-fg sm:text-4xl">Browse all games</h1>
        <p className="mt-3 text-fg-muted">
          {formatNumber(entries.length)} games across every category. Filter by what you want to buy, or search by name.
        </p>
      </header>
      <BrowseClient entries={entries} />
    </div>
  );
}
