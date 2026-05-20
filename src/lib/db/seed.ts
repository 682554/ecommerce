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
  imageKeys: string[];
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
];

const collectionSeeds = [
  { name: "Summer '25", slug: "summer-25" },
  { name: "Running Essentials", slug: "running-essentials" },
  { name: "Street Icons", slug: "street-icons" },
  { name: "Training Core", slug: "training-core" },
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
    imageKeys: ["air-max-90.jpg", "pegasus-41.jpg"],
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
    collections: ["street-icons"],
    imageKeys: ["air-force-1.jpg", "dunk-low.jpg"],
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
    imageKeys: ["dunk-low.jpg", "air-force-1.jpg"],
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
    imageKeys: ["pegasus-41.jpg", "air-max-90.jpg"],
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
    imageKeys: ["pegasus-41.jpg", "air-max-90.jpg"],
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
    imageKeys: ["pegasus-41.jpg"],
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
    imageKeys: ["air-force-1.jpg", "air-max-90.jpg"],
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
    imageKeys: ["dunk-low.jpg", "air-force-1.jpg"],
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
    imageKeys: ["club-fleece-hoodie.jpg", "tech-fleece-joggers.jpg"],
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
    collections: ["training-core"],
    imageKeys: ["tech-fleece-joggers.jpg", "club-fleece-hoodie.jpg"],
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
    imageKeys: ["pro-dri-fit-tee.jpg", "club-fleece-hoodie.jpg"],
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
    collections: ["summer-25"],
    imageKeys: ["pro-dri-fit-tee.jpg", "tech-fleece-joggers.jpg"],
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
    imageKeys: ["club-fleece-hoodie.jpg", "pro-dri-fit-tee.jpg"],
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
    collections: ["summer-25"],
    imageKeys: ["heritage86-cap.jpg"],
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
    imageKeys: ["heritage86-cap.jpg", "pro-dri-fit-tee.jpg"],
    weight: 0.08,
    dimensions: { length: 18, width: 10, height: 3 },
  },
];

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function listFiles(dir: string) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => /\.(jpg|jpeg|png|webp)$/i.test(name));
  } catch {
    return [];
  }
}

async function ensureSeedSourceDir() {
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
        await fs.copyFile(
          path.join(fallbackPhotosDir, fileName),
          target,
        );
      }
    }),
  );

  console.log(
    `Bootstrapped public/shoes with ${fallback.length} local images from ${fallbackPhotosDir}`,
  );

  return sourceShoesDir;
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
    const ext = path.extname(imageKey) || ".jpg";
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
  await db.delete(productCollections);
  await db.delete(productImages);
  await db.delete(productVariants);
  await db.delete(coupons);
  await db.delete(products);
  await db.delete(collections);
  await db.delete(categories);
  await db.delete(brands);
  await db.delete(genders);
  await db.delete(colors);
  await db.delete(sizes);
}

async function seed() {
  console.log("Starting normalized commerce seed...");
  const sourceDir = await ensureSeedSourceDir();
  await ensureDir(uploadsRootDir);

  await clearCommerceTables();

  console.log("Seeding filters and supporting catalog tables...");
  const insertedGenders = await db.insert(genders).values(genderSeeds).returning();
  const insertedBrands = await db.insert(brands).values(brandSeeds).returning();
  const insertedColors = await db.insert(colors).values(colorSeeds).returning();
  const insertedSizes = await db.insert(sizes).values(sizeSeeds).returning();
  const insertedCollections = await db
    .insert(collections)
    .values(collectionSeeds)
    .returning();

  const categoryMap = new Map<string, string>();
  for (const categorySeed of categorySeeds.filter((item) => item.parentSlug === null)) {
    const [category] = await db
      .insert(categories)
      .values({
        name: categorySeed.name,
        slug: categorySeed.slug,
        parentId: null,
      })
      .returning();
    categoryMap.set(category.slug, category.id);
  }

  for (const categorySeed of categorySeeds.filter((item) => item.parentSlug !== null)) {
    const parentId = categoryMap.get(categorySeed.parentSlug!);
    if (!parentId) {
      throw new Error(`Missing parent category for ${categorySeed.slug}`);
    }

    const [category] = await db
      .insert(categories)
      .values({
        name: categorySeed.name,
        slug: categorySeed.slug,
        parentId,
      })
      .returning();
    categoryMap.set(category.slug, category.id);
  }

  await db.insert(coupons).values(couponSeeds);

  const genderMap = new Map(insertedGenders.map((row) => [row.slug, row.id]));
  const brandMap = new Map(insertedBrands.map((row) => [row.slug, row.id]));
  const colorMap = new Map(insertedColors.map((row) => [row.slug, row]));
  const sizeMap = new Map(insertedSizes.map((row) => [row.slug, row]));
  const collectionMap = new Map(insertedCollections.map((row) => [row.slug, row.id]));

  console.log(`Seeding ${seedProducts.length} Nike products with variants...`);

  for (const [productIndex, definition] of seedProducts.entries()) {
    console.log(`Seeding product ${productIndex + 1}/${seedProducts.length}: ${definition.name}`);

    const categoryId = categoryMap.get(definition.categorySlug);
    const genderId = genderMap.get(definition.genderSlug);
    const brandId = brandMap.get(definition.brandSlug);

    if (!categoryId || !genderId || !brandId) {
      throw new Error(`Missing foreign key references for ${definition.slug}`);
    }

    const uploadedUrls = await copyImagesForProduct(
      definition.slug,
      sourceDir,
      definition.imageKeys,
    );

    const [product] = await db
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
      .returning();

    let defaultVariantId: string | null = null;
    const imageRows: Array<typeof productImages.$inferInsert> = [];

    for (const [colorIndex, colorSlug] of definition.colors.entries()) {
      const color = colorMap.get(colorSlug);
      if (!color) {
        throw new Error(`Unknown color ${colorSlug} for ${definition.slug}`);
      }

      const colorImageUrls = uploadedUrls.slice(
        colorIndex % uploadedUrls.length,
        (colorIndex % uploadedUrls.length) + Math.min(2, uploadedUrls.length),
      );
      const normalizedColorImages =
        colorImageUrls.length > 0 ? colorImageUrls : [uploadedUrls[0]];

      let representativeVariantId: string | null = null;

      for (const sizeSlug of definition.sizes) {
        const size = sizeMap.get(toSlugPart(sizeSlug));
        if (!size) {
          throw new Error(`Unknown size ${sizeSlug} for ${definition.slug}`);
        }

        const [variant] = await db
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
          .returning();

        representativeVariantId ??= variant.id;
        defaultVariantId ??= variant.id;
      }

      normalizedColorImages.forEach((url, imageIndex) => {
        imageRows.push({
          productId: product.id,
          variantId: representativeVariantId,
          url,
          sortOrder: colorIndex * 10 + imageIndex,
          isPrimary: colorIndex === 0 && imageIndex === 0,
        });
      });
    }

    if (imageRows.length > 0) {
      await db.insert(productImages).values(imageRows);
    }

    if (!defaultVariantId) {
      throw new Error(`No default variant generated for ${definition.slug}`);
    }

    await db
      .update(products)
      .set({ defaultVariantId })
      .where(eq(products.id, product.id));

    await db.insert(productCollections).values(
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
    );
  }

  console.log("Commerce seed completed successfully.");
}

seed().catch((error) => {
  console.error("Commerce seed failed:", error);
  process.exit(1);
});
