"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ListingTypeId } from "@/lib/types";

export interface CartItem {
  id: string;
  gameSlug: string;
  gameName: string;
  sellerId: string;
  sellerHandle: string;
  title: string;
  type: ListingTypeId;
  unitPrice: number;
  quantity: number;
  maxQuantity: number;
  deliveryMinutes: number;
  needsDeliveryDetails: boolean;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (id: string) => void;
  restore: (item: CartItem, index: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
}

export const SERVICE_FEE_RATE = 0.045;

const clampQty = (qty: number, max: number) => Math.max(1, Math.min(Math.round(qty) || 1, Math.min(99, max)));

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: clampQty(i.quantity + quantity, i.maxQuantity) } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: clampQty(quantity, item.maxQuantity) }] };
        }),
      remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      restore: (item, index) =>
        set((state) => {
          if (state.items.some((i) => i.id === item.id)) return state;
          const items = state.items.slice();
          items.splice(Math.min(index, items.length), 0, item);
          return { items };
        }),
      setQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity: clampQty(quantity, i.maxQuantity) } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "vaultline-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

export function cartTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const fee = Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100;
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  return { subtotal, fee, total: subtotal + fee, count };
}
