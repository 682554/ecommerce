import { relations } from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { cartItems } from "./carts";
import { colors } from "./filters/colors";
import { sizes } from "./filters/sizes";
import { Dimensions, dimensionsSchema, slugSchema } from "./helpers";
import { orderItems } from "./orders";
import { products } from "./products";

export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
});

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references((): AnyPgColumn => products.id, { onDelete: "cascade" }),
    sku: text("sku").notNull().unique(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    salePrice: numeric("sale_price", { precision: 10, scale: 2 }),
    colorId: uuid("color_id")
      .notNull()
      .references(() => colors.id),
    sizeId: uuid("size_id")
      .notNull()
      .references(() => sizes.id),
    inStock: integer("in_stock").notNull().default(0),
    weight: real("weight").notNull(),
    dimensions: jsonb("dimensions").$type<Dimensions>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("product_variants_product_idx").on(table.productId),
    index("product_variants_product_color_idx").on(
      table.productId,
      table.colorId,
    ),
    index("product_variants_product_size_idx").on(
      table.productId,
      table.sizeId,
    ),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id").references(() => productVariants.id, {
      onDelete: "set null",
    }),
    url: text("url").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    isPrimary: boolean("is_primary").notNull().default(false),
  },
  (table) => [
    index("product_images_product_idx").on(table.productId),
    index("product_images_product_variant_idx").on(
      table.productId,
      table.variantId,
    ),
  ],
);

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ many, one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
      relationName: "productVariants",
    }),
    color: one(colors, {
      fields: [productVariants.colorId],
      references: [colors.id],
    }),
    size: one(sizes, {
      fields: [productVariants.sizeId],
      references: [sizes.id],
    }),
    images: many(productImages),
    cartItems: many(cartItems),
    orderItems: many(orderItems),
    defaultForProducts: many(products, {
      relationName: "defaultVariant",
    }),
  }),
);

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [productImages.variantId],
    references: [productVariants.id],
  }),
}));

export const brandsInsertSchema = createInsertSchema(brands, {
  slug: slugSchema,
});
export const brandsSelectSchema = createSelectSchema(brands, {
  slug: slugSchema,
});
export const productVariantsInsertSchema = createInsertSchema(productVariants, {
  dimensions: dimensionsSchema,
});
export const productVariantsSelectSchema = createSelectSchema(productVariants, {
  dimensions: dimensionsSchema,
});
export const productImagesInsertSchema = createInsertSchema(productImages);
export const productImagesSelectSchema = createSelectSchema(productImages);

export type Brand = typeof brands.$inferSelect;
export type InsertBrand = typeof brands.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertProductVariant = typeof productVariants.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type InsertProductImage = typeof productImages.$inferInsert;
