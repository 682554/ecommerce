import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ProductGallery } from "@/components/ProductGallery";
import { SizePicker } from "@/components/SizePicker";
import {
  getAllProductDetailIds,
  getProductDetailById,
  getRelatedProductCards,
} from "@/lib/data/product-details";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return getAllProductDetailIds().map((id) => ({ id }));
}

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = getProductDetailById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProductCards(product.id);
  const savings =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100,
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
            fallbackImages={product.gallery}
            colors={product.colors}
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
                    ({product.reviewCount} reviews)
                  </span>
                </div>
                <span className="text-sm text-neutral-500">
                  {product.gender} / {product.category}
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

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                  Fit note
                </p>
                <p className="mt-3 text-sm leading-7 text-neutral-300">
                  {product.fitNote}
                </p>
              </div>

              <div className="mt-8">
                <SizePicker sizes={product.sizes} />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition hover:bg-orange-100"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to bag
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-white/12 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  <Heart className="h-4 w-4" />
                  Favorite
                </button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {product.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-neutral-300"
                  >
                    {highlight}
                  </div>
                ))}
              </div>
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

              <CollapsibleSection title="Reviews">
                <div className="space-y-3">
                  <p>{product.reviewsNote}</p>
                  <div className="rounded-[1.25rem] border border-dashed border-white/10 bg-white/[0.02] px-4 py-5 text-neutral-400">
                    Customer reviews will appear here once review persistence is connected.
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          </div>
        </section>

        <section className="mt-16 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
                You Might Also Like
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">
                More Nike picks with the same premium direction.
              </h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-white/75 transition hover:text-white"
            >
              Browse all products
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.slug} product={relatedProduct} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
