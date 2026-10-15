import "server-only";
import { cacheLife } from "next/cache";

export function isoWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - yearStart) / 86_400_000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/** The current ISO week, read once inside a cache scope so the page stays prerendered and refreshes daily. */
export async function getCurrentWeekKey(): Promise<string> {
  "use cache";
  cacheLife("days");
  return isoWeekKey(new Date());
}
