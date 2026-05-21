import Image from "next/image";

type CardProps = {
  product: {
    slug: string;
    name: string;
    description: string;
    category: string;
    gender: string;
    price: number;
    image: string;
    colors: string[];
    sizes: string[];
  };
};

export function Card({ product }: CardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/30">
      <div className="relative aspect-[4/4.6] overflow-hidden bg-neutral-950">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80 backdrop-blur">
            {product.gender}
          </span>
          <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80 backdrop-blur">
            {product.category}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="text-lg font-bold leading-tight text-white">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-6 text-neutral-300">
            {product.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.colors.slice(0, 3).map((color) => (
            <span
              key={color}
              className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-300"
            >
              {color}
            </span>
          ))}
          {product.colors.length > 3 && (
            <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-300">
              +{product.colors.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-400">
              Sizes: {product.sizes.slice(0, 4).join(", ")}
            </p>
            <p className="pt-2 text-xl font-bold text-white">
              ${product.price.toFixed(2)}
            </p>
          </div>
          <span className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition group-hover:bg-orange-100">
            Nike
          </span>
        </div>
      </div>
    </article>
  );
}
