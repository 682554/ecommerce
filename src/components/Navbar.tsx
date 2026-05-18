"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Kids", href: "/kids" },
  { label: "Collections", href: "/collections" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-zinc-200 bg-white"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" aria-label="Nike Home">
          <Image
            src="/nike-logo.svg"
            alt="Nike"
            width={60}
            height={22}
            priority
          />
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden items-center gap-8 md:flex" role="list">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-500"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-label="Search"
            className="hidden text-zinc-900 transition-colors hover:text-zinc-500 md:block"
          >
            <Image
              src="/icons/search.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
            />
            <span className="sr-only">Search</span>
          </button>

          <Link
            href="/cart"
            className="hidden text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-500 md:block"
          >
            My Cart
          </Link>

          {/* Mobile Hamburger */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="text-zinc-900 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Image
              src={mobileMenuOpen ? "/icons/close.svg" : "/icons/menu.svg"}
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-4 pt-4" role="list">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block text-base font-medium text-zinc-900 transition-colors hover:text-zinc-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-6 border-t border-zinc-200 pt-4">
            <button
              type="button"
              aria-label="Search"
              className="flex items-center gap-2 text-sm font-medium text-zinc-900"
            >
              <Image
                src="/icons/search.svg"
                alt=""
                width={18}
                height={18}
                aria-hidden="true"
              />
              Search
            </button>
            <Link
              href="/cart"
              className="text-sm font-medium text-zinc-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Cart
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
