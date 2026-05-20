import { relations } from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { categories } from "./categories";
import { productCollections } from "./collections";
import { brands } from "./variants";
import { genders } from "./filters/genders";
import { reviews } from "./reviews";
import { productImages, productVariants } from "./variants";
import { wishlists } from "./wishlists";

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    genderId: uuid("gender_id")
      .notNull()
      .references(() => genders.id),
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id),
    isPublished: boolean("is_published").notNull().default(false),
    defaultVariantId: uuid("default_variant_id").references(
      (): AnyPgColumn => productVariants.id,
      { onDelete: "set null" },
    ),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("products_category_idx").on(table.categoryId)],
);

export const productsRelations = relations(products, ({ many, one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  gender: one(genders, {
    fields: [products.genderId],
    references: [genders.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  defaultVariant: one(productVariants, {
    fields: [products.defaultVariantId],
    references: [productVariants.id],
    relationName: "defaultVariant",
  }),
  variants: many(productVariants, {
    relationName: "productVariants",
  }),
  images: many(productImages),
  reviews: many(reviews),
  wishlistEntries: many(wishlists),
  collectionEntries: many(productCollections),
}));

export const productsInsertSchema = createInsertSchema(products);
export const productsSelectSchema = createSelectSchema(products);

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
