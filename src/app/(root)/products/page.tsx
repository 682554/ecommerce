import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Filters } from "@/components/Filters";
import { Navbar } from "@/components/Navbar";
import { Sort } from "@/components/Sort";
import { Card } from "@/components/Card";
import {
  colorOptions,
  genderOptions,
  mockProducts,
  priceRangeOptions,
  sizeOptions,
  type MockProduct,
} from "@/lib/data/mock-products";
import {
  buildProductsUrl,
  parseProductQuery,
  removeFilterValue,
  type ProductQueryState,
} from "@/lib/utils/query";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getLowestPrice(product: MockProduct) {
  return product.variants.reduce(
    (lowest, variant) => Math.min(lowest, variant.price),
    Number.POSITIVE_INFINITY,
  );
}

function matchesPriceRange(product: MockProduct, priceFilters: ProductQueryState["price"]) {
  if (priceFilters.length === 0) {
    return true;
  }

  const lowestPrice = getLowestPrice(product);
  return priceFilters.some((priceFilter) => {
    const range = priceRangeOptions.find((item) => item.value === priceFilter);
    if (!range) return false;
    if (range.max === null) return lowestPrice >= range.min;
    return lowestPrice >= range.min && lowestPrice <= range.max;
  });
}

function filterProducts(products: MockProduct[], query: ProductQueryState) {
  return products.filter((product) => {
    const matchesGender =
      query.gender.length === 0 || query.gender.includes(product.gender);
    const matchesSize =
      query.size.length === 0 ||
      product.variants.some((variant) => query.size.includes(variant.size));
    const matchesColor =
      query.color.length === 0 ||
      product.variants.some((variant) => query.color.includes(variant.color));
    const matchesPrice = matchesPriceRange(product, query.price);

    return matchesGender && matchesSize && matchesColor && matchesPrice;
  });
}

function sortProducts(products: MockProduct[], sort: ProductQueryState["sort"]) {
  const cloned = [...products];

  switch (sort) {
    case "newest":
      return cloned.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "price_desc":
      return cloned.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
    case "price_asc":
      return cloned.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
    case "featured":
    default:
      return cloned.sort((a, b) => {
        if (a.featured === b.featured) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return Number(b.featured) - Number(a.featured);
      });
  }
}

function countFilterMatches(products: MockProduct[]) {
  return {
    gender: Object.fromEntries(
      genderOptions.map((option) => [
        option.value,
        products.filter((product) => product.gender === option.value).length,
      ]),
    ),
    size: Object.fromEntries(
      sizeOptions.map((option) => [
        option.value,
        products.filter((product) =>
          product.variants.some((variant) => variant.size === option.value),
        ).length,
      ]),
    ),
    color: Object.fromEntries(
      colorOptions.map((option) => [
        option.value,
        products.filter((product) =>
          product.variants.some((variant) => variant.color === option.value),
        ).length,
      ]),
    ),
    price: Object.fromEntries(
      priceRangeOptions.map((option) => [
        option.value,
        products.filter((product) =>
          matchesPriceRange(product, [option.value]),
        ).length,
      ]),
    ),
  };
}

function buildCardProduct(product: MockProduct) {
  const firstVariant = product.variants[0];
  return {
    slug: product.slug,
    name: product.name,
    description: product.description,
    category: product.category,
    gender: genderOptions.find((item) => item.value === product.gender)?.label ?? product.gender,
    price: getLowestPrice(product),
    image: firstVariant.image,
    colors: [...new Set(product.variants.map((variant) => variant.color))],
    sizes: [...new Set(product.variants.map((variant) => variant.size.toUpperCase()))],
  };
}

function activeBadges(query: ProductQueryState) {
  return [
    ...query.gender.map((value) => ({
      key: `gender-${value}`,
      label: genderOptions.find((item) => item.value === value)?.label ?? value,
      group: "gender" as const,
      value,
    })),
    ...query.size.map((value) => ({
      key: `size-${value}`,
      label: `Size: ${sizeOptions.find((item) => item.value === value)?.label ?? value}`,
      group: "size" as const,
      value,
    })),
    ...query.color.map((value) => ({
      key: `color-${value}`,
      label: colorOptions.find((item) => item.value === value)?.label ?? value,
      group: "color" as const,
      value,
    })),
    ...query.price.map((value) => ({
      key: `price-${value}`,
      label: priceRangeOptions.find((item) => item.value === value)?.label ?? value,
      group: "price" as const,
      value,
    })),
  ];
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = parseProductQuery(resolvedSearchParams);
  const filteredProducts = sortProducts(filterProducts(mockProducts, query), query.sort);
  const filterCounts = countFilterMatches(mockProducts);
  const badges = activeBadges(query);

  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-16 pt-10 sm:pt-14">
        <section className="noise-overlay relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-8 backdrop-blur sm:px-8 lg:px-10">
          <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-orange-500/15 blur-3xl" />
          <div className="absolute left-0 top-10 h-32 w-32 rounded-full bg-white/6 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-400">
                Product Listing
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
                Filter the Nike catalog your way.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-300">
                Server-rendered listings, fast URL-driven filtering, and a dark
                storefront rhythm that matches the rest of the app.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/25 px-5 py-4">
                <p className="text-3xl font-black text-white">{mockProducts.length}</p>
                <p className="mt-1 text-sm text-neutral-400">Catalog products</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/25 px-5 py-4">
                <p className="text-3xl font-black text-white">{filteredProducts.length}</p>
                <p className="mt-1 text-sm text-neutral-400">Matching results</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/25 px-5 py-4">
                <p className="text-3xl font-black text-white">{badges.length}</p>
                <p className="mt-1 text-sm text-neutral-400">Active filters</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="lg:hidden">
              <Filters counts={filterCounts} />
            </div>
            <Sort />
          </div>

          {badges.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {badges.map((badge) => {
                const href = buildProductsUrl(
                  "/products",
                  removeFilterValue(query, badge.group, badge.value),
                );

                return (
                  <Link
                    key={badge.key}
                    href={href}
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                  >
                    {badge.label}
                    <span aria-hidden="true" className="text-white/60">
                      ×
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
          <Filters counts={filterCounts} />

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-neutral-400">
                Showing {filteredProducts.length} result{filteredProducts.length === 1 ? "" : "s"}
              </p>
              {badges.length > 0 && (
                <Link
                  href="/products"
                  className="text-sm font-medium text-orange-300 transition hover:text-orange-200"
                >
                  Clear all
                </Link>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-16 text-center backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
                  No matches
                </p>
                <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white">
                  No products match those filters.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-neutral-400">
                  Try clearing a few filters or switching sort order to explore
                  more of the catalog.
                </p>
                <Link
                  href="/products"
                  className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-100"
                >
                  Reset catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <Card key={product.id} product={buildCardProduct(product)} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
