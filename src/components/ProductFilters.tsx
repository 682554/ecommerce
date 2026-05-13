"use client";

import { useProductsStore } from "@/store/products";

const categories = ["All", "Shoes", "Clothing", "Accessories"];

export function ProductFilters() {
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } =
    useProductsStore();

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive =
            cat === "All" ? selectedCategory === null : selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === "All" ? null : cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 sm:w-64"
      />
    </div>
  );
}
