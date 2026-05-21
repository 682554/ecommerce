"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Men", href: "/products?gender=men" },
  { label: "Women", href: "/products?gender=women" },
  { label: "Kids", href: "/products?gender=kids" },
  { label: "Collections", href: "/products?sort=featured" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/10 bg-black/65 backdrop-blur-xl"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Nike Home">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06]">
              <svg
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
              >
                <path
                  d="M8 20L16 28L32 12"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/55">
                Nike Store
              </p>
              <p className="text-sm font-semibold text-white">
                Premium movement gear
              </p>
            </div>
          </div>
        </Link>

        <ul className="hidden items-center gap-8 md:flex" role="list">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-label="Search"
            className="hidden text-sm font-medium text-white/80 transition-colors hover:text-white md:block"
          >
            Search
          </button>

          <Link
            href="/cart"
            className="hidden rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white md:block"
          >
            Cart
          </Link>

          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="text-xl text-white md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
              >
                <path
                  d="M5 5L15 15M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
              >
                <path
                  d="M3.5 5.5H16.5M3.5 10H16.5M3.5 14.5H16.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-black/90 px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-4 pt-4" role="list">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
