import Link from "next/link";
import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import SocialProviders from "@/components/SocialProviders";

export const metadata: Metadata = {
  title: "Sign In | Nike",
  description: "Sign in to your Nike account.",
};

export default function SignInPage() {
  return (
    <main className="rounded-[2rem] border border-white/10 bg-white/[0.05] px-6 py-8 text-white shadow-2xl shadow-black/20 backdrop-blur sm:px-10 sm:py-10">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-400">Welcome back</p>
        <h1 className="text-4xl font-black tracking-[-0.04em] text-white">Sign in to your account</h1>
        <p className="max-w-xl text-base leading-7 text-zinc-300">
          Access your membership, manage orders, and explore the latest Nike drops from one secure place.
        </p>
      </div>

      <div className="mt-8">
        <SocialProviders />
      </div>

      <div className="relative my-8">
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
        <span className="relative mx-auto inline-flex bg-[#0c0c0c] px-3 text-sm text-zinc-400">Or continue with email</span>
      </div>

      <AuthForm mode="sign-in" />

      <p className="mt-6 text-center text-sm text-zinc-400">
        New to Nike?{' '}
        <Link
          href="/sign-up"
          className="font-medium text-white underline decoration-white/30 decoration-2 underline-offset-4 hover:text-orange-300"
        >
          Create an account
        </Link>
      </p>
    </main>
  );
}
