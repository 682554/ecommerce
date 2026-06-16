import { Suspense } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { Footer } from "@/components/Footer";
import type { ProductGalleryColor } from "@/components/ProductGallery";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { ProductReviewsSection } from "@/components/ProductReviewsSection";
import { RecommendedProductsSection } from "@/components/RecommendedProductsSection";
import { Navbar } from "@/components/Navbar";
import { getProduct } from "@/lib/actions/product";

export const dynamic = "force-dynamic";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function ProductAsyncSectionSkeleton() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-7">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-32 rounded-full bg-white/10" />
        <div className="h-10 w-72 rounded-full bg-white/10" />
        <div className="space-y-3 pt-2">
          <div className="h-24 rounded-[1.5rem] bg-white/[0.05]" />
          <div className="h-24 rounded-[1.5rem] bg-white/[0.05]" />
          <div className="h-24 rounded-[1.5rem] bg-white/[0.05]" />
        </div>
      </div>
    </div>
  );
}

function ProductNotFoundState() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-16 pt-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-16 text-center backdrop-blur sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-400">
            Product unavailable
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            We couldn&apos;t find that product.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-400 sm:text-base">
            The item may have been removed, unpublished, or linked with an
            outdated product ID. The rest of the storefront is still available.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-orange-100"
            >
              Browse catalog
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Return home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return <ProductNotFoundState />;
  }

  const galleryColors: ProductGalleryColor[] = product.variantGroups.map((group) => ({
    id: group.id,
    label: group.color.name,
    swatchClassName: group.color.swatchClassName,
    images: group.images.map((image) => image.url),
  }));

  const galleryImages = product.images.map((image) => image.url);
  const savings =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
        )
      : null;

  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-16 pt-8 sm:pt-10">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-neutral-400">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="transition hover:text-white">
            Products
          </Link>
          <span>/</span>
          <span className="text-white/80">{product.name}</span>
        </div>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-start">
          <ProductGallery
            productName={product.name}
            fallbackImages={galleryImages}
            colors={galleryColors}
          />

          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-300">
                  {product.subtitle}
                </span>
                {savings && (
                  <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/75">
                    {savings}% Off
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-amber-300">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-semibold text-white">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-neutral-400">
                    ({product.reviewCount} review{product.reviewCount === 1 ? "" : "s"})
                  </span>
                </div>
                <span className="text-sm text-neutral-500">
                  {product.brand.name} / {product.gender.label}
                </span>
              </div>

              <div className="mt-6 flex items-end gap-4">
                <p className="text-3xl font-black text-white">
                  {formatPrice(product.price)}
                </p>
                {product.compareAtPrice && (
                  <p className="pb-1 text-lg text-neutral-500 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </p>
                )}
              </div>

              <p className="mt-6 text-base leading-8 text-neutral-300">
                {product.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.25rem] border border-white/10 bg-black/25 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                    Colors
                  </p>
                  <p className="mt-2 text-sm text-neutral-300">
                    {product.variantGroups.length} available
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-black/25 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                    Sizes
                  </p>
                  <p className="mt-2 text-sm text-neutral-300">
                    {product.sizeOptions.join(", ")}
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-black/25 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                    Category
                  </p>
                  <p className="mt-2 text-sm text-neutral-300">
                    {product.category.name}
                  </p>
                </div>
              </div>

              <ProductPurchasePanel product={product} />
            </div>

            <div className="space-y-4">
              <CollapsibleSection title="Product Details" defaultOpen>
                <div className="space-y-3">
                  {product.details.map((detail) => (
                    <p key={detail}>{detail}</p>
                  ))}
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Shipping & Returns">
                <div className="space-y-3">
                  {product.shipping.map((detail) => (
                    <p key={detail}>{detail}</p>
                  ))}
                </div>
              </CollapsibleSection>
            </div>
          </div>
        </section>

        <div className="mt-16">
          <Suspense fallback={<ProductAsyncSectionSkeleton />}>
            <ProductReviewsSection productId={product.id} />
          </Suspense>
        </div>

        <div className="mt-16">
          <Suspense fallback={<ProductAsyncSectionSkeleton />}>
            <RecommendedProductsSection productId={product.id} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
