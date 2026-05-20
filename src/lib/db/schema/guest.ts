import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { carts } from "./carts";

export const guest = pgTable("guest", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionToken: text("session_token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const guestRelations = relations(guest, ({ many }) => ({
  carts: many(carts),
}));

export const guestInsertSchema = createInsertSchema(guest);
export const guestSelectSchema = createSelectSchema(guest);

export type Guest = typeof guest.$inferSelect;
export type InsertGuest = typeof guest.$inferInsert;
