"use client";

import { useProductsStore } from "@/store/products";
import type { Product } from "@/store/products";
import { Card } from "./Card";

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
      <p className="py-12 text-center text-zinc-500 dark:text-zinc-400">
        No products found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filtered.map((product) => (
        <Card
          key={product.id}
          name={product.name}
          price={product.price}
          imageUrl={product.imageUrl}
          category={product.category}
          colors={product.colors}
        />
      ))}
    </div>
  );
}
