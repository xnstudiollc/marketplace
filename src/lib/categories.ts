import {
  Bot,
  Coins,
  Gift,
  Globe,
  KeyRound,
  Monitor,
  Package,
  Radio,
  Shapes,
  Smartphone,
  Trophy,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId, ListingTypeId } from "./types";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  accent: string;
  icon: LucideIcon;
  blurb: string;
}

export const CATEGORY_META: Record<CategoryId, CategoryMeta> = {
  "pc-console": {
    id: "pc-console",
    label: "PC & Console",
    accent: "#38BDF8",
    icon: Monitor,
    blurb: "Keys, activations and accounts for the big releases and the hidden gems.",
  },
  "online-mmo": {
    id: "online-mmo",
    label: "Online & MMO",
    accent: "#7C5CFF",
    icon: Globe,
    blurb: "Gold, items, boosting and ranked help for live-service worlds.",
  },
  mobile: {
    id: "mobile",
    label: "Mobile",
    accent: "#F472B6",
    icon: Smartphone,
    blurb: "Top-ups, passes and accounts for the games in your pocket.",
  },
  "ai-software": {
    id: "ai-software",
    label: "AI & Software",
    accent: "#22D3EE",
    icon: Bot,
    blurb: "Subscriptions and seats for AI tools, creative suites and utilities.",
  },
  "platforms-gift-cards": {
    id: "platforms-gift-cards",
    label: "Platforms & Gift Cards",
    accent: "#FBBF24",
    icon: Gift,
    blurb: "Store balance, gift cards and platform accounts.",
  },
  "social-streaming": {
    id: "social-streaming",
    label: "Social & Streaming",
    accent: "#34D399",
    icon: Radio,
    blurb: "Subscriptions, boosts and services for the platforms you stream and chat on.",
  },
};

export const CATEGORY_ORDER: CategoryId[] = [
  "pc-console",
  "online-mmo",
  "mobile",
  "ai-software",
  "platforms-gift-cards",
  "social-streaming",
];

export interface ListingTypeMeta {
  id: ListingTypeId;
  label: string;
  accent: string;
  icon: LucideIcon;
  blurb: string;
}

export const LISTING_TYPE_META: Record<ListingTypeId, ListingTypeMeta> = {
  accounts: {
    id: "accounts",
    label: "Accounts",
    accent: "#38BDF8",
    icon: UserRound,
    blurb: "Ready-to-play profiles, ranked and leveled.",
  },
  currency: {
    id: "currency",
    label: "Currency",
    accent: "#FBBF24",
    icon: Coins,
    blurb: "Gold, gems, points and premium coins.",
  },
  items: {
    id: "items",
    label: "Items",
    accent: "#F472B6",
    icon: Package,
    blurb: "Skins, gear, pets and rare drops.",
  },
  services: {
    id: "services",
    label: "Boosting & Services",
    accent: "#7C5CFF",
    icon: Trophy,
    blurb: "Rank boosts, raids, coaching and farming.",
  },
  keys: {
    id: "keys",
    label: "Keys & Passes",
    accent: "#22D3EE",
    icon: KeyRound,
    blurb: "Game keys, top-ups, passes and subscriptions.",
  },
  other: {
    id: "other",
    label: "Other",
    accent: "#9AA3B8",
    icon: Shapes,
    blurb: "Everything that does not fit a box.",
  },
};

export const LISTING_TYPE_ORDER: ListingTypeId[] = ["accounts", "currency", "items", "services", "keys", "other"];

export function isCategoryId(value: string): value is CategoryId {
  return value in CATEGORY_META;
}

export function isListingTypeId(value: string): value is ListingTypeId {
  return value in LISTING_TYPE_META;
}
