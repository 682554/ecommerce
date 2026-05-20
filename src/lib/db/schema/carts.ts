import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { guest } from "./guest";
import { productVariants } from "./variants";
import { user } from "./user";

export const carts = pgTable("carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => user.id, { onDelete: "set null" }),
  guestId: uuid("guest_id").references(() => guest.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    productVariantId: uuid("product_variant_id")
      .notNull()
      .references(() => productVariants.id),
    quantity: integer("quantity").notNull(),
  },
  (table) => [
    uniqueIndex("cart_items_cart_variant_idx").on(
      table.cartId,
      table.productVariantId,
    ),
  ],
);

export const cartsRelations = relations(carts, ({ many, one }) => ({
  user: one(user, {
    fields: [carts.userId],
    references: [user.id],
  }),
  guest: one(guest, {
    fields: [carts.guestId],
    references: [guest.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  productVariant: one(productVariants, {
    fields: [cartItems.productVariantId],
    references: [productVariants.id],
  }),
}));

export const cartsInsertSchema = createInsertSchema(carts);
export const cartsSelectSchema = createSelectSchema(carts);
export const cartItemsInsertSchema = createInsertSchema(cartItems);
export const cartItemsSelectSchema = createSelectSchema(cartItems);

export type Cart = typeof carts.$inferSelect;
export type InsertCart = typeof carts.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;
