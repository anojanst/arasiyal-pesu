import { integer, pgTable, serial, varchar, date } from "drizzle-orm/pg-core";

export const Budgets = pgTable("budgets", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    amount: integer("amount").notNull(),
    icon: varchar("icon"),
    createdBy: varchar("createdBy").notNull(),
})

export const Tags = pgTable("tags", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    createdBy: varchar("createdBy").notNull(),
    budgetId: integer("budgetId").references(() => Budgets.id),
})

export const Expenses = pgTable("expenses", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    amount: integer("amount").notNull(),
    createdBy: varchar("createdBy").notNull(),
    tagId: integer("tagId").references(() => Tags.id),
    date: date("date").notNull(),
})