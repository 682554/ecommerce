"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import {
  clearCart,
  removeCartItem,
  updateCartItem,
} from "@/lib/actions/cart";
import type { CartView } from "@/lib/actions/cart.types";
import { useCartStore } from "@/store/cart.store";

type CartPageClientProps = {
  initialCart: CartView;
  checkoutHref: string;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function CartPageClient({
  initialCart,
  checkoutHref,
}: CartPageClientProps) {
  const cart = useCartStore((state) => state.cart);
  const hasLoaded = useCartStore((state) => state.hasLoaded);
  const setCart = useCartStore((state) => state.setCart);
  const setError = useCartStore((state) => state.setError);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeCart = hasLoaded ? cart : initialCart;
  const shippingEstimate = useMemo(
    () => (activeCart.subtotal >= 150 ? 0 : 15),
    [activeCart.subtotal],
  );
  const total = activeCart.total + shippingEstimate;

  if (activeCart.items.length === 0) {
    return (
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-16 text-center backdrop-blur sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-400">
          Your bag is empty
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
          Start building your Nike rotation.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-400 sm:text-base">
          Add a few products and they&apos;ll appear here instantly across the
          storefront.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-orange-100"
        >
          <ShoppingBag className="h-4 w-4" />
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
              Cart
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              Your bag, ready when you are.
            </h1>
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              setFeedback(null);
              startTransition(async () => {
                const result = await clearCart();
                setCart(result.cart);
                setFeedback(result.message);
              });
            }}
            className="text-sm font-semibold text-white/70 transition hover:text-white disabled:opacity-50"
          >
            Clear cart
          </button>
        </div>

        {feedback && (
          <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-4 text-sm text-orange-100">
            {feedback}
          </div>
        )}

        <div className="space-y-4">
          {activeCart.items.map((item) => (
            <article
              key={item.id}
              className="grid gap-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur sm:grid-cols-[140px_minmax(0,1fr)]"
            >
              <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-neutral-950">
                <Image
                  src={item.image ?? "/static/uploads/products/nike-air-force-1-07/01-nike-air-force-1-07.png"}
                  alt={item.productName}
                  fill
                  sizes="(max-width: 640px) 100vw, 140px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-orange-400">
                      {item.category}
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-white">
                      {item.productName}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-neutral-400">
                      {item.productDescription}
                    </p>
                    <p className="mt-3 text-sm text-neutral-500">
                      {item.color} / {item.size}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-lg font-bold text-white">
                      {formatPrice(item.lineTotal)}
                    </p>
                    {item.compareAtPrice && item.compareAtPrice > item.unitPrice && (
                      <p className="mt-1 text-sm text-neutral-500 line-through">
                        {formatPrice(item.compareAtPrice)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="inline-flex items-center rounded-full border border-white/12 bg-black/25 p-1">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => {
                        startTransition(async () => {
                          const result = await updateCartItem({
                            cartItemId: item.id,
                            quantity: item.quantity - 1,
                          });
                          setCart(result.cart);
                          if (!result.success) {
                            setError(result.error ?? result.message);
                          }
                        });
                      }}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/[0.08] disabled:opacity-50"
                      aria-label={`Decrease quantity for ${item.productName}`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-10 text-center text-sm font-semibold text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      disabled={isPending || item.quantity >= item.maxQuantity}
                      onClick={() => {
                        startTransition(async () => {
                          const result = await updateCartItem({
                            cartItemId: item.id,
                            quantity: item.quantity + 1,
                          });
                          setCart(result.cart);
                          if (!result.success) {
                            setError(result.error ?? result.message);
                          }
                        });
                      }}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/[0.08] disabled:opacity-50"
                      aria-label={`Increase quantity for ${item.productName}`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        const result = await removeCartItem(item.id);
                        setCart(result.cart);
                        setFeedback(result.message);
                      });
                    }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur lg:sticky lg:top-24">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-400">
          Summary
        </p>
        <div className="mt-6 space-y-4 text-sm text-neutral-300">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(activeCart.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Estimated shipping</span>
            <span>
              {shippingEstimate === 0 ? "Free" : formatPrice(shippingEstimate)}
            </span>
          </div>
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-base font-semibold text-white">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Link
            href={checkoutHref}
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition hover:bg-orange-100"
          >
            Proceed to checkout
          </Link>
          <Link
            href="/products"
            className="inline-flex w-full items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
          >
            Continue shopping
          </Link>
        </div>

        <p className="mt-6 text-sm leading-7 text-neutral-400">
          Free shipping unlocks automatically once your subtotal reaches $150.
        </p>
      </aside>
    </div>
  );
}
