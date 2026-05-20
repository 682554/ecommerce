import { relations } from "drizzle-orm";
import { AnyPgColumn, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { slugSchema } from "./helpers";
import { products } from "./products";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  parentId: uuid("parent_id").references((): AnyPgColumn => categories.id, {
    onDelete: "set null",
  }),
});

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "categoryHierarchy",
  }),
  children: many(categories, {
    relationName: "categoryHierarchy",
  }),
  products: many(products),
}));

export const categoriesInsertSchema = createInsertSchema(categories, {
  slug: slugSchema,
});
export const categoriesSelectSchema = createSelectSchema(categories, {
  slug: slugSchema,
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
