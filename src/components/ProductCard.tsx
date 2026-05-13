import type { Product } from "@/store/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {product.category}
        </span>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {product.description}
        </p>
        <p className="pt-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
