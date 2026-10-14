import type { MetadataRoute } from "next";
import { CATEGORY_ORDER } from "@/lib/categories";
import { getAllGames } from "@/lib/data";
import { SELLERS } from "@/lib/mock/sellers";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE.url}${path}`;
  return [
    { url: url("/"), changeFrequency: "daily", priority: 1 },
    { url: url("/browse"), changeFrequency: "daily", priority: 0.9 },
    ...CATEGORY_ORDER.map((id) => ({ url: url(`/category/${id}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...getAllGames().map((g) => ({ url: url(`/games/${g.slug}`), changeFrequency: "daily" as const, priority: 0.7 })),
    ...SELLERS.map((s) => ({ url: url(`/sellers/${s.id}`), changeFrequency: "weekly" as const, priority: 0.4 })),
    { url: url("/help"), changeFrequency: "monthly", priority: 0.3 },
    { url: url("/about"), changeFrequency: "monthly", priority: 0.3 },
  ];
}
