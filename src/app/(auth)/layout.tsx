import type { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col overflow-hidden lg:flex-row">
        <div className="noise-overlay relative hidden flex-1 overflow-hidden border-r border-white/10 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(234,88,12,0.24),transparent_28%),linear-gradient(160deg,#050505_0%,#111111_48%,#030303_100%)]" />
          <div className="relative z-10 flex w-full flex-col justify-between px-8 py-14 lg:px-16">
            <div className="max-w-xl">
              <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-3xl border border-white/12 bg-white/[0.08] shadow-lg">
              <Image
                src="/nike-logo.svg"
                alt="Nike"
                width={44}
                height={16}
                className="invert"
                priority
              />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-400">
                Member access
              </p>
              <h1 className="mt-4 text-5xl font-black leading-tight tracking-[-0.04em] text-white">
                Sign in with the same pace as the storefront.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-300">
                Your auth flow now shares the same darker premium mood as the
                landing page, with cleaner spacing, stronger contrast, and a
                more polished first impression.
              </p>
              <div className="mt-10 space-y-4 text-sm text-zinc-400">
                <p className="inline-flex items-center gap-3">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-orange-500" />
                  Personalized product drops and early releases.
                </p>
                <p className="inline-flex items-center gap-3">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-orange-500" />
                  Seamless sign in on mobile and desktop.
                </p>
                <p className="inline-flex items-center gap-3">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-orange-500" />
                  Consistent visual language from homepage to checkout.
                </p>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.05]">
                <div className="relative min-h-[220px]">
                  <Image
                    src="/products/photos/air-force-1.jpg"
                    alt="Nike member feature product"
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                      Members
                    </p>
                    <p className="mt-2 text-xl font-bold text-white">
                      Early access to drops
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                  Fast lane
                </p>
                <p className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">
                  1 account.
                  <br />
                  Every session.
                </p>
                <p className="mt-4 text-sm leading-7 text-zinc-300">
                  Orders, saved preferences, and future member perks all stay
                  in one clean flow.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-10">
          <div className="w-full max-w-xl px-2 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
