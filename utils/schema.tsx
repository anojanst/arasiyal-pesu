import { integer, pgTable, serial, varchar, date, pgEnum, numeric, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";

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

export const incomeCategoryEnum = pgEnum("income_category", [
    "Salary",
    "Rental",
    "Investments",
    "Freelance",
    "Gifts",
    "Other"
]);

export const Incomes = pgTable("incomes", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    amount: integer("amount").notNull(),
    createdBy: varchar("createdBy").notNull(),
    date: date("date").notNull(),
    category: incomeCategoryEnum("category").notNull(),
});

export const BalanceHistory = pgTable(
    "balance_history",
    {

    id: serial("id").primaryKey(),
      userEmail: varchar("user_email").notNull(),
      date: date("date").notNull(),
      totalIncome: integer("total_income").notNull().default(0),
      totalExpense: integer("total_expense").notNull().default(0),
      balance: integer("balance").notNull().default(0),
    },
    (table) => ({
        uniqueUserDate: uniqueIndex("unique_user_date").on(table.userEmail, table.date), // ✅ Ensure uniqueness
      })
  );