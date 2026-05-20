import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { slugSchema } from "./helpers";
import { products } from "./products";

export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const productCollections = pgTable(
  "product_collections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("product_collections_product_collection_idx").on(
      table.productId,
      table.collectionId,
    ),
  ],
);

export const collectionsRelations = relations(collections, ({ many }) => ({
  productEntries: many(productCollections),
}));

export const productCollectionsRelations = relations(
  productCollections,
  ({ one }) => ({
    product: one(products, {
      fields: [productCollections.productId],
      references: [products.id],
    }),
    collection: one(collections, {
      fields: [productCollections.collectionId],
      references: [collections.id],
    }),
  }),
);

export const collectionsInsertSchema = createInsertSchema(collections, {
  slug: slugSchema,
});
export const collectionsSelectSchema = createSelectSchema(collections, {
  slug: slugSchema,
});
export const productCollectionsInsertSchema =
  createInsertSchema(productCollections);
export const productCollectionsSelectSchema =
  createSelectSchema(productCollections);

export type Collection = typeof collections.$inferSelect;
export type InsertCollection = typeof collections.$inferInsert;
export type ProductCollection = typeof productCollections.$inferSelect;
export type InsertProductCollection = typeof productCollections.$inferInsert;
