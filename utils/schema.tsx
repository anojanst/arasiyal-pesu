import exp from "constants";
import { integer, pgTable, serial, varchar, date, pgEnum, numeric, primaryKey, uniqueIndex, boolean } from "drizzle-orm/pg-core";
import next from "next";

export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: integer("amount").notNull(),
  icon: varchar("icon"),
  createdBy: varchar("created_by").notNull(),
})

export const Tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  createdBy: varchar("created_by").notNull(),
  budgetId: integer("budget_id").references(() => Budgets.id),
})

export const Expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: integer("amount").notNull(),
  createdBy: varchar("created_by").notNull(),
  tagId: integer("tag_id").references(() => Tags.id),
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
  createdBy: varchar("created_by").notNull(),
  date: date("date").notNull(),
  category: incomeCategoryEnum("category").notNull(),
});

export const BalanceHistory = pgTable(
  "balance_history",
  {
    id: serial("id").primaryKey(),
    createdBy: varchar("created_by").notNull(),
    date: date("date").notNull(),
    totalIncome: integer("total_income").notNull().default(0),
    totalExpense: integer("total_expense").notNull().default(0),
    balance: integer("balance").notNull().default(0),
  },
  (table) => ({
    uniqueUserDate: uniqueIndex("unique_user_date").on(table.createdBy, table.date), // ✅ Ensure uniqueness
  })
);

export const Loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  createdBy: varchar("created_by").notNull(),
  lender: varchar("lender").notNull(),
  principalAmount: integer("principal_amount").notNull(),
  remainingPrincipal: integer("remaining_principal").notNull(),
  interestRate: numeric("interest_rate", { precision: 5, scale: 2 }).notNull(),
  tenureMonths: integer("tenure_months").notNull(),
  repaymentFrequency: varchar("repayment_frequency").notNull(),
  EMI: integer("emi").notNull(),
  nextDueDate: date("next_due_date").notNull(),
  isPaidOff: boolean("is_paid_off").notNull().default(false),
});

export const LoanRepayments = pgTable("loan_repayments", {
  id: serial("id").primaryKey(),
  loanId: integer("loan_id").references(() => Loans.id),
  createdBy: varchar("created_by").notNull(),
  scheduledDate: date("scheduled_date").notNull(),
  amount: integer("amount").notNull(),
  principalAmount: integer("principal_amount").notNull(),
  interestAmount: integer("interest_amount").notNull(),
  status: varchar("status").notNull().default("pending"),
  expenseId: integer("expense_id").references(() => Expenses.id),
});


