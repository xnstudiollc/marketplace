export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const compact = (input: string) => input.replace(/\s+/g, "");

interface Searchable {
  name: string;
  slug: string;
  initials: string;
  labelText?: string;
}

interface Prepared<T> {
  item: T;
  name: string;
  words: string[];
  compactName: string;
  compactSlug: string;
  initials: string;
  labels: string;
}

export interface Searcher<T> {
  search: (query: string, limit?: number) => T[];
}

function isSubsequence(needle: string, haystack: string): boolean {
  let i = 0;
  for (let j = 0; j < haystack.length && i < needle.length; j++) if (haystack[j] === needle[i]) i++;
  return i === needle.length;
}

/** Tiny scorer: prefix matches rank highest, punctuation and apostrophes are ignored, falls back to subsequence. */
export function createSearcher<T extends Searchable>(items: T[]): Searcher<T> {
  const prepared: Prepared<T>[] = items.map((item) => {
    const name = normalize(item.name);
    return {
      item,
      name,
      words: name.split(" "),
      compactName: compact(name),
      compactSlug: item.slug.replace(/-/g, ""),
      initials: item.initials.toLowerCase(),
      labels: item.labelText ? normalize(item.labelText) : "",
    };
  });

  const score = (p: Prepared<T>, q: string, qc: string): number => {
    if (p.name === q || p.compactName === qc) return 120;
    if (p.name.startsWith(q)) return 100;
    if (p.compactSlug.startsWith(qc) || p.compactName.startsWith(qc)) return 95;
    if (p.words.some((w) => w.startsWith(q))) return 80;
    if (p.name.includes(q)) return 60;
    if (p.compactName.includes(qc)) return 55;
    if (p.initials === qc) return 50;
    if (p.labels && p.labels.includes(q)) return 30;
    if (qc.length >= 3 && isSubsequence(qc, p.compactName)) return 10 + Math.round((qc.length / p.compactName.length) * 10);
    return 0;
  };

  return {
    search(query, limit) {
      const q = normalize(query);
      if (!q) return limit ? items.slice(0, limit) : items.slice();
      const qc = compact(q);
      const scored: { p: Prepared<T>; s: number }[] = [];
      for (const p of prepared) {
        const s = score(p, q, qc);
        if (s > 0) scored.push({ p, s });
      }
      scored.sort((a, b) => b.s - a.s || a.p.name.length - b.p.name.length || a.p.name.localeCompare(b.p.name));
      const out = scored.map((x) => x.p.item);
      return limit ? out.slice(0, limit) : out;
    },
  };
}
