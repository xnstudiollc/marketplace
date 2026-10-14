import { getSiteStats } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { OG_SIZE, renderOg } from "@/lib/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name}: ${SITE.tagline}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const stats = getSiteStats();
  return renderOg({
    eyebrow: "Gaming marketplace",
    title: SITE.tagline,
    detail: `${formatNumber(stats.games)} games · ${formatNumber(stats.offers)} offers · Buyer protection on every order`,
  });
}
