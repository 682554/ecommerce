import { db } from "@/db";
import { products } from "@/db/schema";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductList } from "@/components/ProductList";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allProducts = await db.select().from(products);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Nike Store
          </h1>
          <span className="text-sm text-zinc-500">
            {allProducts.length} products
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <ProductFilters />
        <ProductList products={allProducts} />
      </main>
    </div>
  );
}
