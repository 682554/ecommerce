"use server";

import {
  and,
  asc,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  ne,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { db } from "@/lib/db";
import {
  brands,
  categories,
  colors,
  genders,
  productImages,
  products,
  productVariants,
  reviews,
  sizes,
} from "@/lib/db/schema";
import {
  buildProductQueryObject,
  parseFilterParams,
  type ParsedProductFilters,
  type ProductSortOption,
} from "@/lib/utils/query";

export type ProductListItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  gender: string;
  genderSlug: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  image: string;
  topImages: string[];
  colors: string[];
  sizes: string[];
  createdAt: Date;
};

export type GetAllProductsResult = {
  products: ProductListItem[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ProductImageSummary = {
  id: string;
  url: string;
  sortOrder: number;
  isPrimary: boolean;
  variantId: string | null;
};

export type ProductVariantRecord = {
  id: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  inStock: number;
  weight: number;
  color: {
    id: string;
    name: string;
    slug: string;
    hexCode: string;
    swatchClassName: string;
  };
  size: {
    id: string;
    name: string;
    slug: string;
    sortOrder: number;
  };
  images: ProductImageSummary[];
};

export type ProductVariantGroup = {
  id: string;
  color: ProductVariantRecord["color"];
  images: ProductImageSummary[];
  variants: ProductVariantRecord[];
};

export type ProductDetails = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  rating: number;
  reviewCount: number;
  defaultVariantId: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
  };
  gender: {
    id: string;
    label: string;
    slug: string;
  };
  images: ProductImageSummary[];
  variants: ProductVariantRecord[];
  variantGroups: ProductVariantGroup[];
  sizeOptions: string[];
  details: string[];
  shipping: string[];
};

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  title?: string;
  content: string;
  createdAt: string;
};

export type RecommendedProduct = {
  id: string;
  name: string;
  description: string;
  category: string;
  gender: string;
  price: number;
  priceMax?: number;
  image: string;
  colors: string[];
  sizes: string[];
};

type GetAllProductsParams =
  | ParsedProductFilters
  | Record<string, string | string[] | undefined>;

const defaultImage =
  "/static/uploads/products/nike-air-force-1-07/01-nike-air-force-1-07.png";

function parseNumericValue(value: string | number | null) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function parseJsonStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  }

  return [];
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function isValidImageUrl(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function uniqueImageSummaries(images: ProductImageSummary[]) {
  const seen = new Set<string>();

  return images.filter((image) => {
    if (!isValidImageUrl(image.url) || seen.has(image.url)) {
      return false;
    }

    seen.add(image.url);
    return true;
  });
}

function swatchClassNameForColorSlug(slug: string) {
  switch (slug) {
    case "black":
      return "bg-neutral-950";
    case "white":
      return "bg-neutral-100";
    case "university-red":
      return "bg-red-700";
    case "royal-blue":
      return "bg-blue-700";
    case "volt":
      return "bg-lime-300";
    case "orange":
      return "bg-orange-500";
    case "stone":
      return "bg-stone-300";
    case "carbon-grey":
      return "bg-zinc-500";
    default:
      return "bg-neutral-400";
  }
}

function formatProductSubtitle(brand: string, gender: string, category: string) {
  return `${brand} / ${gender} / ${category}`;
}

function reviewTitleFromRating(rating: number) {
  if (rating >= 5) {
    return "Top-tier pickup";
  }

  if (rating >= 4) {
    return "Worth adding to rotation";
  }

  if (rating >= 3) {
    return "Solid overall";
  }

  return "A mixed experience";
}

function fallbackReviews(productName: string): ProductReview[] {
  return [
    {
      id: `fallback-${productName}-1`,
      author: "Nike Member",
      rating: 5,
      title: "Easy recommendation",
      content:
        `${productName} feels premium in hand and clean on-foot. The fit, finish, and day-to-day comfort all land where you want them to.`,
      createdAt: new Date("2026-04-14T10:00:00.000Z").toISOString(),
    },
    {
      id: `fallback-${productName}-2`,
      author: "Verified Buyer",
      rating: 4,
      title: "Strong everyday option",
      content:
        "The styling is versatile, the comfort holds up through long wear, and the product photos matched what arrived.",
      createdAt: new Date("2026-03-22T16:30:00.000Z").toISOString(),
    },
  ];
}

function mapProductImageSummary(image: {
  id: string;
  url: string;
  sortOrder: number;
  isPrimary: boolean;
  variantId?: string | null;
}): ProductImageSummary {
  return {
    id: image.id,
    url: image.url,
    sortOrder: image.sortOrder,
    isPrimary: image.isPrimary,
    variantId: image.variantId ?? null,
  };
}

function buildPriceClauses(
  effectivePriceSql: SQL,
  filters: ReturnType<typeof buildProductQueryObject>,
) {
  const clauses: SQL[] = [];

  if (typeof filters.priceMin === "number") {
    clauses.push(gte(effectivePriceSql, filters.priceMin.toFixed(2)));
  }

  if (typeof filters.priceMax === "number") {
    clauses.push(lte(effectivePriceSql, filters.priceMax.toFixed(2)));
  }

  if (filters.selectedPriceRanges.length > 0) {
    const presetClauses = filters.selectedPriceRanges.map((range) => {
      if (range.max === null) {
        return gte(effectivePriceSql, range.min.toFixed(2));
      }

      return and(
        gte(effectivePriceSql, range.min.toFixed(2)),
        lte(effectivePriceSql, range.max.toFixed(2)),
      )!;
    });

    clauses.push(or(...presetClauses)!);
  }

  return clauses;
}

function buildProductWhereClauses(
  filters: ReturnType<typeof buildProductQueryObject>,
) {
  const effectivePriceSql = sql`coalesce(${productVariants.salePrice}, ${productVariants.price})`;

  return [
    eq(products.isPublished, true),
    filters.search
      ? or(
          ilike(products.name, `%${filters.search}%`),
          ilike(products.description, `%${filters.search}%`),
        )
      : undefined,
    filters.categorySlugs.length
      ? inArray(categories.slug, filters.categorySlugs)
      : undefined,
    filters.genderSlugs.length
      ? inArray(genders.slug, filters.genderSlugs)
      : undefined,
    filters.colorSlugs.length
      ? inArray(colors.slug, filters.colorSlugs)
      : undefined,
    filters.sizeSlugs.length ? inArray(sizes.slug, filters.sizeSlugs) : undefined,
    ...buildPriceClauses(effectivePriceSql, filters),
  ].filter((clause): clause is SQL => Boolean(clause));
}

function buildColorMatchClause(colorSlugs: string[]) {
  if (colorSlugs.length === 0) {
    return sql``;
  }

  return sql`and c.slug in (${sql.join(
    colorSlugs.map((colorSlug) => sql`${colorSlug}`),
    sql`, `,
  )})`;
}

function buildPreferredImageSql(colorSlugs: string[]) {
  const colorMatchClause = buildColorMatchClause(colorSlugs);

  return sql<string>`
    coalesce(
      (
        select pi.url
        from product_images pi
        inner join product_variants pv on pv.id = pi.variant_id
        inner join colors c on c.id = pv.color_id
        where pi.product_id = ${products.id}
        ${colorMatchClause}
        order by pi.is_primary desc, pi.sort_order asc
        limit 1
      ),
      (
        select pi.url
        from product_images pi
        where pi.product_id = ${products.id}
          and pi.variant_id is null
        order by pi.is_primary desc, pi.sort_order asc
        limit 1
      ),
      (
        select pi.url
        from product_images pi
        where pi.product_id = ${products.id}
        order by pi.is_primary desc, pi.sort_order asc
        limit 1
      )
    )
  `;
}

function buildTopImagesSql(colorSlugs: string[]) {
  const colorMatchClause = buildColorMatchClause(colorSlugs);

  return sql<unknown>`
    coalesce(
      (
        select json_agg(preferred_images.url order by preferred_images.sort_order asc)
        from (
          select pi.url, pi.sort_order
          from product_images pi
          inner join product_variants pv on pv.id = pi.variant_id
          inner join colors c on c.id = pv.color_id
          where pi.product_id = ${products.id}
          ${colorMatchClause}
          order by pi.is_primary desc, pi.sort_order asc
          limit 3
        ) as preferred_images
      ),
      (
        select json_agg(all_images.url order by all_images.sort_order asc)
        from (
          select pi.url, pi.sort_order
          from product_images pi
          where pi.product_id = ${products.id}
          order by pi.is_primary desc, pi.sort_order asc
          limit 3
        ) as all_images
      ),
      '[]'::json
    )
  `;
}

function buildColorsSql() {
  return sql<unknown>`
    (
      select coalesce(json_agg(color_rows.name order by color_rows.name), '[]'::json)
      from (
        select distinct c.name
        from product_variants pv
        inner join colors c on c.id = pv.color_id
        where pv.product_id = ${products.id}
      ) as color_rows
    )
  `;
}

function buildSizesSql() {
  return sql<unknown>`
    (
      select coalesce(json_agg(size_rows.name order by size_rows.sort_order), '[]'::json)
      from (
        select distinct s.name, s.sort_order
        from product_variants pv
        inner join sizes s on s.id = pv.size_id
        where pv.product_id = ${products.id}
      ) as size_rows
    )
  `;
}

function getSortOrder(sortBy: ProductSortOption, minPriceSql: SQL) {
  switch (sortBy) {
    case "price_asc":
      return [asc(minPriceSql), desc(products.createdAt)];
    case "price_desc":
      return [desc(minPriceSql), desc(products.createdAt)];
    case "newest":
    case "featured":
    default:
      return [desc(products.createdAt)];
  }
}

function resolveProductPrimaryImage(product: {
  defaultVariant: { images: Array<{ url: string; isPrimary: boolean }> } | null;
  images: Array<{ url: string; isPrimary: boolean }>;
  variants: Array<{ images: Array<{ url: string; isPrimary: boolean }> }>;
}) {
  return (
    product.defaultVariant?.images.find((image) => image.isPrimary)?.url ??
    product.defaultVariant?.images.find((image) => isValidImageUrl(image.url))?.url ??
    product.images.find((image) => image.isPrimary && isValidImageUrl(image.url))?.url ??
    product.images.find((image) => isValidImageUrl(image.url))?.url ??
    product.variants
      .flatMap((variant) => variant.images)
      .find((image) => image.isPrimary && isValidImageUrl(image.url))?.url ??
    product.variants
      .flatMap((variant) => variant.images)
      .find((image) => isValidImageUrl(image.url))?.url ??
    null
  );
}

async function resolveProductIdFromRouteKey(routeKey: string) {
  if (isUuid(routeKey)) {
    return routeKey;
  }

  const matchedProductImage = await db.query.productImages.findFirst({
    where: ilike(productImages.url, `%/${routeKey}/%`),
    columns: {
      productId: true,
    },
  });

  return matchedProductImage?.productId ?? null;
}

export async function getAllProducts(
  params: GetAllProductsParams,
): Promise<GetAllProductsResult> {
  const filters =
    "search" in params || "gender" in params || "page" in params
      ? (params as ParsedProductFilters)
      : parseFilterParams(params);
  const normalized = buildProductQueryObject(filters);
  const whereClauses = buildProductWhereClauses(normalized);
  const minPriceSql = sql<string>`min(coalesce(${productVariants.salePrice}, ${productVariants.price}))`;
  const maxPriceSql = sql<string>`max(coalesce(${productVariants.salePrice}, ${productVariants.price}))`;

  const [{ totalCount }] = await db
    .select({
      totalCount: sql<number>`count(distinct ${products.id})`,
    })
    .from(products)
    .innerJoin(categories, eq(categories.id, products.categoryId))
    .innerJoin(genders, eq(genders.id, products.genderId))
    .innerJoin(brands, eq(brands.id, products.brandId))
    .innerJoin(productVariants, eq(productVariants.productId, products.id))
    .innerJoin(colors, eq(colors.id, productVariants.colorId))
    .innerJoin(sizes, eq(sizes.id, productVariants.sizeId))
    .where(and(...whereClauses));

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      category: categories.name,
      categorySlug: categories.slug,
      gender: genders.label,
      genderSlug: genders.slug,
      brand: brands.name,
      minPrice: minPriceSql,
      maxPrice: maxPriceSql,
      image: buildPreferredImageSql(normalized.colorSlugs),
      topImages: buildTopImagesSql(normalized.colorSlugs),
      colors: buildColorsSql(),
      sizes: buildSizesSql(),
      createdAt: products.createdAt,
    })
    .from(products)
    .innerJoin(categories, eq(categories.id, products.categoryId))
    .innerJoin(genders, eq(genders.id, products.genderId))
    .innerJoin(brands, eq(brands.id, products.brandId))
    .innerJoin(productVariants, eq(productVariants.productId, products.id))
    .innerJoin(colors, eq(colors.id, productVariants.colorId))
    .innerJoin(sizes, eq(sizes.id, productVariants.sizeId))
    .where(and(...whereClauses))
    .groupBy(
      products.id,
      products.name,
      products.description,
      categories.name,
      categories.slug,
      genders.label,
      genders.slug,
      brands.name,
      products.createdAt,
    )
    .orderBy(...getSortOrder(normalized.sortBy, minPriceSql))
    .limit(normalized.limit)
    .offset(normalized.offset);

  const mappedProducts = rows.map((row): ProductListItem => ({
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    categorySlug: row.categorySlug,
    gender: row.gender,
    genderSlug: row.genderSlug,
    brand: row.brand,
    minPrice: parseNumericValue(row.minPrice),
    maxPrice: parseNumericValue(row.maxPrice),
    image: row.image || defaultImage,
    topImages: parseJsonStringArray(row.topImages),
    colors: parseJsonStringArray(row.colors),
    sizes: parseJsonStringArray(row.sizes),
    createdAt: row.createdAt,
  }));

  return {
    products: mappedProducts,
    totalCount: Number(totalCount ?? 0),
    page: normalized.page,
    limit: normalized.limit,
    totalPages: Math.max(1, Math.ceil(Number(totalCount ?? 0) / normalized.limit)),
  };
}

export async function getProduct(productId: string): Promise<ProductDetails | null> {
  const resolvedProductId = await resolveProductIdFromRouteKey(productId);

  if (!resolvedProductId) {
    return null;
  }

  const product = await db.query.products.findFirst({
    where: and(eq(products.id, resolvedProductId), eq(products.isPublished, true)),
    with: {
      category: true,
      brand: true,
      gender: true,
      defaultVariant: {
        with: {
          color: true,
          size: true,
          images: {
            orderBy: [desc(productImages.isPrimary), asc(productImages.sortOrder)],
          },
        },
      },
      images: {
        orderBy: [desc(productImages.isPrimary), asc(productImages.sortOrder)],
      },
      variants: {
        orderBy: [asc(productVariants.createdAt)],
        with: {
          color: true,
          size: true,
          images: {
            orderBy: [desc(productImages.isPrimary), asc(productImages.sortOrder)],
          },
        },
      },
      reviews: true,
    },
  });

  if (!product) {
    return null;
  }

  const productImagesMapped = uniqueImageSummaries(
    product.images.map((image) => mapProductImageSummary(image)),
  );

  const mappedVariants: ProductVariantRecord[] = product.variants
    .map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      price: parseNumericValue(variant.salePrice ?? variant.price),
      compareAtPrice:
        variant.salePrice === null ? null : parseNumericValue(variant.price),
      inStock: variant.inStock,
      weight: variant.weight,
      color: {
        id: variant.color.id,
        name: variant.color.name,
        slug: variant.color.slug,
        hexCode: variant.color.hexCode,
        swatchClassName: swatchClassNameForColorSlug(variant.color.slug),
      },
      size: {
        id: variant.size.id,
        name: variant.size.name,
        slug: variant.size.slug,
        sortOrder: variant.size.sortOrder,
      },
      images: uniqueImageSummaries(
        variant.images.map((image) =>
          mapProductImageSummary({
            ...image,
            variantId: variant.id,
          }),
        ),
      ),
    }))
    .sort((left, right) => {
      if (left.color.name !== right.color.name) {
        return left.color.name.localeCompare(right.color.name);
      }

      return left.size.sortOrder - right.size.sortOrder;
    });

  const variantGroupMap = new Map<string, ProductVariantGroup>();

  for (const variant of mappedVariants) {
    const existingGroup = variantGroupMap.get(variant.color.id);

    variantGroupMap.set(variant.color.id, {
      id: variant.color.id,
      color: variant.color,
      images: uniqueImageSummaries([
        ...(existingGroup?.images ?? []),
        ...variant.images,
      ]),
      variants: [...(existingGroup?.variants ?? []), variant].sort(
        (left, right) => left.size.sortOrder - right.size.sortOrder,
      ),
    });
  }

  const variantGroups = Array.from(variantGroupMap.values()).map((group) => ({
    ...group,
    images:
      group.images.length > 0
        ? group.images
        : productImagesMapped.filter((image) => image.variantId === null),
  }));

  const fallbackPriceSource = product.defaultVariant ?? product.variants[0] ?? null;
  const price = fallbackPriceSource
    ? parseNumericValue(fallbackPriceSource.salePrice ?? fallbackPriceSource.price)
    : 0;
  const compareAtPrice =
    fallbackPriceSource && fallbackPriceSource.salePrice !== null
      ? parseNumericValue(fallbackPriceSource.price)
      : null;

  const reviewCount = product.reviews.length;
  const rating =
    reviewCount === 0
      ? 4.8
      : Number(
          (
            product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviewCount
          ).toFixed(1),
        );

  return {
    id: product.id,
    name: product.name,
    subtitle: formatProductSubtitle(
      product.brand.name,
      product.gender.label,
      product.category.name,
    ),
    description: product.description,
    price,
    compareAtPrice,
    rating,
    reviewCount,
    defaultVariantId: product.defaultVariantId ?? null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    brand: {
      id: product.brand.id,
      name: product.brand.name,
      slug: product.brand.slug,
      logoUrl: product.brand.logoUrl ?? null,
    },
    gender: {
      id: product.gender.id,
      label: product.gender.label,
      slug: product.gender.slug,
    },
    images: uniqueImageSummaries([
      ...variantGroups.flatMap((group) => group.images),
      ...productImagesMapped,
    ]),
    variants: mappedVariants,
    variantGroups,
    sizeOptions: Array.from(
      new Set(
        mappedVariants
          .sort((left, right) => left.size.sortOrder - right.size.sortOrder)
          .map((variant) => variant.size.name),
      ),
    ),
    details: [
      `${product.brand.name} ${product.category.name} silhouette with ${variantGroups.length} color option${variantGroups.length === 1 ? "" : "s"}.`,
      `${mappedVariants.length} live variant combination${mappedVariants.length === 1 ? "" : "s"} across color and size.`,
      `Published for ${product.gender.label.toLowerCase()} shoppers with real stock visibility and image grouping by color family.`,
    ],
    shipping: [
      "Free standard delivery on qualifying orders.",
      "Returns are accepted within 30 days for unworn items in original condition.",
      "Final delivery speed depends on checkout destination and inventory location.",
    ],
  };
}

export async function getProductReviews(
  productId: string,
): Promise<ProductReview[]> {
  const resolvedProductId = await resolveProductIdFromRouteKey(productId);

  if (!resolvedProductId) {
    return fallbackReviews("This product");
  }

  const productReviewRows = await db.query.reviews.findMany({
    where: eq(reviews.productId, resolvedProductId),
    with: {
      user: true,
    },
    orderBy: [desc(reviews.createdAt)],
    limit: 10,
  });

  if (productReviewRows.length === 0) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, resolvedProductId),
      columns: {
        name: true,
      },
    });

    return fallbackReviews(product?.name ?? "This product");
  }

  return productReviewRows.map((review) => ({
    id: review.id,
    author: review.user.name?.trim() || review.user.email,
    rating: review.rating,
    title: reviewTitleFromRating(review.rating),
    content: review.comment,
    createdAt: review.createdAt.toISOString(),
  }));
}

export async function getRecommendedProducts(
  productId: string,
): Promise<RecommendedProduct[]> {
  const resolvedProductId = await resolveProductIdFromRouteKey(productId);

  if (!resolvedProductId) {
    return [];
  }

  const currentProduct = await db.query.products.findFirst({
    where: and(eq(products.id, resolvedProductId), eq(products.isPublished, true)),
    columns: {
      id: true,
      categoryId: true,
      brandId: true,
      genderId: true,
    },
  });

  if (!currentProduct) {
    return [];
  }

  const candidateProducts = await db.query.products.findMany({
    where: and(
      eq(products.isPublished, true),
      ne(products.id, currentProduct.id),
      or(
        eq(products.categoryId, currentProduct.categoryId),
        eq(products.brandId, currentProduct.brandId),
        eq(products.genderId, currentProduct.genderId),
      ),
    ),
    with: {
      category: true,
      gender: true,
      defaultVariant: {
        with: {
          images: true,
        },
      },
      images: true,
      variants: {
        with: {
          color: true,
          size: true,
          images: true,
        },
      },
    },
    orderBy: [desc(products.createdAt)],
    limit: 12,
  });

  const scoredProducts = candidateProducts
    .map((product) => ({
      product,
      score:
        (product.categoryId === currentProduct.categoryId ? 3 : 0) +
        (product.brandId === currentProduct.brandId ? 2 : 0) +
        (product.genderId === currentProduct.genderId ? 1 : 0),
    }))
    .sort((left, right) => right.score - left.score);

  const mappedProducts: RecommendedProduct[] = [];

  for (const { product } of scoredProducts) {
    const image = resolveProductPrimaryImage(product);

    if (!isValidImageUrl(image)) {
      continue;
    }

    const priceSource = product.defaultVariant ?? product.variants[0] ?? null;
    const price = priceSource
      ? parseNumericValue(priceSource.salePrice ?? priceSource.price)
      : 0;
    const compareAtPrice =
      priceSource?.salePrice === null || priceSource?.salePrice === undefined
        ? undefined
        : parseNumericValue(priceSource.price);

    mappedProducts.push({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category.name,
      gender: product.gender.label,
      price,
      priceMax:
        typeof compareAtPrice === "number" && compareAtPrice > price
          ? compareAtPrice
          : undefined,
      image,
      colors: Array.from(
        new Set(product.variants.map((variant) => variant.color.name)),
      ),
      sizes: Array.from(
        new Set(
          product.variants
            .sort((left, right) => left.size.sortOrder - right.size.sortOrder)
            .map((variant) => variant.size.name),
        ),
      ),
    });

    if (mappedProducts.length === 4) {
      break;
    }
  }

  return mappedProducts;
}
