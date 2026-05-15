interface CardProps {
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  colorCount?: number;
  badge?: string;
}

export function Card({
  name,
  price,
  imageUrl,
  category,
  colorCount,
  badge,
}: CardProps) {
  return (
    <article className="group cursor-pointer overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-semibold text-orange-600 shadow-sm">
            {badge}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="px-1 pt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {name}
          </h3>
          <span className="shrink-0 text-base font-semibold text-zinc-900 dark:text-zinc-50">
            ${price.toFixed(2)}
          </span>
        </div>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {category}
        </p>
        {colorCount !== undefined && colorCount > 0 && (
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            {colorCount} Colour
          </p>
        )}
      </div>
    </article>
  );
}
