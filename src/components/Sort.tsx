"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  buildProductsUrl,
  parseProductQuery,
  setSortValue,
  type ProductSortOption,
} from "@/lib/utils/query";

const sortOptions: Array<{ value: ProductSortOption; label: string }> = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "price_asc", label: "Price: Low to High" },
];

export function Sort() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentState = useMemo(
    () => parseProductQuery(searchParams.toString()),
    [searchParams],
  );

  function handleChange(sort: ProductSortOption) {
    const nextState = setSortValue(currentState, sort);
    router.replace(buildProductsUrl(pathname, nextState), { scroll: false });
  }

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="sort-products"
        className="text-sm font-semibold uppercase tracking-[0.24em] text-neutral-400"
      >
        Sort
      </label>
      <div className="relative">
        <select
          id="sort-products"
          value={currentState.sort}
          onChange={(event) => handleChange(event.target.value as ProductSortOption)}
          className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-3 pr-10 text-sm font-medium text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-black">
              {option.label}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70"
        >
          <path
            d="M5.5 7.5L10 12l4.5-4.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
