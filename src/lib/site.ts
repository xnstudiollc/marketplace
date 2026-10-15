export const SITE = {
  name: "Vaultline",
  tagline: "Everything for your next level, in one place",
  description:
    "Browse accounts, in-game currency, items, boosting and keys for hundreds of games. A demo marketplace with a premium, dark interface.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  orderPrefix: "VL",
} as const;

/** Fixed reference date for relative times in mock data, so output never depends on the clock. */
export const MOCK_ANCHOR_DATE = Date.UTC(2026, 9, 1);
