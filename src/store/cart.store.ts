"use client";

import { create } from "zustand";
import type { CartView } from "@/lib/actions/cart.types";

type CartStoreState = {
  cart: CartView;
  hasLoaded: boolean;
  isPending: boolean;
  error: string | null;
  setCart: (cart: CartView) => void;
  setPending: (value: boolean) => void;
  setError: (value: string | null) => void;
  reset: () => void;
};

const emptyCart: CartView = {
  id: null,
  items: [],
  itemCount: 0,
  subtotal: 0,
  total: 0,
  isAuthenticated: false,
  guestSessionToken: null,
};

export const useCartStore = create<CartStoreState>((set) => ({
  cart: emptyCart,
  hasLoaded: false,
  isPending: false,
  error: null,
  setCart: (cart) => set({ cart, hasLoaded: true, error: null }),
  setPending: (value) => set({ isPending: value }),
  setError: (value) => set({ error: value }),
  reset: () =>
    set({
      cart: emptyCart,
      hasLoaded: false,
      isPending: false,
      error: null,
    }),
}));

export { emptyCart };
