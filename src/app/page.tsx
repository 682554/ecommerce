import { db } from "@/db";
import { products } from "@/db/schema";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductList } from "@/components/ProductList";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allProducts = await db.select().from(products);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <ProductFilters />
        <ProductList products={allProducts} />
      </main>
    </div>
  );
}
