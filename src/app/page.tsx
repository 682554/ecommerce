import { db } from "@/db";
import { products, productColors } from "@/db/schema";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductList } from "@/components/ProductList";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allProducts = await db.select().from(products);
  const allColors = await db.select().from(productColors);

  const productsWithColors = allProducts.map((product) => ({
    ...product,
    colors: allColors
      .filter((c) => c.productId === product.id)
      .map((c) => ({
        id: c.id,
        colorName: c.colorName,
        colorHex: c.colorHex,
        imageUrl: c.imageUrl,
      })),
  }));

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <ProductFilters />
        <ProductList products={productsWithColors} />
      </main>
    </div>
  );
}
