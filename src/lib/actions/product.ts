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
  sizes,
} from "@/lib/db/schema";
import {
  buildProductQueryObject,
  parseFilterParams,
  type ParsedProductFilters,
  type ProductSortOption,
} from "@/lib/utils/query";
import { deriveProductSlug } from "@/lib/utils/product-slug";

export type ProductListItem = {
  id: string;
  slug: string;
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

export type ProductDetails = {
  id: string;
  name: string;
  description: string;
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
  images: Array<{
    id: string;
    url: string;
    sortOrder: number;
    isPrimary: boolean;
    variantId: string | null;
  }>;
  variants: Array<{
    id: string;
    sku: string;
    price: number;
    salePrice: number | null;
    inStock: number;
    weight: number;
    color: {
      id: string;
      name: string;
      slug: string;
      hexCode: string;
    };
    size: {
      id: string;
      name: string;
      slug: string;
      sortOrder: number;
    };
    images: Array<{
      id: string;
      url: string;
      sortOrder: number;
      isPrimary: boolean;
    }>;
  }>;
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

function buildProductWhereClauses(filters: ReturnType<typeof buildProductQueryObject>) {
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
    slug: deriveProductSlug(row.image, row.id),
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
  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.isPublished, true)),
    with: {
      category: true,
      brand: true,
      gender: true,
      images: {
        orderBy: [asc(productImages.sortOrder)],
      },
      variants: {
        orderBy: [asc(productVariants.createdAt)],
        with: {
          color: true,
          size: true,
          images: {
            orderBy: [asc(productImages.sortOrder)],
          },
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    description: product.description,
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
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      sortOrder: image.sortOrder,
      isPrimary: image.isPrimary,
      variantId: image.variantId ?? null,
    })),
    variants: product.variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      price: parseNumericValue(variant.price),
      salePrice:
        variant.salePrice === null ? null : parseNumericValue(variant.salePrice),
      inStock: variant.inStock,
      weight: variant.weight,
      color: {
        id: variant.color.id,
        name: variant.color.name,
        slug: variant.color.slug,
        hexCode: variant.color.hexCode,
      },
      size: {
        id: variant.size.id,
        name: variant.size.name,
        slug: variant.size.slug,
        sortOrder: variant.size.sortOrder,
      },
      images: variant.images.map((image) => ({
        id: image.id,
        url: image.url,
        sortOrder: image.sortOrder,
        isPrimary: image.isPrimary,
      })),
    })),
  };
}
