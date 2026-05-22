"use client";

import { useEffect } from "react";
import type { CartView } from "@/lib/actions/cart.types";
import { useCartStore } from "@/store/cart.store";

type CartHydratorProps = {
  cart: CartView;
};

export function CartHydrator({ cart }: CartHydratorProps) {
  const setCart = useCartStore((state) => state.setCart);

  useEffect(() => {
    setCart(cart);
  }, [cart, setCart]);

  return null;
}
