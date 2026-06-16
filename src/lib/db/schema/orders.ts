import { relations } from "drizzle-orm";
import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { addresses } from "./addresses";
import { moneyStringSchema } from "./helpers";
import { productVariants } from "./variants";
import { user } from "./user";

export const orderStatusValues = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export const paymentMethodValues = ["stripe", "paypal", "cod"] as const;
export const paymentStatusValues = [
  "initiated",
  "completed",
  "failed",
] as const;
export const discountTypeValues = ["percentage", "fixed"] as const;

export const orderStatusEnum = pgEnum("order_status", orderStatusValues);
export const paymentMethodEnum = pgEnum("payment_method", paymentMethodValues);
export const paymentStatusEnum = pgEnum("payment_status", paymentStatusValues);
export const discountTypeEnum = pgEnum("discount_type", discountTypeValues);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  status: orderStatusEnum("status").notNull().default("pending"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingAddressId: uuid("shipping_address_id")
    .notNull()
    .references(() => addresses.id),
  billingAddressId: uuid("billing_address_id")
    .notNull()
    .references(() => addresses.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productVariantId: uuid("product_variant_id")
    .notNull()
    .references(() => productVariants.id),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: numeric("price_at_purchase", {
    precision: 10,
    scale: 2,
  }).notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  method: paymentMethodEnum("method").notNull(),
  status: paymentStatusEnum("status").notNull().default("initiated"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  transactionId: text("transaction_id"),
});

export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  discountType: discountTypeEnum("discount_type").notNull(),
  discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  maxUsage: integer("max_usage").notNull(),
  usedCount: integer("used_count").notNull().default(0),
});

export const ordersRelations = relations(orders, ({ many, one }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  shippingAddress: one(addresses, {
    fields: [orders.shippingAddressId],
    references: [addresses.id],
    relationName: "shippingAddress",
  }),
  billingAddress: one(addresses, {
    fields: [orders.billingAddressId],
    references: [addresses.id],
    relationName: "billingAddress",
  }),
  items: many(orderItems),
  payments: many(payments),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  productVariant: one(productVariants, {
    fields: [orderItems.productVariantId],
    references: [productVariants.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

export const orderStatusSchema = z.enum(orderStatusValues);
export const paymentMethodSchema = z.enum(paymentMethodValues);
export const paymentStatusSchema = z.enum(paymentStatusValues);
export const discountTypeSchema = z.enum(discountTypeValues);

export const ordersInsertSchema = createInsertSchema(orders, {
  status: orderStatusSchema,
  totalAmount: moneyStringSchema,
});
export const ordersSelectSchema = createSelectSchema(orders, {
  status: orderStatusSchema,
  totalAmount: moneyStringSchema,
});
export const orderItemsInsertSchema = createInsertSchema(orderItems, {
  priceAtPurchase: moneyStringSchema,
});
export const orderItemsSelectSchema = createSelectSchema(orderItems, {
  priceAtPurchase: moneyStringSchema,
});
export const paymentsInsertSchema = createInsertSchema(payments, {
  method: paymentMethodSchema,
  status: paymentStatusSchema,
});
export const paymentsSelectSchema = createSelectSchema(payments, {
  method: paymentMethodSchema,
  status: paymentStatusSchema,
});
export const couponsInsertSchema = createInsertSchema(coupons, {
  discountType: discountTypeSchema,
  discountValue: moneyStringSchema,
});
export const couponsSelectSchema = createSelectSchema(coupons, {
  discountType: discountTypeSchema,
  discountValue: moneyStringSchema,
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = typeof coupons.$inferInsert;
