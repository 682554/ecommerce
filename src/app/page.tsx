import Image from "next/image";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductList } from "@/components/ProductList";
import { db } from "@/db";
import { products } from "@/db/schema";
import { deriveProductSlug } from "@/lib/utils/product-slug";

export const dynamic = "force-dynamic";

export default async function Home() {
  const catalogProducts = await db.query.products.findMany({
    where: eq(products.isPublished, true),
    with: {
      category: true,
      variants: {
        with: {
          color: true,
          images: true,
        },
      },
      defaultVariant: {
        with: {
          images: true,
        },
      },
      images: true,
    },
  });

  const allProducts = catalogProducts.map((product) => {
    const fallbackImage =
      product.defaultVariant?.images.find((image) => image.isPrimary)?.url ??
      product.defaultVariant?.images[0]?.url ??
      product.images.find((image) => image.isPrimary)?.url ??
      product.images[0]?.url ??
      "/static/uploads/products/nike-air-force-1-07/01-nike-air-force-1-07.png";

    const defaultPriceSource = product.defaultVariant;
    const resolvedPrice = Number(
      defaultPriceSource?.salePrice ?? defaultPriceSource?.price ?? "0",
    );

    return {
      id: product.id,
      slug: deriveProductSlug(fallbackImage, product.id),
      name: product.name,
      description: product.description,
      price: resolvedPrice,
      imageUrl: fallbackImage,
      category: product.category.name,
      createdAt: product.createdAt,
    };
  });

  const heroProducts = allProducts.slice(0, 3);
  const featuredProducts = allProducts.slice(0, 5);
  const landingProducts = allProducts.slice(0, 5);
  const categories = Array.from(
    new Set(allProducts.map((product) => product.category)),
  );

  return (
    <>
      <Navbar />
      <div className="flex-1 w-full">
        <section className="noise-overlay relative overflow-hidden px-6 pb-16 pt-10 sm:pb-20 sm:pt-16">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-neutral-200">
                Summer drop 2026
                <span className="h-2 w-2 rounded-full bg-orange-500" />
              </div>
              <h1 className="max-w-3xl text-5xl font-black leading-none tracking-[-0.05em] text-white sm:text-6xl lg:text-8xl">
                Move like you mean it.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-300 sm:text-lg">
                A sharper storefront for premium sneakers, elevated essentials,
                and everyday training pieces that feel fast before you even add
                them to cart.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Shop the collection
                </Link>
                <Link
                  href="/products?sort=newest"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Explore latest arrivals
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
                  <p className="text-3xl font-black text-white">
                    {allProducts.length}
                  </p>
                  <p className="mt-2 text-sm text-neutral-300">
                    Curated performance and lifestyle products
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
                  <p className="text-3xl font-black text-white">
                    {categories.length}
                  </p>
                  <p className="mt-2 text-sm text-neutral-300">
                    Categories ready for quick browsing
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
                  <p className="text-3xl font-black text-white">24h</p>
                  <p className="mt-2 text-sm text-neutral-300">
                    Fast-moving drops with bold presentation
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-8 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" />
              <div className="absolute -right-8 bottom-8 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
              <div className="relative grid gap-4 sm:grid-cols-2">
                {heroProducts.map((product, index) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950/80 ${
                      index === 0 ? "sm:col-span-2 sm:grid sm:grid-cols-[1.15fr_0.85fr]" : ""
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60`}
                  >
                    <div
                      className={`relative ${
                        index === 0 ? "min-h-[360px]" : "min-h-[280px]"
                      }`}
                    >
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        priority={index === 0}
                        sizes={
                          index === 0
                            ? "(max-width: 640px) 100vw, 50vw"
                            : "(max-width: 640px) 100vw, 25vw"
                        }
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                    </div>
                    <div className="relative flex flex-col justify-end p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                        {product.category}
                      </p>
                      <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white">
                        {product.name}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-neutral-300">
                        {product.description}
                      </p>
                      <p className="mt-4 text-lg font-bold text-white">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="featured" className="mx-auto w-full max-w-7xl px-6 pb-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-400">
                Featured now
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">
                Every highlight card now has a real image story behind it
              </h2>
            </div>
            <p className="hidden max-w-md text-sm leading-6 text-neutral-400 lg:block">
              Stronger visuals, better hierarchy, and no more dead space on the
              landing page cards.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className={`overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur ${
                  index === 0 ? "xl:col-span-2 xl:grid xl:grid-cols-[1.05fr_0.95fr]" : ""
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60`}
              >
                <div
                  className={`relative ${
                    index === 0 ? "min-h-[320px]" : "min-h-[260px]"
                  }`}
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes={
                      index === 0
                        ? "(max-width: 1280px) 100vw, 50vw"
                        : "(max-width: 1280px) 100vw, 25vw"
                    }
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
                <div className="space-y-3 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                    {product.category}
                  </p>
                  <h3 className="text-2xl font-black tracking-[-0.04em] text-white">
                    {product.name}
                  </h3>
                  <p className="text-sm leading-6 text-neutral-300">
                    {product.description}
                  </p>
                  <p className="text-sm font-semibold text-orange-300">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          id="products"
          className="mx-auto w-full max-w-7xl flex-1 px-6 py-12"
        >
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-400">
                Shop all
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">
                Filter the full collection
              </h2>
            </div>
            <p className="text-sm text-neutral-400">
              Showing {landingProducts.length} products
            </p>
          </div>

          <div className="mb-12 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur sm:p-6">
            <ProductFilters />
          </div>

          <ProductList products={landingProducts} />
        </section>
      </div>
      <Footer />
    </>
  );
}
