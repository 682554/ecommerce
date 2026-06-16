import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { addresses } from "./addresses";
import { account } from "./account";
import { carts } from "./carts";
import { orders } from "./orders";
import { reviews } from "./reviews";
import { session } from "./session";
import { wishlists } from "./wishlists";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  addresses: many(addresses),
  sessions: many(session),
  accounts: many(account),
  reviews: many(reviews),
  carts: many(carts),
  orders: many(orders),
  wishlists: many(wishlists),
}));

export const userInsertSchema = createInsertSchema(user);
export const userSelectSchema = createSelectSchema(user);

export type User = typeof user.$inferSelect;
export type InsertUser = typeof user.$inferInsert;
