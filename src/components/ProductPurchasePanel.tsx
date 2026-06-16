"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { addCartItem } from "@/lib/actions/cart";
import type { ProductDetails } from "@/lib/actions/product";
import { useCartStore } from "@/store/cart.store";
import { SizePicker } from "./SizePicker";

type ProductPurchasePanelProps = {
  product: Pick<
    ProductDetails,
    | "defaultVariantId"
    | "variantGroups"
    | "sizeOptions"
    | "price"
    | "compareAtPrice"
  >;
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const setCart = useCartStore((state) => state.setCart);
  const setError = useCartStore((state) => state.setError);
  const [selectedColorId, setSelectedColorId] = useState(
    product.variantGroups.find((group) =>
      group.variants.some((variant) => variant.id === product.defaultVariantId),
    )?.id ?? product.variantGroups[0]?.id ?? null,
  );
  const defaultVariant =
    product.variantGroups
      .flatMap((group) => group.variants)
      .find((variant) => variant.id === product.defaultVariantId) ??
    product.variantGroups[0]?.variants[0] ??
    null;
  const [selectedSize, setSelectedSize] = useState<string | null>(
    defaultVariant?.size.name ?? product.sizeOptions[0] ?? null,
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeGroup =
    product.variantGroups.find((group) => group.id === selectedColorId) ??
    product.variantGroups[0] ??
    null;

  const activeVariant =
    activeGroup?.variants.find((variant) => variant.size.name === selectedSize) ??
    activeGroup?.variants[0] ??
    null;

  const disabledSizes = useMemo(() => {
    if (!activeGroup) {
      return product.sizeOptions;
    }

    const availableSizes = new Set(activeGroup.variants.map((variant) => variant.size.name));
    return product.sizeOptions.filter((size) => !availableSizes.has(size));
  }, [activeGroup, product.sizeOptions]);

  const displayPrice = activeVariant?.price ?? product.price;
  const displayCompareAtPrice = activeVariant?.compareAtPrice ?? product.compareAtPrice;

  return (
    <div className="mt-8 space-y-6">
      <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/65">
          Select color
        </p>
        <div className="flex flex-wrap gap-3">
          {product.variantGroups.map((group) => {
            const isActive = group.id === activeGroup?.id;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => {
                  setSelectedColorId(group.id);
                  setSelectedSize(group.variants[0]?.size.name ?? null);
                }}
                className={`inline-flex items-center gap-3 rounded-full border px-3 py-2 text-sm text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 ${
                  isActive
                    ? "border-white bg-white/[0.08]"
                    : "border-white/10 bg-black/25 hover:bg-white/[0.05]"
                }`}
                aria-pressed={isActive}
              >
                <span
                  className={`inline-flex h-6 w-6 rounded-full border border-white/20 ${group.color.swatchClassName}`}
                />
                <span>{group.color.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <SizePicker
        sizes={product.sizeOptions}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        disabledSizes={disabledSizes}
      />

      <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
              Selected price
            </p>
            <div className="mt-2 flex items-center gap-3">
              <p className="text-2xl font-black text-white">
                ${displayPrice.toFixed(2)}
              </p>
              {displayCompareAtPrice && displayCompareAtPrice > displayPrice && (
                <p className="text-sm text-neutral-500 line-through">
                  ${displayCompareAtPrice.toFixed(2)}
                </p>
              )}
            </div>
          </div>
          <p className="text-sm text-neutral-400">
            {activeVariant?.inStock
              ? `${activeVariant.inStock} in stock`
              : "Currently unavailable"}
          </p>
        </div>
      </div>

      {feedback && (
        <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-4 text-sm text-orange-100">
          {feedback}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={!activeVariant || activeVariant.inStock <= 0 || isPending}
          onClick={() => {
            if (!activeVariant) {
              return;
            }

            setFeedback(null);
            setError(null);

            startTransition(async () => {
              const result = await addCartItem({
                productVariantId: activeVariant.id,
                quantity: 1,
              });

              if (result.success) {
                setCart(result.cart);
                setFeedback("Item added to cart.");
              } else {
                setError(result.error ?? result.message);
                setFeedback(result.message);
              }
            });
          }}
          className="inline-flex flex-1 items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingBag className="h-4 w-4" />
          {isPending ? "Adding..." : "Add to bag"}
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-3 rounded-full border border-white/12 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
        >
          <Heart className="h-4 w-4" />
          Favorite
        </button>
      </div>
    </div>
  );
}
