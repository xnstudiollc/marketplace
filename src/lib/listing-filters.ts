import { getSellerOrThrow } from "./mock/sellers";
import type { Listing } from "./types";

export type ListingSort = "recommended" | "price-asc" | "price-desc" | "rating" | "fastest";
export type DeliveryFilter = "any" | "instant" | "hour";

export const LISTING_SORTS: { id: ListingSort; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Seller rating" },
  { id: "fastest", label: "Fastest delivery" },
];

export const DELIVERY_OPTIONS: { id: DeliveryFilter; label: string }[] = [
  { id: "any", label: "Any time" },
  { id: "hour", label: "Under 1 hour" },
  { id: "instant", label: "Instant" },
];

export const RATING_OPTIONS = [
  { id: 0, label: "Any rating" },
  { id: 4, label: "4.0+" },
  { id: 4.5, label: "4.5+" },
] as const;

export type RatingFilter = (typeof RATING_OPTIONS)[number]["id"];

export interface ListingFilterState {
  price: [number, number] | null;
  delivery: DeliveryFilter;
  rating: RatingFilter;
  online: boolean;
  labels: string[];
  experiences: string[];
  sort: ListingSort;
}

export const DEFAULT_FILTERS: ListingFilterState = {
  price: null,
  delivery: "any",
  rating: 0,
  online: false,
  labels: [],
  experiences: [],
  sort: "recommended",
};

export const LISTING_PAGE_SIZE = 12;

export function activeListingFilterCount(f: ListingFilterState): number {
  return (
    (f.price ? 1 : 0) +
    (f.delivery !== "any" ? 1 : 0) +
    (f.rating ? 1 : 0) +
    (f.online ? 1 : 0) +
    f.labels.length +
    f.experiences.length
  );
}

export function priceBounds(listings: Listing[]): [number, number] {
  if (!listings.length) return [0, 0];
  let min = Infinity;
  let max = 0;
  for (const l of listings) {
    min = Math.min(min, l.price);
    max = Math.max(max, l.price);
  }
  return [Math.floor(min), Math.ceil(max)];
}

function recommendedScore(listing: Listing): number {
  const seller = getSellerOrThrow(listing.sellerId);
  return (
    seller.rating * 2 +
    (seller.topSeller ? 0.5 : 0) +
    (seller.online ? 0.2 : 0) +
    (listing.deliveryMinutes === 0 ? 0.5 : 0) +
    (listing.originalPrice ? 0.4 : 0)
  );
}

export function applyListingFilters(listings: Listing[], f: ListingFilterState): Listing[] {
  const out = listings.filter((l) => {
    const seller = getSellerOrThrow(l.sellerId);
    if (f.price && (l.price < f.price[0] || l.price > f.price[1])) return false;
    if (f.delivery === "instant" && l.deliveryMinutes !== 0) return false;
    if (f.delivery === "hour" && l.deliveryMinutes >= 60) return false;
    if (f.rating && seller.rating < f.rating) return false;
    if (f.online && !seller.online) return false;
    if (f.labels.length && !f.labels.includes(l.labelName)) return false;
    if (f.experiences.length && (!l.experience || !f.experiences.includes(l.experience))) return false;
    return true;
  });

  const byOrder = (a: Listing, b: Listing) => a.createdOrder - b.createdOrder;
  switch (f.sort) {
    case "price-asc":
      return out.sort((a, b) => a.price - b.price || byOrder(a, b));
    case "price-desc":
      return out.sort((a, b) => b.price - a.price || byOrder(a, b));
    case "rating":
      return out.sort((a, b) => getSellerOrThrow(b.sellerId).rating - getSellerOrThrow(a.sellerId).rating || byOrder(a, b));
    case "fastest":
      return out.sort((a, b) => a.deliveryMinutes - b.deliveryMinutes || a.price - b.price || byOrder(a, b));
    default:
      return out.sort((a, b) => recommendedScore(b) - recommendedScore(a) || byOrder(a, b));
  }
}

export function discountPercent(listing: Pick<Listing, "price" | "originalPrice">): number | null {
  if (!listing.originalPrice) return null;
  return Math.round((1 - listing.price / listing.originalPrice) * 100);
}
