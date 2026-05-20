import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { slugSchema } from "../helpers";
import { products } from "../products";

export const genders = pgTable("genders", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  slug: text("slug").notNull().unique(),
});

export const gendersRelations = relations(genders, ({ many }) => ({
  products: many(products),
}));

export const gendersInsertSchema = createInsertSchema(genders, {
  slug: slugSchema,
});
export const gendersSelectSchema = createSelectSchema(genders, {
  slug: slugSchema,
});

export type Gender = typeof genders.$inferSelect;
export type InsertGender = typeof genders.$inferInsert;
