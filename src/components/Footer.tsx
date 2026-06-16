import Link from "next/link";

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

const columns: FooterColumn[] = [
  {
    title: "Featured",
    links: [
      { label: "Air Force 1", href: "/featured/air-force-1" },
      { label: "Huarache", href: "/featured/huarache" },
      { label: "Air Max 90", href: "/featured/air-max-90" },
      { label: "Air Max 95", href: "/featured/air-max-95" },
    ],
  },
  {
    title: "Shoes",
    links: [
      { label: "All Shoes", href: "/shoes" },
      { label: "Custom Shoes", href: "/shoes/custom" },
      { label: "Jordan Shoes", href: "/shoes/jordan" },
      { label: "Running Shoes", href: "/shoes/running" },
    ],
  },
  {
    title: "Clothing",
    links: [
      { label: "All Clothing", href: "/clothing" },
      { label: "Modest Wear", href: "/clothing/modest-wear" },
      { label: "Hoodies & Pullovers", href: "/clothing/hoodies" },
      { label: "Shirts & Tops", href: "/clothing/shirts" },
    ],
  },
  {
    title: "Kids'",
    links: [
      { label: "Infant & Toddler Shoes", href: "/kids/infant-toddler" },
      { label: "Kids' Shoes", href: "/kids/shoes" },
      { label: "Kids' Jordan Shoes", href: "/kids/jordan" },
      { label: "Kids' Basketball Shoes", href: "/kids/basketball" },
    ],
  },
];

const socialLinks = [
  { name: "X", label: "X", href: "https://x.com/nike" },
  { name: "Facebook", label: "Fb", href: "https://facebook.com/nike" },
  { name: "Instagram", label: "Ig", href: "https://instagram.com/nike" },
];

const bottomLinks = [
  { label: "Guides", href: "/guides" },
  { label: "Terms of Sale", href: "/terms-of-sale" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Nike Privacy Policy", href: "/privacy-policy" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/80" role="contentinfo">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="shrink-0">
            <Link href="/" aria-label="Nike Home">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-black"
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
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-400">
              Built for motion, styled for the street, and now presented with a
              more polished storefront rhythm.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                  {column.title}
                </h3>
                <ul className="space-y-3" role="list">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-neutral-300 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-neutral-800 pt-8">
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-sm font-semibold text-white/60 transition-colors hover:border-white/25 hover:text-white"
                aria-label={link.name}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <span>Global</span>
            <span>Shipping-ready</span>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800 bg-neutral-950/50 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 text-center text-sm text-neutral-400">
            © 2026 Nike, Inc. All Rights Reserved
          </div>
          <ul
            className="flex flex-wrap justify-center gap-6 text-sm text-neutral-400"
            role="list"
          >
            {bottomLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
