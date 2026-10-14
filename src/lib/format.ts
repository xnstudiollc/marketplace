const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat("en-US");

export const formatPrice = (value: number) => currency.format(value);
export const formatCompact = (value: number) => compact.format(value);
export const formatNumber = (value: number) => whole.format(value);

export function formatDelivery(minutes: number): string {
  if (minutes <= 0) return "Instant";
  if (minutes < 60) return `~${minutes} min`;
  const hours = Math.round(minutes / 60);
  return hours >= 24 ? `~${Math.round(hours / 24)} d` : `~${hours} h`;
}

export function formatResponse(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  return `${Math.round(minutes / 60)} h`;
}

export function formatDaysAgo(days: number): string {
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const w = Math.round(days / 7);
    return `${w} ${w === 1 ? "week" : "weeks"} ago`;
  }
  if (days < 365) {
    const m = Math.round(days / 30);
    return `${m} ${m === 1 ? "month" : "months"} ago`;
  }
  const y = Math.round(days / 365);
  return `${y} ${y === 1 ? "year" : "years"} ago`;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${formatNumber(count)} ${count === 1 ? singular : plural}`;
}
