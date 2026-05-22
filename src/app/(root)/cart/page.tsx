import { CartHydrator } from "@/components/CartHydrator";
import { CartPageClient } from "@/components/CartPageClient";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getCart } from "@/lib/actions/cart";
import { getCurrentUser } from "@/lib/auth/actions";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const [cart, currentUser] = await Promise.all([getCart(), getCurrentUser()]);
  const checkoutHref = currentUser.success ? "/checkout" : "/auth?returnUrl=/checkout";

  return (
    <>
      <Navbar />
      <CartHydrator cart={cart} />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-16 pt-10 sm:pt-12">
        <CartPageClient initialCart={cart} checkoutHref={checkoutHref} />
      </main>
      <Footer />
    </>
  );
}
