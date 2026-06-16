import { relations } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { orders } from "./orders";
import { user } from "./user";

export const addressTypeValues = ["billing", "shipping"] as const;
export const addressTypeEnum = pgEnum("address_type", addressTypeValues);
export const addressTypeSchema = z.enum(addressTypeValues);

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: addressTypeEnum("type").notNull(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  postalCode: text("postal_code").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
});

export const addressesRelations = relations(addresses, ({ many, one }) => ({
  user: one(user, {
    fields: [addresses.userId],
    references: [user.id],
  }),
  shippingOrders: many(orders, {
    relationName: "shippingAddress",
  }),
  billingOrders: many(orders, {
    relationName: "billingAddress",
  }),
}));

export const addressesInsertSchema = createInsertSchema(addresses, {
  type: addressTypeSchema,
});
export const addressesSelectSchema = createSelectSchema(addresses, {
  type: addressTypeSchema,
});

export type Address = typeof addresses.$inferSelect;
export type InsertAddress = typeof addresses.$inferInsert;
