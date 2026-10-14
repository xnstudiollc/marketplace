export type CategoryId =
  | "pc-console"
  | "online-mmo"
  | "mobile"
  | "ai-software"
  | "platforms-gift-cards"
  | "social-streaming";

export type ListingTypeId = "accounts" | "currency" | "items" | "services" | "keys" | "other";

export interface GameLabel {
  name: string;
  type: ListingTypeId;
}

export interface Game {
  name: string;
  slug: string;
  initials: string;
  category: CategoryId;
  collection?: true;
  listingTypes: ListingTypeId[];
  labels: GameLabel[];
  variants?: string[];
  experiences?: string[];
}

export type SearchEntry = Pick<Game, "name" | "slug" | "category" | "initials" | "collection">;

export interface Seller {
  id: string;
  handle: string;
  hue: number;
  rating: number;
  reviewCount: number;
  completedOrders: number;
  responseMinutes: number;
  completionRate: number;
  verified: boolean;
  memberSince: number;
  languages: string[];
  online: boolean;
  topSeller: boolean;
}

export interface Listing {
  id: string;
  gameSlug: string;
  sellerId: string;
  title: string;
  type: ListingTypeId;
  labelName: string;
  variant?: string;
  experience?: string;
  price: number;
  originalPrice?: number;
  unit?: { amount: number; label: string };
  stock: number;
  deliveryMinutes: number;
  attributes: string[];
  description: string;
  createdOrder: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  gameName: string;
  daysAgo: number;
  helpful: number;
}
