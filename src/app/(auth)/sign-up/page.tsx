import Link from "next/link";
import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import SocialProviders from "@/components/SocialProviders";

export const metadata: Metadata = {
  title: "Sign Up | Nike",
  description: "Create a Nike account to start your journey.",
};

export default function SignUpPage() {
  return (
    <main className="rounded-2xl border border-zinc-200 bg-white px-6 py-8 shadow-lg sm:px-10 sm:py-10">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">Join Nike today</p>
        <h1 className="text-4xl font-bold text-zinc-900">Create your account</h1>
        <p className="max-w-xl text-base text-zinc-600">
          Start your fitness journey with a Nike account, get tailored product drops, and keep your orders in one place.
        </p>
      </div>

      <div className="mt-8">
        <SocialProviders />
      </div>

      <div className="relative my-8">
        <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-200" />
        <span className="relative mx-auto inline-flex bg-white px-3 text-sm text-zinc-500">Or sign up with email</span>
      </div>

      <AuthForm mode="sign-up" />

      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link
          href="/sign-in"
          className="font-medium text-zinc-900 underline decoration-zinc-300 decoration-2 underline-offset-4 hover:text-zinc-800"
        >
          Sign in
        </Link>
      </p>
    </main>
  );
}
