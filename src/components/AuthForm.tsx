"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
};

const labels = {
  "sign-in": {
    title: "Sign in",
    submit: "Sign In",
    helpText: "Forgot your password?",
    helpLink: "/help",
  },
  "sign-up": {
    title: "Create account",
    submit: "Create account",
    helpText: "Already have an account?",
    helpLink: "/sign-in",
  },
};

export default function AuthForm({ mode }: AuthFormProps) {
  const config = labels[mode];
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      let result;
      if (mode === "sign-up") {
        result = await signUp({
          name: formData.get("fullName"),
          email: formData.get("email"),
          password: formData.get("password"),
          confirmPassword: formData.get("confirmPassword"),
        });
      } else {
        result = await signIn({
          email: formData.get("email"),
          password: formData.get("password"),
        });
      }

      if (result.success) {
        // Redirect based on return URL or default
        const returnUrl = new URLSearchParams(window.location.search).get("returnUrl") || "/";
        router.push(returnUrl);
        router.refresh();
      } else {
        setError(result.message || "Authentication failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {mode === "sign-up" ? (
        <div>
          <label htmlFor="full-name" className="block text-sm font-medium text-zinc-700">
            Full name
          </label>
          <input
            id="full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            className="mt-2 w-full rounded-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-green-100 disabled:opacity-50"
            required
            disabled={isLoading}
          />
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@domain.com"
          className="mt-2 w-full rounded-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-green-100 disabled:opacity-50"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
            Password
          </label>
          {mode === "sign-in" ? (
            <Link href="/help" className="text-sm font-medium text-zinc-900 hover:text-zinc-800">
              Forgot password?
            </Link>
          ) : null}
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
          placeholder="Minimum 8 characters"
          className="mt-2 w-full rounded-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-green-100 disabled:opacity-50"
          required
          minLength={8}
          disabled={isLoading}
        />
      </div>

      {mode === "sign-up" ? (
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-zinc-700">
            Confirm password
          </label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm your password"
            className="mt-2 w-full rounded-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-green-100 disabled:opacity-50"
            required
            minLength={8}
            disabled={isLoading}
          />
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Loading..." : config.submit}
      </button>

      {mode === "sign-up" ? (
        <p className="text-center text-sm text-zinc-500">
          By creating an account, you agree to our{' '}
          <Link href="/terms-of-service" className="font-medium text-zinc-900 hover:text-zinc-800">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className="font-medium text-zinc-900 hover:text-zinc-800">
            Privacy Policy
          </Link>
          .
        </p>
      ) : null}
    </form>
  );
}
