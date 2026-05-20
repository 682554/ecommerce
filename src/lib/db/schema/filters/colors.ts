import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { hexColorSchema, slugSchema } from "../helpers";
import { productVariants } from "../variants";

export const colors = pgTable("colors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  hexCode: text("hex_code").notNull(),
});

export const colorsRelations = relations(colors, ({ many }) => ({
  variants: many(productVariants),
}));

export const colorsInsertSchema = createInsertSchema(colors, {
  slug: slugSchema,
  hexCode: hexColorSchema,
});
export const colorsSelectSchema = createSelectSchema(colors, {
  slug: slugSchema,
  hexCode: hexColorSchema,
});

export type Color = typeof colors.$inferSelect;
export type InsertColor = typeof colors.$inferInsert;
