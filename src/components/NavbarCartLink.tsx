"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { getCart } from "@/lib/actions/cart";
import { useCartStore } from "@/store/cart.store";

export function NavbarCartLink() {
  const cart = useCartStore((state) => state.cart);
  const hasLoaded = useCartStore((state) => state.hasLoaded);
  const setCart = useCartStore((state) => state.setCart);

  useEffect(() => {
    if (hasLoaded) {
      return;
    }

    let active = true;

    void getCart().then((snapshot) => {
      if (active) {
        setCart(snapshot);
      }
    });

    return () => {
      active = false;
    };
  }, [hasLoaded, setCart]);

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
    >
      <ShoppingBag className="h-4 w-4" />
      <span>Cart</span>
      {cart.itemCount > 0 && (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 py-0.5 text-[11px] font-bold leading-none text-black">
          {cart.itemCount}
        </span>
      )}
    </Link>
  );
}
