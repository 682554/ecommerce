import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Filters } from "@/components/Filters";
import { Navbar } from "@/components/Navbar";
import { Sort } from "@/components/Sort";
import { Card } from "@/components/Card";
import { getAllProducts } from "@/lib/actions/product";
import {
  buildProductsUrl,
  colorOptions,
  genderOptions,
  parseFilterParams,
  priceRangeOptions,
  removeFilterValue,
  sizeOptions,
  type ProductQueryState,
} from "@/lib/utils/query";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function labelFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function activeBadges(query: ProductQueryState) {
  return [
    ...query.category.map((value) => ({
      key: `category-${value}`,
      label: labelFromSlug(value),
      group: "category" as const,
      value,
    })),
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
    ...(query.search
      ? [
          {
            key: `search-${query.search}`,
            label: `Search: ${query.search}`,
            group: "search" as const,
            value: query.search,
          },
        ]
      : []),
  ];
}

function buildSearchHiddenFields(query: ProductQueryState) {
  return [
    ...query.category.map((value) => ({ name: "category", value })),
    ...query.gender.map((value) => ({ name: "gender", value })),
    ...query.size.map((value) => ({ name: "size", value })),
    ...query.color.map((value) => ({ name: "color", value })),
    ...query.price.map((value) => ({ name: "price", value })),
    ...(typeof query.priceMin === "number"
      ? [{ name: "priceMin", value: String(query.priceMin) }]
      : []),
    ...(typeof query.priceMax === "number"
      ? [{ name: "priceMax", value: String(query.priceMax) }]
      : []),
    ...(query.sort !== "featured" ? [{ name: "sort", value: query.sort }] : []),
    ...(query.limit !== 9 ? [{ name: "limit", value: String(query.limit) }] : []),
  ];
}

function buildPagination(query: ProductQueryState, totalPages: number) {
  const pages = new Set<number>([1, totalPages, query.page - 1, query.page, query.page + 1]);

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = parseFilterParams(resolvedSearchParams);
  let catalogError: string | null = null;
  let products: Awaited<ReturnType<typeof getAllProducts>>["products"] = [];
  let totalCount = 0;
  let page = query.page;
  let limit = query.limit;
  let totalPages = 1;

  try {
    const result = await getAllProducts(query);
    products = result.products;
    totalCount = result.totalCount;
    page = result.page;
    limit = result.limit;
    totalPages = result.totalPages;
  } catch (error) {
    console.error("Failed to load catalog products", error);
    catalogError =
      "The live catalog could not be reached. Check your database connection and reload the page.";
  }

  const badges = activeBadges(query);
  const visibleFrom = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const visibleTo = totalCount === 0 ? 0 : Math.min(page * limit, totalCount);
  const paginationPages = buildPagination(query, totalPages);
  const searchHiddenFields = buildSearchHiddenFields(query);

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
                Real database products, server-rendered filtering, and a fast
                catalog flow that matches the rest of the storefront.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/25 px-5 py-4">
                <p className="text-3xl font-black text-white">{totalCount}</p>
                <p className="mt-1 text-sm text-neutral-400">Matching products</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/25 px-5 py-4">
                <p className="text-3xl font-black text-white">{page}</p>
                <p className="mt-1 text-sm text-neutral-400">Current page</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/25 px-5 py-4">
                <p className="text-3xl font-black text-white">{badges.length}</p>
                <p className="mt-1 text-sm text-neutral-400">Active filters</p>
              </div>
            </div>
          </div>

          <form
            action="/products"
            method="get"
            className="relative z-10 mt-8 grid gap-3 rounded-[1.6rem] border border-white/10 bg-black/25 p-3 sm:grid-cols-[minmax(0,1fr)_auto]"
          >
            <div className="flex flex-wrap gap-3">
              <label className="sr-only" htmlFor="products-search">
                Search products
              </label>
              <input
                id="products-search"
                name="search"
                type="search"
                defaultValue={query.search}
                placeholder="Search Air Max, Jordan, fleece..."
                className="min-w-0 flex-1 rounded-full border border-white/12 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-neutral-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20"
              />
              {searchHiddenFields.map((field, index) => (
                <input
                  key={`${field.name}-${field.value}-${index}`}
                  type="hidden"
                  name={field.name}
                  value={field.value}
                />
              ))}
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-100"
            >
              Search catalog
            </button>
          </form>
        </section>

        <section className="mt-8 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="lg:hidden">
              <Filters />
            </div>
            <Sort />
          </div>

          {badges.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {badges.map((badge) => {
                const href =
                  badge.group === "search"
                    ? buildProductsUrl("/products", {
                        ...query,
                        search: "",
                        page: 1,
                      })
                    : buildProductsUrl(
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
          <Filters />

          <div className="space-y-6">
            {catalogError && (
              <div className="rounded-[1.75rem] border border-amber-400/20 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
                {catalogError}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-neutral-400">
                Showing {visibleFrom}-{visibleTo} of {totalCount} result
                {totalCount === 1 ? "" : "s"}
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

            {products.length === 0 ? (
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-16 text-center backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
                  No matches
                </p>
                <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white">
                  No products match those filters.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-neutral-400">
                  Try clearing a few filters, changing your search term, or
                  switching the sort order to explore more of the catalog.
                </p>
                <Link
                  href="/products"
                  className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-100"
                >
                  Reset catalog
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      product={{
                        slug: product.slug,
                        name: product.name,
                        description: product.description,
                        category: product.category,
                        gender: product.gender,
                        price: product.minPrice,
                        priceMax: product.maxPrice,
                        image: product.image,
                        colors: product.colors,
                        sizes: product.sizes,
                      }}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav
                    aria-label="Pagination"
                    className="flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] border border-white/10 bg-white/[0.04] px-5 py-4"
                  >
                    <Link
                      href={buildProductsUrl("/products", {
                        ...query,
                        page: Math.max(1, page - 1),
                      })}
                      aria-disabled={page === 1}
                      className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold transition ${
                        page === 1
                          ? "pointer-events-none border border-white/8 text-white/30"
                          : "border border-white/12 text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      Previous
                    </Link>

                    <div className="flex flex-wrap items-center gap-2">
                      {paginationPages.map((pageNumber) => (
                        <Link
                          key={pageNumber}
                          href={buildProductsUrl("/products", {
                            ...query,
                            page: pageNumber,
                          })}
                          aria-current={pageNumber === page ? "page" : undefined}
                          className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition ${
                            pageNumber === page
                              ? "bg-white text-black"
                              : "border border-white/12 text-white hover:bg-white/[0.08]"
                          }`}
                        >
                          {pageNumber}
                        </Link>
                      ))}
                    </div>

                    <Link
                      href={buildProductsUrl("/products", {
                        ...query,
                        page: Math.min(totalPages, page + 1),
                      })}
                      aria-disabled={page === totalPages}
                      className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold transition ${
                        page === totalPages
                          ? "pointer-events-none border border-white/8 text-white/30"
                          : "border border-white/12 text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      Next
                    </Link>
                  </nav>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
