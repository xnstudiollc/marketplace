import { getSellerOrThrow } from "./mock/sellers";
import type { Game, Listing, ListingTypeId } from "./types";
import type { CartItem } from "@/store/cart";

const NEEDS_DETAILS: ListingTypeId[] = ["currency", "items", "services"];

/** Listing types where buyers pick how many lots or codes they want. */
export const QUANTITY_TYPES: ListingTypeId[] = ["currency", "keys"];

export function toCartItem(listing: Listing, game: Pick<Game, "name">): Omit<CartItem, "quantity"> {
  const seller = getSellerOrThrow(listing.sellerId);
  return {
    id: listing.id,
    gameSlug: listing.gameSlug,
    gameName: game.name,
    sellerId: seller.id,
    sellerHandle: seller.handle,
    title: listing.title,
    type: listing.type,
    unitPrice: listing.price,
    maxQuantity: Math.min(99, listing.stock),
    deliveryMinutes: listing.deliveryMinutes,
    needsDeliveryDetails: NEEDS_DETAILS.includes(listing.type),
  };
}
