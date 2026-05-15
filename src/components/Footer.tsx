import Image from "next/image";
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
  { name: "X", icon: "/icons/x.svg", href: "https://x.com/nike" },
  {
    name: "Facebook",
    icon: "/icons/facebook.svg",
    href: "https://facebook.com/nike",
  },
  {
    name: "Instagram",
    icon: "/icons/instagram.svg",
    href: "https://instagram.com/nike",
  },
];

const bottomLinks = [
  { label: "Guides", href: "/guides" },
  { label: "Terms of Sale", href: "/terms-of-sale" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Nike Privacy Policy", href: "/privacy-policy" },
];

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400" role="contentinfo">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" aria-label="Nike Home">
              <Image
                src="/nike-logo.svg"
                alt="Nike"
                width={60}
                height={22}
                className="invert"
              />
            </Link>
          </div>

          {/* Link Columns */}
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
                        className="text-sm transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex items-start gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:text-white"
              >
                <Image
                  src={social.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="invert opacity-70 transition-opacity hover:opacity-100"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-800">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Location & Copyright */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Image
                src="/icons/location.svg"
                alt=""
                width={14}
                height={14}
                className="invert opacity-60"
                aria-hidden="true"
              />
              Croatia
            </span>
            <span>&copy; {new Date().getFullYear()} Nike, Inc. All Rights Reserved</span>
          </div>

          {/* Bottom Links */}
          <ul className="flex flex-wrap items-center gap-4" role="list">
            {bottomLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-xs text-zinc-500 transition-colors hover:text-white"
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
