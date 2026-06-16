import "dotenv/config";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { db } from "./index";
import {
  brands,
  categories,
  collections,
  colors,
  coupons,
  genders,
  productCollections,
  productImages,
  products,
  productVariants,
  sizes,
} from "./schema";

type ArtworkSilhouette =
  | "runner"
  | "court"
  | "basketball"
  | "hoodie"
  | "joggers"
  | "tee"
  | "shorts"
  | "jacket"
  | "cap"
  | "socks"
  | "slides"
  | "backpack";

type ArtworkDirection = {
  eyebrow: string;
  gradientFrom: string;
  gradientTo: string;
  accent: string;
  accentSoft: string;
  silhouette: ArtworkSilhouette;
};

type SeedProductDefinition = {
  slug: string;
  name: string;
  description: string;
  categorySlug: string;
  genderSlug: string;
  brandSlug: string;
  basePrice: string;
  salePrice?: string;
  colors: string[];
  sizes: string[];
  collections: string[];
  imageKey: string;
  artwork: ArtworkDirection;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
};

const projectRoot = process.cwd();
const sourceShoesDir = path.join(projectRoot, "public", "shoes");
const legacyShoesDir = path.join(projectRoot, "public", "public", "shoes");
const fallbackPhotosDir = path.join(projectRoot, "public", "products", "photos");
const uploadsRootDir = path.join(
  projectRoot,
  "public",
  "static",
  "uploads",
  "products",
);

const genderSeeds = [
  { label: "Men", slug: "men" },
  { label: "Women", slug: "women" },
  { label: "Kids", slug: "kids" },
  { label: "Unisex", slug: "unisex" },
];

const brandSeeds = [
  { name: "Nike", slug: "nike", logoUrl: "/nike-logo.svg" },
  { name: "Jordan", slug: "jordan", logoUrl: "/nike-logo.svg" },
];

const colorSeeds = [
  { name: "Black", slug: "black", hexCode: "#111111" },
  { name: "White", slug: "white", hexCode: "#F5F5F5" },
  { name: "University Red", slug: "university-red", hexCode: "#C1121F" },
  { name: "Royal Blue", slug: "royal-blue", hexCode: "#1D4ED8" },
  { name: "Volt", slug: "volt", hexCode: "#D9F99D" },
  { name: "Orange", slug: "orange", hexCode: "#F97316" },
  { name: "Stone", slug: "stone", hexCode: "#D6D3D1" },
  { name: "Carbon Grey", slug: "carbon-grey", hexCode: "#6B7280" },
];

const sizeSeeds = [
  { name: "XS", slug: "xs", sortOrder: 10 },
  { name: "S", slug: "s", sortOrder: 20 },
  { name: "M", slug: "m", sortOrder: 30 },
  { name: "L", slug: "l", sortOrder: 40 },
  { name: "XL", slug: "xl", sortOrder: 50 },
  { name: "7", slug: "7", sortOrder: 70 },
  { name: "8", slug: "8", sortOrder: 80 },
  { name: "9", slug: "9", sortOrder: 90 },
  { name: "10", slug: "10", sortOrder: 100 },
  { name: "11", slug: "11", sortOrder: 110 },
  { name: "12", slug: "12", sortOrder: 120 },
  { name: "One Size", slug: "one-size", sortOrder: 1000 },
];

const categorySeeds = [
  { name: "Shoes", slug: "shoes", parentSlug: null },
  { name: "Running Shoes", slug: "running-shoes", parentSlug: "shoes" },
  { name: "Lifestyle Shoes", slug: "lifestyle-shoes", parentSlug: "shoes" },
  { name: "Training Shoes", slug: "training-shoes", parentSlug: "shoes" },
  { name: "Basketball Shoes", slug: "basketball-shoes", parentSlug: "shoes" },
  { name: "Clothing", slug: "clothing", parentSlug: null },
  { name: "Hoodies", slug: "hoodies", parentSlug: "clothing" },
  { name: "Joggers", slug: "joggers", parentSlug: "clothing" },
  { name: "T-Shirts", slug: "t-shirts", parentSlug: "clothing" },
  { name: "Shorts", slug: "shorts", parentSlug: "clothing" },
  { name: "Jackets", slug: "jackets", parentSlug: "clothing" },
  { name: "Accessories", slug: "accessories", parentSlug: null },
  { name: "Headwear", slug: "headwear", parentSlug: "accessories" },
  { name: "Socks", slug: "socks", parentSlug: "accessories" },
  { name: "Bags", slug: "bags", parentSlug: "accessories" },
];

const collectionSeeds = [
  { name: "Summer '25", slug: "summer-25" },
  { name: "Running Essentials", slug: "running-essentials" },
  { name: "Street Icons", slug: "street-icons" },
  { name: "Training Core", slug: "training-core" },
  { name: "Weekend Rotation", slug: "weekend-rotation" },
];

const couponSeeds = [
  {
    code: "WELCOME10",
    discountType: "percentage" as const,
    discountValue: "10.00",
    expiresAt: new Date("2027-01-31T23:59:59Z"),
    maxUsage: 500,
    usedCount: 0,
  },
  {
    code: "FREESHIP25",
    discountType: "fixed" as const,
    discountValue: "25.00",
    expiresAt: new Date("2026-12-31T23:59:59Z"),
    maxUsage: 250,
    usedCount: 0,
  },
  {
    code: "RUNCLUB15",
    discountType: "percentage" as const,
    discountValue: "15.00",
    expiresAt: new Date("2026-10-31T23:59:59Z"),
    maxUsage: 150,
    usedCount: 0,
  },
];

const seedProducts: SeedProductDefinition[] = [
  {
    slug: "nike-air-max-90",
    name: "Nike Air Max 90",
    description:
      "A heritage Nike icon with visible Air cushioning and durable leather overlays for daily wear.",
    categorySlug: "lifestyle-shoes",
    genderSlug: "unisex",
    brandSlug: "nike",
    basePrice: "130.00",
    colors: ["white", "carbon-grey", "university-red"],
    sizes: ["8", "9", "10", "11", "12"],
    collections: ["street-icons", "summer-25"],
    imageKey: "nike-air-max-90.png",
    artwork: {
      eyebrow: "AIR ICON",
      gradientFrom: "#0b1020",
      gradientTo: "#3b82f6",
      accent: "#f97316",
      accentSoft: "#fed7aa",
      silhouette: "runner",
    },
    weight: 0.92,
    dimensions: { length: 34, width: 22, height: 12 },
  },
  {
    slug: "nike-air-force-1-07",
    name: "Nike Air Force 1 '07",
    description:
      "The basketball original with crisp leather, bold proportions, and timeless everyday versatility.",
    categorySlug: "lifestyle-shoes",
    genderSlug: "unisex",
    brandSlug: "nike",
    basePrice: "115.00",
    colors: ["white", "black"],
    sizes: ["8", "9", "10", "11", "12"],
    collections: ["street-icons", "weekend-rotation"],
    imageKey: "nike-air-force-1-07.png",
    artwork: {
      eyebrow: "COURT LEGEND",
      gradientFrom: "#111827",
      gradientTo: "#4b5563",
      accent: "#f9fafb",
      accentSoft: "#d1d5db",
      silhouette: "court",
    },
    weight: 0.95,
    dimensions: { length: 34, width: 22, height: 12 },
  },
  {
    slug: "nike-dunk-low-retro",
    name: "Nike Dunk Low Retro",
    description:
      "Low-profile street staple with classic color blocking and a padded collar for all-day comfort.",
    categorySlug: "lifestyle-shoes",
    genderSlug: "men",
    brandSlug: "nike",
    basePrice: "115.00",
    colors: ["university-red", "black", "royal-blue"],
    sizes: ["8", "9", "10", "11", "12"],
    collections: ["street-icons"],
    imageKey: "nike-dunk-low-retro.png",
    artwork: {
      eyebrow: "RETRO DROP",
      gradientFrom: "#2b0b13",
      gradientTo: "#7f1d1d",
      accent: "#f87171",
      accentSoft: "#fecaca",
      silhouette: "court",
    },
    weight: 0.88,
    dimensions: { length: 33, width: 21, height: 12 },
  },
  {
    slug: "nike-air-zoom-pegasus-41",
    name: "Nike Air Zoom Pegasus 41",
    description:
      "Responsive daily mileage shoe balancing bounce, support, and comfort across road sessions.",
    categorySlug: "running-shoes",
    genderSlug: "men",
    brandSlug: "nike",
    basePrice: "140.00",
    salePrice: "124.00",
    colors: ["volt", "black", "royal-blue"],
    sizes: ["8", "9", "10", "11", "12"],
    collections: ["running-essentials", "summer-25"],
    imageKey: "nike-air-zoom-pegasus-41.png",
    artwork: {
      eyebrow: "ROAD SPEED",
      gradientFrom: "#0f172a",
      gradientTo: "#14532d",
      accent: "#bef264",
      accentSoft: "#ecfccb",
      silhouette: "runner",
    },
    weight: 0.79,
    dimensions: { length: 35, width: 23, height: 13 },
  },
  {
    slug: "nike-vomero-18",
    name: "Nike Vomero 18",
    description:
      "Plush cushioning platform built for recovery miles and runners who prioritize softness.",
    categorySlug: "running-shoes",
    genderSlug: "women",
    brandSlug: "nike",
    basePrice: "160.00",
    colors: ["stone", "orange"],
    sizes: ["8", "9", "10", "11"],
    collections: ["running-essentials"],
    imageKey: "nike-vomero-18.png",
    artwork: {
      eyebrow: "SOFT MILES",
      gradientFrom: "#271814",
      gradientTo: "#9a3412",
      accent: "#fdba74",
      accentSoft: "#ffedd5",
      silhouette: "runner",
    },
    weight: 0.82,
    dimensions: { length: 35, width: 23, height: 13 },
  },
  {
    slug: "nike-structure-25",
    name: "Nike Structure 25",
    description:
      "Supportive running shoe engineered for steady transitions and reliable control on longer runs.",
    categorySlug: "running-shoes",
    genderSlug: "men",
    brandSlug: "nike",
    basePrice: "145.00",
    colors: ["white", "royal-blue"],
    sizes: ["8", "9", "10", "11", "12"],
    collections: ["running-essentials"],
    imageKey: "nike-structure-25.png",
    artwork: {
      eyebrow: "STABILITY",
      gradientFrom: "#08111f",
      gradientTo: "#1d4ed8",
      accent: "#93c5fd",
      accentSoft: "#dbeafe",
      silhouette: "runner",
    },
    weight: 0.83,
    dimensions: { length: 35, width: 23, height: 13 },
  },
  {
    slug: "nike-metcon-9",
    name: "Nike Metcon 9",
    description:
      "Stable training shoe with a wider heel and tough upper built for lifting and conditioning.",
    categorySlug: "training-shoes",
    genderSlug: "unisex",
    brandSlug: "nike",
    basePrice: "150.00",
    colors: ["black", "orange"],
    sizes: ["8", "9", "10", "11", "12"],
    collections: ["training-core"],
    imageKey: "nike-metcon-9.png",
    artwork: {
      eyebrow: "GYM READY",
      gradientFrom: "#1c1917",
      gradientTo: "#ea580c",
      accent: "#fb923c",
      accentSoft: "#ffedd5",
      silhouette: "runner",
    },
    weight: 0.9,
    dimensions: { length: 34, width: 22, height: 12 },
  },
  {
    slug: "jordan-1-low",
    name: "Jordan 1 Low",
    description:
      "A lower-cut take on the AJ1 with premium leather and instantly recognizable Jordan DNA.",
    categorySlug: "basketball-shoes",
    genderSlug: "unisex",
    brandSlug: "jordan",
    basePrice: "125.00",
    colors: ["black", "university-red", "white"],
    sizes: ["8", "9", "10", "11", "12"],
    collections: ["street-icons", "summer-25"],
    imageKey: "jordan-1-low.png",
    artwork: {
      eyebrow: "JORDAN DNA",
      gradientFrom: "#19090d",
      gradientTo: "#7f1d1d",
      accent: "#ef4444",
      accentSoft: "#fee2e2",
      silhouette: "basketball",
    },
    weight: 0.93,
    dimensions: { length: 34, width: 22, height: 12 },
  },
  {
    slug: "nike-sportswear-club-fleece-hoodie",
    name: "Nike Sportswear Club Fleece Hoodie",
    description:
      "Brushed-back fleece hoodie with relaxed structure and dependable warmth for daily layering.",
    categorySlug: "hoodies",
    genderSlug: "unisex",
    brandSlug: "nike",
    basePrice: "65.00",
    colors: ["carbon-grey", "black", "stone"],
    sizes: ["S", "M", "L", "XL"],
    collections: ["street-icons", "training-core"],
    imageKey: "nike-sportswear-club-fleece-hoodie.png",
    artwork: {
      eyebrow: "FLEECE CLUB",
      gradientFrom: "#111827",
      gradientTo: "#475569",
      accent: "#cbd5e1",
      accentSoft: "#f8fafc",
      silhouette: "hoodie",
    },
    weight: 0.62,
    dimensions: { length: 32, width: 27, height: 5 },
  },
  {
    slug: "nike-tech-fleece-joggers",
    name: "Nike Tech Fleece Joggers",
    description:
      "Streamlined Tech Fleece joggers with a tapered fit and lightweight insulation for everyday wear.",
    categorySlug: "joggers",
    genderSlug: "men",
    brandSlug: "nike",
    basePrice: "110.00",
    colors: ["black", "carbon-grey"],
    sizes: ["S", "M", "L", "XL"],
    collections: ["training-core", "weekend-rotation"],
    imageKey: "nike-tech-fleece-joggers.png",
    artwork: {
      eyebrow: "TECH FLEECE",
      gradientFrom: "#0f172a",
      gradientTo: "#334155",
      accent: "#e2e8f0",
      accentSoft: "#f8fafc",
      silhouette: "joggers",
    },
    weight: 0.55,
    dimensions: { length: 31, width: 25, height: 4 },
  },
  {
    slug: "nike-pro-dri-fit-tee",
    name: "Nike Pro Dri-FIT T-Shirt",
    description:
      "Sweat-wicking performance tee cut for training sessions, layering, and everyday gym use.",
    categorySlug: "t-shirts",
    genderSlug: "men",
    brandSlug: "nike",
    basePrice: "35.00",
    colors: ["black", "white", "royal-blue"],
    sizes: ["S", "M", "L", "XL"],
    collections: ["training-core", "summer-25"],
    imageKey: "nike-pro-dri-fit-tee.png",
    artwork: {
      eyebrow: "PRO LAYER",
      gradientFrom: "#08111f",
      gradientTo: "#1e293b",
      accent: "#93c5fd",
      accentSoft: "#dbeafe",
      silhouette: "tee",
    },
    weight: 0.18,
    dimensions: { length: 29, width: 23, height: 2 },
  },
  {
    slug: "nike-club-flow-shorts",
    name: "Nike Club Flow Shorts",
    description:
      "Easy-wearing woven shorts designed for warm weather, active days, and casual movement.",
    categorySlug: "shorts",
    genderSlug: "men",
    brandSlug: "nike",
    basePrice: "50.00",
    colors: ["black", "orange", "stone"],
    sizes: ["S", "M", "L", "XL"],
    collections: ["summer-25", "weekend-rotation"],
    imageKey: "nike-club-flow-shorts.png",
    artwork: {
      eyebrow: "SUMMER FLOW",
      gradientFrom: "#1c1917",
      gradientTo: "#c2410c",
      accent: "#fdba74",
      accentSoft: "#ffedd5",
      silhouette: "shorts",
    },
    weight: 0.21,
    dimensions: { length: 26, width: 22, height: 2 },
  },
  {
    slug: "nike-windrunner-jacket",
    name: "Nike Windrunner Jacket",
    description:
      "Lightweight outer layer inspired by the original chevron design, updated for daily city wear.",
    categorySlug: "jackets",
    genderSlug: "unisex",
    brandSlug: "nike",
    basePrice: "120.00",
    colors: ["black", "royal-blue"],
    sizes: ["S", "M", "L", "XL"],
    collections: ["summer-25", "street-icons"],
    imageKey: "nike-windrunner-jacket.png",
    artwork: {
      eyebrow: "WINDRUNNER",
      gradientFrom: "#111827",
      gradientTo: "#2563eb",
      accent: "#60a5fa",
      accentSoft: "#dbeafe",
      silhouette: "jacket",
    },
    weight: 0.39,
    dimensions: { length: 31, width: 25, height: 3 },
  },
  {
    slug: "nike-heritage86-cap",
    name: "Nike Heritage86 Cap",
    description:
      "Classic six-panel cap with curved brim and embroidered logo for easy everyday styling.",
    categorySlug: "headwear",
    genderSlug: "unisex",
    brandSlug: "nike",
    basePrice: "28.00",
    colors: ["black", "stone", "orange"],
    sizes: ["One Size"],
    collections: ["summer-25", "weekend-rotation"],
    imageKey: "nike-heritage86-cap.png",
    artwork: {
      eyebrow: "HEADWEAR",
      gradientFrom: "#1f2937",
      gradientTo: "#52525b",
      accent: "#fde68a",
      accentSoft: "#fef3c7",
      silhouette: "cap",
    },
    weight: 0.12,
    dimensions: { length: 23, width: 19, height: 12 },
  },
  {
    slug: "nike-everyday-cushioned-socks",
    name: "Nike Everyday Cushioned Crew Socks",
    description:
      "Multi-purpose cushioned socks with sweat-wicking yarn and ribbed arch support.",
    categorySlug: "socks",
    genderSlug: "unisex",
    brandSlug: "nike",
    basePrice: "22.00",
    colors: ["white", "black"],
    sizes: ["S", "M", "L"],
    collections: ["training-core", "running-essentials"],
    imageKey: "nike-everyday-cushioned-socks.png",
    artwork: {
      eyebrow: "DAILY ESSENTIAL",
      gradientFrom: "#0f172a",
      gradientTo: "#64748b",
      accent: "#e5e7eb",
      accentSoft: "#f8fafc",
      silhouette: "socks",
    },
    weight: 0.08,
    dimensions: { length: 18, width: 10, height: 3 },
  },
  {
    slug: "nike-court-vision-low",
    name: "Nike Court Vision Low",
    description:
      "A clean low-top built on classic basketball lines with everyday comfort and easy styling.",
    categorySlug: "lifestyle-shoes",
    genderSlug: "men",
    brandSlug: "nike",
    basePrice: "95.00",
    colors: ["white", "black", "royal-blue"],
    sizes: ["8", "9", "10", "11", "12"],
    collections: ["street-icons", "weekend-rotation"],
    imageKey: "nike-court-vision-low.png",
    artwork: {
      eyebrow: "LOW PROFILE",
      gradientFrom: "#0f172a",
      gradientTo: "#1d4ed8",
      accent: "#e5e7eb",
      accentSoft: "#ffffff",
      silhouette: "court",
    },
    weight: 0.86,
    dimensions: { length: 33, width: 21, height: 12 },
  },
  {
    slug: "nike-kawa-slide",
    name: "Nike Kawa Slide",
    description:
      "Soft foam recovery slide designed for off-duty comfort after training and travel.",
    categorySlug: "lifestyle-shoes",
    genderSlug: "unisex",
    brandSlug: "nike",
    basePrice: "40.00",
    colors: ["black", "white", "orange"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    collections: ["summer-25", "weekend-rotation"],
    imageKey: "nike-kawa-slide.png",
    artwork: {
      eyebrow: "RECOVERY",
      gradientFrom: "#1c1917",
      gradientTo: "#f97316",
      accent: "#fed7aa",
      accentSoft: "#fff7ed",
      silhouette: "slides",
    },
    weight: 0.44,
    dimensions: { length: 32, width: 20, height: 10 },
  },
  {
    slug: "nike-academy-dri-fit-track-jacket",
    name: "Nike Academy Dri-FIT Track Jacket",
    description:
      "A streamlined zip jacket built for warm-ups, travel, and everyday team style.",
    categorySlug: "jackets",
    genderSlug: "women",
    brandSlug: "nike",
    basePrice: "85.00",
    colors: ["black", "royal-blue", "white"],
    sizes: ["S", "M", "L", "XL"],
    collections: ["training-core", "running-essentials"],
    imageKey: "nike-academy-dri-fit-track-jacket.png",
    artwork: {
      eyebrow: "ACADEMY",
      gradientFrom: "#0b1120",
      gradientTo: "#1d4ed8",
      accent: "#93c5fd",
      accentSoft: "#eff6ff",
      silhouette: "jacket",
    },
    weight: 0.42,
    dimensions: { length: 30, width: 24, height: 3 },
  },
  {
    slug: "jordan-flight-essentials-tee",
    name: "Jordan Flight Essentials Tee",
    description:
      "Premium cotton jersey tee carrying Jordan attitude through a relaxed everyday fit.",
    categorySlug: "t-shirts",
    genderSlug: "men",
    brandSlug: "jordan",
    basePrice: "45.00",
    colors: ["black", "university-red", "white"],
    sizes: ["S", "M", "L", "XL"],
    collections: ["street-icons", "weekend-rotation"],
    imageKey: "jordan-flight-essentials-tee.png",
    artwork: {
      eyebrow: "FLIGHT",
      gradientFrom: "#1f0a0d",
      gradientTo: "#991b1b",
      accent: "#fca5a5",
      accentSoft: "#fee2e2",
      silhouette: "tee",
    },
    weight: 0.2,
    dimensions: { length: 28, width: 22, height: 2 },
  },
  {
    slug: "nike-elemental-backpack",
    name: "Nike Elemental Backpack",
    description:
      "An everyday carry backpack with organized storage, padded straps, and commuter-friendly durability.",
    categorySlug: "bags",
    genderSlug: "unisex",
    brandSlug: "nike",
    basePrice: "65.00",
    colors: ["black", "stone", "royal-blue"],
    sizes: ["One Size"],
    collections: ["training-core", "weekend-rotation"],
    imageKey: "nike-elemental-backpack.png",
    artwork: {
      eyebrow: "EVERYDAY CARRY",
      gradientFrom: "#111827",
      gradientTo: "#374151",
      accent: "#cbd5e1",
      accentSoft: "#f8fafc",
      silhouette: "backpack",
    },
    weight: 0.65,
    dimensions: { length: 46, width: 31, height: 17 },
  },
];

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function chunkText(value: string, maxLength: number) {
  const words = value.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxLength) {
      current = next;
      continue;
    }

    if (current) {
      lines.push(current);
    }
    current = word;
  }

  if (current) {
    lines.push(current);
  }

  return lines.slice(0, 2);
}

function renderSilhouette(
  silhouette: ArtworkSilhouette,
  accent: string,
  accentSoft: string,
) {
  const stroke = "rgba(255,255,255,0.22)";

  switch (silhouette) {
    case "runner":
      return `
        <g transform="translate(205 275) rotate(-8 420 290)">
          <path d="M90 340c35-116 136-197 282-219l136-11c48 0 85 24 106 68l35 72c14 29 41 46 79 51l61 8c15 2 26 15 26 30v34H728l-72-3-62-56-182 7-78 52H132c-36 0-55-14-42-33z" fill="${accent}" />
          <path d="M263 147c55-65 175-103 270-103 72 0 124 26 158 70l-90 10c-31-20-67-28-112-28-85 0-154 17-226 57z" fill="${accentSoft}" opacity="0.92" />
          <path d="M196 364h163l-62 52H146c-25 0-38-14-20-34zM507 364h196c18 0 32 15 24 31-7 13-27 22-48 22H568z" fill="#0b0b0f" opacity="0.88" />
          <path d="M318 191l138-19c56-8 106 7 150 45" stroke="${stroke}" stroke-width="14" stroke-linecap="round" />
          <path d="M197 318c47-73 119-120 238-146" stroke="${stroke}" stroke-width="12" stroke-linecap="round" opacity="0.8" />
        </g>
      `;
    case "court":
      return `
        <g transform="translate(220 300) rotate(-6 395 255)">
          <path d="M110 318c58-74 127-126 208-161l139-61c53-24 107-21 158 8l102 58c34 19 74 28 113 25l62-4v49H774l-94 6-85-37-185 29-93 54H120c-22 0-30-20-10-34z" fill="${accent}" />
          <path d="M305 136c110-34 200-37 279-4l-100 46c-43-10-87-10-146 1z" fill="${accentSoft}" opacity="0.95" />
          <path d="M177 329h188l-64 48H149c-18 0-27-16-12-28zM525 287l141-28 87 33c16 6 27 18 28 32H605z" fill="#0b0b0f" opacity="0.88" />
          <path d="M281 226l116-52c52-22 111-18 172 15" stroke="${stroke}" stroke-width="13" stroke-linecap="round" />
          <path d="M198 301c58-66 119-112 193-145" stroke="${stroke}" stroke-width="10" stroke-linecap="round" opacity="0.78" />
        </g>
      `;
    case "basketball":
      return `
        <g transform="translate(214 240) rotate(-7 400 360)">
          <path d="M120 450c51-157 141-262 306-335l112-48c61-26 119-23 170 9l56 36c40 26 59 70 59 132v194H566l-118-79-102 79H152c-33 0-48-26-32-53z" fill="${accent}" />
          <path d="M307 151c80-73 182-113 289-111 64 2 116 20 154 55l-84 39c-31-17-72-26-118-26-72 0-145 16-241 43z" fill="${accentSoft}" opacity="0.94" />
          <path d="M217 469h162l-63 61H166c-23 0-34-19-18-35zM534 451h198v75H608z" fill="#0b0b0f" opacity="0.9" />
          <path d="M356 223c98-32 181-39 271-9" stroke="${stroke}" stroke-width="14" stroke-linecap="round" />
          <path d="M238 338c54-90 120-150 222-205" stroke="${stroke}" stroke-width="11" stroke-linecap="round" opacity="0.8" />
        </g>
      `;
    case "hoodie":
      return `
        <g transform="translate(200 250)">
          <path d="M360 70c75 0 135 61 135 136 0 43-19 82-50 108l32 307H241l32-307c-31-26-50-65-50-108 0-75 61-136 137-136z" fill="${accent}" />
          <path d="M361 105c41 0 74 33 74 74s-33 74-74 74-74-33-74-74 33-74 74-74z" fill="${accentSoft}" opacity="0.9" />
          <path d="M253 304h214" stroke="${stroke}" stroke-width="14" stroke-linecap="round" />
          <path d="M290 619l18-192h107l18 192" stroke="#0b0b0f" stroke-width="16" stroke-linecap="round" opacity="0.7" />
          <path d="M201 240l69 53M520 240l-69 53" stroke="${stroke}" stroke-width="18" stroke-linecap="round" />
        </g>
      `;
    case "joggers":
      return `
        <g transform="translate(235 180)">
          <path d="M223 56h184l32 224-52 384H268l-51-384z" fill="${accent}" />
          <path d="M261 106h108l23 139-77 118-76-118z" fill="${accentSoft}" opacity="0.84" />
          <path d="M252 494h52M419 494h52M267 635h71M381 635h71" stroke="#0b0b0f" stroke-width="16" stroke-linecap="round" opacity="0.7" />
          <path d="M244 88h142" stroke="${stroke}" stroke-width="14" stroke-linecap="round" />
        </g>
      `;
    case "tee":
      return `
        <g transform="translate(210 238)">
          <path d="M301 60h117l98 63-39 83-61-34v423H302V172l-61 34-39-83z" fill="${accent}" />
          <path d="M337 84c14 28 35 41 70 41 34 0 56-13 70-41" stroke="${accentSoft}" stroke-width="20" stroke-linecap="round" />
          <path d="M303 297h114" stroke="${stroke}" stroke-width="14" stroke-linecap="round" />
          <path d="M268 580h184" stroke="#0b0b0f" stroke-width="16" stroke-linecap="round" opacity="0.55" />
        </g>
      `;
    case "shorts":
      return `
        <g transform="translate(255 240)">
          <path d="M221 96h216l24 171-69 83H266l-69-83z" fill="${accent}" />
          <path d="M252 128h154l20 114-68 77-67-77z" fill="${accentSoft}" opacity="0.88" />
          <path d="M221 96h216" stroke="${stroke}" stroke-width="14" stroke-linecap="round" />
          <path d="M324 350v116M386 350v116" stroke="#0b0b0f" stroke-width="14" stroke-linecap="round" opacity="0.68" />
        </g>
      `;
    case "jacket":
      return `
        <g transform="translate(198 214)">
          <path d="M315 46h94l117 90-48 119-57-32v386H303V223l-57 32-48-119z" fill="${accent}" />
          <path d="M315 46l47 130 47-130" fill="${accentSoft}" opacity="0.85" />
          <path d="M294 229h136" stroke="${stroke}" stroke-width="14" stroke-linecap="round" />
          <path d="M362 176v433" stroke="#0b0b0f" stroke-width="16" stroke-linecap="round" opacity="0.72" />
          <path d="M219 140l85 58M505 140l-85 58" stroke="${stroke}" stroke-width="16" stroke-linecap="round" />
        </g>
      `;
    case "cap":
      return `
        <g transform="translate(220 305)">
          <path d="M117 198c0-102 108-184 241-184 135 0 243 82 243 184 0 39-16 74-43 103H159c-27-29-42-64-42-103z" fill="${accent}" />
          <path d="M226 108c44-29 87-41 131-41 81 0 145 41 182 103H226z" fill="${accentSoft}" opacity="0.9" />
          <path d="M153 301h410c-49 63-117 101-206 101-88 0-155-38-204-101z" fill="#0b0b0f" opacity="0.75" />
          <path d="M196 263c74-34 168-49 273-35" stroke="${stroke}" stroke-width="14" stroke-linecap="round" />
        </g>
      `;
    case "socks":
      return `
        <g transform="translate(260 205)">
          <path d="M184 64h95v241c0 76-51 139-127 157l-44 10v-90l22-6c34-9 54-38 54-72z" fill="${accent}" />
          <path d="M377 64h95v241c0 76-51 139-127 157l-44 10v-90l22-6c34-9 54-38 54-72z" fill="${accentSoft}" />
          <path d="M184 146h95M377 146h95" stroke="${stroke}" stroke-width="16" stroke-linecap="round" />
          <path d="M127 463c33 15 62 20 87 20M320 463c33 15 62 20 87 20" stroke="#0b0b0f" stroke-width="16" stroke-linecap="round" opacity="0.6" />
        </g>
      `;
    case "slides":
      return `
        <g transform="translate(224 318) rotate(-8 375 214)">
          <path d="M115 264c41-80 112-135 227-173l182-59c32-10 67 8 77 41l20 62c9 28-9 58-38 65L308 267H115z" fill="${accent}" />
          <path d="M233 165l247-81" stroke="${accentSoft}" stroke-width="34" stroke-linecap="round" opacity="0.82" />
          <path d="M126 268h190l-58 44H115c-17 0-26-22-11-44z" fill="#0b0b0f" opacity="0.82" />
        </g>
      `;
    case "backpack":
      return `
        <g transform="translate(214 190)">
          <path d="M290 86c0-57 47-104 104-104s104 47 104 104v38h24c58 0 106 48 106 106v323H184V230c0-58 47-106 106-106h24z" fill="${accent}" />
          <path d="M335 127V86c0-32 26-58 59-58s59 26 59 58v41" stroke="${accentSoft}" stroke-width="24" stroke-linecap="round" />
          <path d="M246 259h296" stroke="${stroke}" stroke-width="16" stroke-linecap="round" />
          <rect x="280" y="304" width="228" height="171" rx="28" fill="${accentSoft}" opacity="0.86" />
          <path d="M356 381h76" stroke="#0b0b0f" stroke-width="14" stroke-linecap="round" opacity="0.64" />
        </g>
      `;
  }
}

function renderProductArtwork(product: SeedProductDefinition) {
  const lines = chunkText(product.name, 18);
  const escapedName = lines.map(escapeXml);
  const escapedEyebrow = escapeXml(product.artwork.eyebrow);
  const escapedSlug = escapeXml(product.slug.replaceAll("-", " "));
  const escapedBrand = escapeXml(product.brandSlug.toUpperCase());

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1600" height="1800" viewBox="0 0 1600 1800" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="160" y1="180" x2="1420" y2="1620" gradientUnits="userSpaceOnUse">
      <stop stop-color="${product.artwork.gradientFrom}" />
      <stop offset="1" stop-color="${product.artwork.gradientTo}" />
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1160 310) rotate(127) scale(740 740)">
      <stop stop-color="${product.artwork.accent}" stop-opacity="0.55" />
      <stop offset="1" stop-color="${product.artwork.accent}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glow2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(330 1280) rotate(90) scale(680 680)">
      <stop stop-color="${product.artwork.accentSoft}" stop-opacity="0.18" />
      <stop offset="1" stop-color="${product.artwork.accentSoft}" stop-opacity="0" />
    </radialGradient>
    <filter id="shadow" x="80" y="120" width="1440" height="1500" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="48" stdDeviation="54" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>

  <rect width="1600" height="1800" rx="68" fill="url(#bg)" />
  <rect x="32" y="32" width="1536" height="1736" rx="44" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
  <rect x="80" y="80" width="1440" height="1640" rx="38" fill="rgba(9,9,14,0.22)" />
  <path d="M111 258c149-103 311-161 487-176 195-17 402 18 623 106" stroke="rgba(255,255,255,0.08)" stroke-width="4" stroke-dasharray="12 18" />
  <path d="M155 1294c210-69 412-87 608-56 187 30 360 95 519 196" stroke="rgba(255,255,255,0.08)" stroke-width="4" stroke-dasharray="12 18" />
  <ellipse cx="1160" cy="310" rx="480" ry="480" fill="url(#glow)" />
  <ellipse cx="330" cy="1280" rx="420" ry="420" fill="url(#glow2)" />

  <g filter="url(#shadow)">
    ${renderSilhouette(
      product.artwork.silhouette,
      product.artwork.accent,
      product.artwork.accentSoft,
    )}
  </g>

  <g>
    <path d="M176 196c117-95 262-152 388-152-82 58-157 138-232 239-69 19-119 8-156-35z" fill="rgba(255,255,255,0.13)" />
    <path d="M176 196c117-95 262-152 388-152-82 58-157 138-232 239-69 19-119 8-156-35z" fill="${product.artwork.accentSoft}" opacity="0.18" />
  </g>

  <g>
    <rect x="138" y="1310" width="1324" height="378" rx="40" fill="rgba(4,4,8,0.46)" />
    <rect x="138" y="1310" width="1324" height="378" rx="40" stroke="rgba(255,255,255,0.1)" stroke-width="2" />
    <text x="186" y="1398" fill="rgba(255,255,255,0.64)" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" letter-spacing="10">${escapedEyebrow}</text>
    <text x="186" y="1497" fill="#ffffff" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="88" font-weight="900">${escapedName[0] ?? ""}</text>
    <text x="186" y="1596" fill="#ffffff" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="88" font-weight="900">${escapedName[1] ?? ""}</text>
    <text x="186" y="1660" fill="rgba(255,255,255,0.52)" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" letter-spacing="7">${escapedBrand}</text>
    <text x="1294" y="1660" fill="${product.artwork.accentSoft}" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" letter-spacing="5" text-anchor="end">${escapedSlug}</text>
  </g>
</svg>`;
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientDatabaseError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes("fetch failed") ||
    error.message.includes("Error connecting to database")
  );
}

async function runWithRetry<T>(
  label: string,
  operation: () => Promise<T>,
  attempts = 4,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isTransientDatabaseError(error) || attempt === attempts) {
        throw error;
      }

      const waitMs = attempt * 1200;
      console.warn(
        `${label} failed on attempt ${attempt}/${attempts}. Retrying in ${waitMs}ms...`,
      );
      await sleep(waitMs);
    }
  }

  throw lastError;
}

async function listFiles(dir: string) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => /\.(jpg|jpeg|png|webp|svg)$/i.test(name));
  } catch {
    return [];
  }
}

async function ensureGeneratedProductArtwork() {
  await ensureDir(sourceShoesDir);

  await Promise.all(
    seedProducts.map(async (product) => {
      if (!product.imageKey.endsWith(".svg")) {
        return;
      }

      const outputPath = path.join(sourceShoesDir, product.imageKey);
      const svg = renderProductArtwork(product);
      await fs.writeFile(outputPath, svg, "utf8");
    }),
  );

  console.log(
    `Verified generated source assets in ${sourceShoesDir}`,
  );
}

async function ensureSeedSourceDir() {
  await ensureGeneratedProductArtwork();

  const preferred = await listFiles(sourceShoesDir);
  if (preferred.length > 0) {
    console.log(`Using source images from ${sourceShoesDir}`);
    return sourceShoesDir;
  }

  const legacy = await listFiles(legacyShoesDir);
  if (legacy.length > 0) {
    console.log(`Using source images from legacy folder ${legacyShoesDir}`);
    return legacyShoesDir;
  }

  const fallback = await listFiles(fallbackPhotosDir);
  if (fallback.length === 0) {
    throw new Error(
      "No source product images found in public/shoes or fallback product photo directories.",
    );
  }

  await ensureDir(sourceShoesDir);
  await Promise.all(
    fallback.map(async (fileName) => {
      const target = path.join(sourceShoesDir, fileName);
      try {
        await fs.access(target);
      } catch {
        await fs.copyFile(path.join(fallbackPhotosDir, fileName), target);
      }
    }),
  );

  console.log(
    `Bootstrapped public/shoes with ${fallback.length} local images from ${fallbackPhotosDir}`,
  );

  return sourceShoesDir;
}

async function resetUploadsDir() {
  await fs.rm(uploadsRootDir, { recursive: true, force: true });
  await ensureDir(uploadsRootDir);
}

async function copyImagesForProduct(
  productSlug: string,
  sourceDir: string,
  imageKeys: string[],
) {
  const targetDir = path.join(uploadsRootDir, productSlug);
  await ensureDir(targetDir);

  const uploadedUrls: string[] = [];

  for (const [index, imageKey] of imageKeys.entries()) {
    const sourcePath = path.join(sourceDir, imageKey);
    const ext = path.extname(imageKey) || ".svg";
    const targetFileName = `${String(index + 1).padStart(2, "0")}-${productSlug}${ext}`;
    const targetPath = path.join(targetDir, targetFileName);
    await fs.copyFile(sourcePath, targetPath);
    uploadedUrls.push(`/static/uploads/products/${productSlug}/${targetFileName}`);
  }

  return uploadedUrls;
}

function upperSkuPart(value: string) {
  return value.replace(/[^a-z0-9]+/gi, "-").toUpperCase();
}

function toSlugPart(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

async function clearCommerceTables() {
  console.log("Clearing existing commerce seed data...");
  await runWithRetry("delete product_collections", () => db.delete(productCollections));
  await runWithRetry("delete product_images", () => db.delete(productImages));
  await runWithRetry("delete product_variants", () => db.delete(productVariants));
  await runWithRetry("delete coupons", () => db.delete(coupons));
  await runWithRetry("delete products", () => db.delete(products));
  await runWithRetry("delete collections", () => db.delete(collections));
  await runWithRetry("delete categories", () => db.delete(categories));
  await runWithRetry("delete brands", () => db.delete(brands));
  await runWithRetry("delete genders", () => db.delete(genders));
  await runWithRetry("delete colors", () => db.delete(colors));
  await runWithRetry("delete sizes", () => db.delete(sizes));
}

async function seed() {
  if (seedProducts.length !== 20) {
    throw new Error(
      `Expected 20 unique seed products, received ${seedProducts.length}.`,
    );
  }

  console.log("Starting normalized commerce seed...");
  const sourceDir = await ensureSeedSourceDir();
  await resetUploadsDir();

  await clearCommerceTables();

  console.log("Seeding filters and supporting catalog tables...");
  const insertedGenders = await runWithRetry("insert genders", () =>
    db.insert(genders).values(genderSeeds).returning(),
  );
  const insertedBrands = await runWithRetry("insert brands", () =>
    db.insert(brands).values(brandSeeds).returning(),
  );
  const insertedColors = await runWithRetry("insert colors", () =>
    db.insert(colors).values(colorSeeds).returning(),
  );
  const insertedSizes = await runWithRetry("insert sizes", () =>
    db.insert(sizes).values(sizeSeeds).returning(),
  );
  const insertedCollections = await runWithRetry("insert collections", () =>
    db.insert(collections).values(collectionSeeds).returning(),
  );

  const categoryMap = new Map<string, string>();
  for (const categorySeed of categorySeeds.filter((item) => item.parentSlug === null)) {
    const [category] = await runWithRetry(`insert category ${categorySeed.slug}`, () =>
      db
        .insert(categories)
        .values({
          name: categorySeed.name,
          slug: categorySeed.slug,
          parentId: null,
        })
        .returning(),
    );
    categoryMap.set(category.slug, category.id);
  }

  for (const categorySeed of categorySeeds.filter((item) => item.parentSlug !== null)) {
    const parentId = categoryMap.get(categorySeed.parentSlug!);
    if (!parentId) {
      throw new Error(`Missing parent category for ${categorySeed.slug}`);
    }

    const [category] = await runWithRetry(`insert category ${categorySeed.slug}`, () =>
      db
        .insert(categories)
        .values({
          name: categorySeed.name,
          slug: categorySeed.slug,
          parentId,
        })
        .returning(),
    );
    categoryMap.set(category.slug, category.id);
  }

  await runWithRetry("insert coupons", () => db.insert(coupons).values(couponSeeds));

  const genderMap = new Map(insertedGenders.map((row) => [row.slug, row.id]));
  const brandMap = new Map(insertedBrands.map((row) => [row.slug, row.id]));
  const colorMap = new Map(insertedColors.map((row) => [row.slug, row]));
  const sizeMap = new Map(insertedSizes.map((row) => [row.slug, row]));
  const collectionMap = new Map(insertedCollections.map((row) => [row.slug, row.id]));

  console.log(`Seeding ${seedProducts.length} unique Nike and Jordan products...`);

  for (const [productIndex, definition] of seedProducts.entries()) {
    console.log(
      `Seeding product ${productIndex + 1}/${seedProducts.length}: ${definition.name}`,
    );

    const categoryId = categoryMap.get(definition.categorySlug);
    const genderId = genderMap.get(definition.genderSlug);
    const brandId = brandMap.get(definition.brandSlug);

    if (!categoryId || !genderId || !brandId) {
      throw new Error(`Missing foreign key references for ${definition.slug}`);
    }

    const uploadedUrls = await copyImagesForProduct(
      definition.slug,
      sourceDir,
      [definition.imageKey],
    );

    const [product] = await runWithRetry(`insert product ${definition.slug}`, () =>
      db
        .insert(products)
        .values({
          name: definition.name,
          description: definition.description,
          categoryId,
          genderId,
          brandId,
          isPublished: true,
          defaultVariantId: null,
        })
        .returning(),
    );

    let defaultVariantId: string | null = null;
    const imageRows: Array<typeof productImages.$inferInsert> = [];

    for (const [colorIndex, colorSlug] of definition.colors.entries()) {
      const color = colorMap.get(colorSlug);
      if (!color) {
        throw new Error(`Unknown color ${colorSlug} for ${definition.slug}`);
      }

      let representativeVariantId: string | null = null;

      for (const sizeSlug of definition.sizes) {
        const size = sizeMap.get(toSlugPart(sizeSlug));
        if (!size) {
          throw new Error(`Unknown size ${sizeSlug} for ${definition.slug}`);
        }

        const [variant] = await runWithRetry(
          `insert variant ${definition.slug}-${color.slug}-${size.slug}`,
          () =>
            db
              .insert(productVariants)
              .values({
                productId: product.id,
                sku: `${upperSkuPart(definition.slug)}-${upperSkuPart(color.slug)}-${upperSkuPart(size.slug)}`,
                price: definition.basePrice,
                salePrice: definition.salePrice ?? null,
                colorId: color.id,
                sizeId: size.id,
                inStock: 6 + ((colorIndex + size.sortOrder + productIndex) % 18),
                weight: definition.weight,
                dimensions: definition.dimensions,
              })
              .returning(),
        );

        representativeVariantId ??= variant.id;
        defaultVariantId ??= variant.id;
      }

      imageRows.push({
        productId: product.id,
        variantId: representativeVariantId,
        url: uploadedUrls[0],
        sortOrder: colorIndex * 10,
        isPrimary: colorIndex === 0,
      });
    }

    if (imageRows.length > 0) {
      await runWithRetry(`insert images ${definition.slug}`, () =>
        db.insert(productImages).values(imageRows),
      );
    }

    if (!defaultVariantId) {
      throw new Error(`No default variant generated for ${definition.slug}`);
    }

    await runWithRetry(`update default variant ${definition.slug}`, () =>
      db
        .update(products)
        .set({ defaultVariantId })
        .where(eq(products.id, product.id)),
    );

    await runWithRetry(`insert collections ${definition.slug}`, () =>
      db.insert(productCollections).values(
        definition.collections.map((collectionSlug) => {
          const collectionId = collectionMap.get(collectionSlug);
          if (!collectionId) {
            throw new Error(
              `Missing collection ${collectionSlug} for product ${definition.slug}`,
            );
          }

          return {
            id: randomUUID(),
            productId: product.id,
            collectionId,
          };
        }),
      ),
    );
  }

  console.log("Commerce seed completed successfully with unique product imagery.");
}

seed().catch((error) => {
  console.error("Commerce seed failed:", error);
  process.exit(1);
});
