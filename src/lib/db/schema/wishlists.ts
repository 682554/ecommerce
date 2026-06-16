import { relations } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { products } from "./products";
import { user } from "./user";

export const wishlists = pgTable(
  "wishlists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    addedAt: timestamp("added_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("wishlists_user_product_idx").on(table.userId, table.productId)],
);

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(user, {
    fields: [wishlists.userId],
    references: [user.id],
  }),
  product: one(products, {
    fields: [wishlists.productId],
    references: [products.id],
  }),
}));

export const wishlistsInsertSchema = createInsertSchema(wishlists);
export const wishlistsSelectSchema = createSelectSchema(wishlists);

export type Wishlist = typeof wishlists.$inferSelect;
export type InsertWishlist = typeof wishlists.$inferInsert;
