import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getCart } from "@/lib/actions/cart";
import { getCurrentUser } from "@/lib/auth/actions";

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default async function CheckoutPage() {
  const [currentUser, cart] = await Promise.all([getCurrentUser(), getCart()]);

  if (!currentUser.success) {
    redirect("/auth?returnUrl=/checkout");
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 pb-16 pt-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-400">
            Checkout
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-white">
            Checkout is ready for the next build step.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-300">
            Your authenticated cart has been preserved and the session gate is in
            place. This page is now ready for payment, address, and order creation
            work without needing to revisit cart ownership logic.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                Signed in as
              </p>
              <p className="mt-2 text-sm text-neutral-300">
                {currentUser.data?.email}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                Items
              </p>
              <p className="mt-2 text-sm text-neutral-300">{cart.itemCount}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                Total
              </p>
              <p className="mt-2 text-sm text-neutral-300">
                {formatPrice(cart.total)}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-orange-100"
            >
              Back to cart
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Continue shopping
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
