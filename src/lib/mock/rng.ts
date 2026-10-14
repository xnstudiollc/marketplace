/** FNV-1a 32-bit hash. */
export function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Small, fast seeded PRNG returning floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Rng {
  next: () => number;
  int: (min: number, max: number) => number;
  float: (min: number, max: number) => number;
  pick: <T>(list: readonly T[]) => T;
  chance: (p: number) => boolean;
  shuffle: <T>(list: readonly T[]) => T[];
}

export function createRng(...seedParts: (string | number)[]): Rng {
  const next = mulberry32(hash(seedParts.join("|")));
  const int = (min: number, max: number) => Math.floor(next() * (max - min + 1)) + min;
  return {
    next,
    int,
    float: (min, max) => next() * (max - min) + min,
    pick: (list) => list[Math.floor(next() * list.length)],
    chance: (p) => next() < p,
    shuffle: (list) => {
      const out = list.slice();
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    },
  };
}
