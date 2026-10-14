"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface RecentState {
  searches: string[];
  games: string[];
  addSearch: (query: string) => void;
  clearSearches: () => void;
  addGame: (slug: string) => void;
}

const MAX_SEARCHES = 5;
const MAX_GAMES = 8;

export const useRecent = create<RecentState>()(
  persist(
    (set) => ({
      searches: [],
      games: [],
      addSearch: (query) =>
        set((state) => {
          const q = query.trim();
          if (q.length < 2) return state;
          return { searches: [q, ...state.searches.filter((s) => s.toLowerCase() !== q.toLowerCase())].slice(0, MAX_SEARCHES) };
        }),
      clearSearches: () => set({ searches: [] }),
      addGame: (slug) => set((state) => ({ games: [slug, ...state.games.filter((s) => s !== slug)].slice(0, MAX_GAMES) })),
    }),
    {
      name: "vaultline-recent",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
