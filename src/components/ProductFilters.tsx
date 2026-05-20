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
                  ? "bg-white text-black hover:bg-neutral-100"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700"
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
        className="w-full rounded-full border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-white focus:ring-1 focus:ring-white sm:w-64"
      />
    </div>
  );
}
