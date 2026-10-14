"use client";

import { create } from "zustand";

interface UiState {
  paletteOpen: boolean;
  cartOpen: boolean;
  mobileNavOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
}

export const useUi = create<UiState>()((set) => ({
  paletteOpen: false,
  cartOpen: false,
  mobileNavOpen: false,
  setPaletteOpen: (paletteOpen) => set({ paletteOpen, ...(paletteOpen ? { mobileNavOpen: false } : {}) }),
  setCartOpen: (cartOpen) => set({ cartOpen, ...(cartOpen ? { mobileNavOpen: false } : {}) }),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
}));
