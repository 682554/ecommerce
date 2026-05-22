import Link from "next/link";
import { Card } from "@/components/Card";
import { getRecommendedProducts } from "@/lib/actions/product";

type RecommendedProductsSectionProps = {
  productId: string;
};

export async function RecommendedProductsSection({
  productId,
}: RecommendedProductsSectionProps) {
  const products = await getRecommendedProducts(productId);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
            You Might Also Like
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">
            More from the same lane
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
        {products.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
