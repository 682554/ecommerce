import type { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col overflow-hidden lg:flex-row">
        <div className="hidden flex-1 flex-col justify-center bg-zinc-950 px-8 py-16 text-white lg:flex lg:px-16">
          <div className="max-w-xl">
            <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 shadow-lg">
              <Image
                src="/nike-logo.svg"
                alt="Nike"
                width={44}
                height={16}
                className="invert"
                priority
              />
            </div>
            <h1 className="text-5xl font-bold leading-tight text-white">Just Do It with faster sign-in.</h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-300">
              Create or access your account with a clean, modern experience designed for speed, clarity, and Nike styling.
            </p>
            <div className="mt-10 space-y-4 text-sm text-zinc-400">
              <p className="inline-flex items-center gap-3">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                Personalized product drops and early releases.
              </p>
              <p className="inline-flex items-center gap-3">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                Seamless sign in on mobile and desktop.
              </p>
              <p className="inline-flex items-center gap-3">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                A bold Nike aesthetic with accessible interactions.
              </p>
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
