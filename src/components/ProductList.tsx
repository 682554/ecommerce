"use client";

import { useProductsStore } from "@/store/products";
import type { Product } from "@/store/products";
import { ProductCard } from "./ProductCard";

export function ProductList({ products }: { products: Product[] }) {
  const { selectedCategory, searchQuery } = useProductsStore();

  const filtered = products.filter((p) => {
    const matchesCategory =
      selectedCategory === null || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    return (
      <p className="py-12 text-center text-neutral-400">
        No products found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filtered.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
