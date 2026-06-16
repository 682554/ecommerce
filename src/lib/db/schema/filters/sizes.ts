import { relations } from "drizzle-orm";
import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { slugSchema } from "../helpers";
import { productVariants } from "../variants";

export const sizes = pgTable("sizes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull(),
});

export const sizesRelations = relations(sizes, ({ many }) => ({
  variants: many(productVariants),
}));

export const sizesInsertSchema = createInsertSchema(sizes, {
  slug: slugSchema,
});
export const sizesSelectSchema = createSelectSchema(sizes, {
  slug: slugSchema,
});

export type Size = typeof sizes.$inferSelect;
export type InsertSize = typeof sizes.$inferInsert;
