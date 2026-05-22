import Link from "next/link";

type AuthHubPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function resolveReturnUrl(
  searchParams: Record<string, string | string[] | undefined>,
) {
  const value = searchParams.returnUrl;
  if (Array.isArray(value)) {
    return value[0] ?? "/";
  }

  return value ?? "/";
}

export default async function AuthHubPage({ searchParams }: AuthHubPageProps) {
  const resolvedSearchParams = await searchParams;
  const returnUrl = resolveReturnUrl(resolvedSearchParams);

  return (
    <main className="rounded-[2rem] border border-white/10 bg-white/[0.05] px-6 py-8 text-white shadow-2xl shadow-black/20 backdrop-blur sm:px-10 sm:py-10">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-400">
          Authentication required
        </p>
        <h1 className="text-4xl font-black tracking-[-0.04em] text-white">
          Sign in to continue to checkout
        </h1>
        <p className="max-w-xl text-base leading-7 text-zinc-300">
          Your cart is safe and will be merged automatically if you created it as a
          guest before signing in.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/sign-in?returnUrl=${encodeURIComponent(returnUrl)}`}
          className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-orange-100"
        >
          Sign in
        </Link>
        <Link
          href={`/sign-up?returnUrl=${encodeURIComponent(returnUrl)}`}
          className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
        >
          Create account
        </Link>
      </div>
    </main>
  );
}
