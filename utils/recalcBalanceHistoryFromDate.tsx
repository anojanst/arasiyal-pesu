import { sql, and, eq, desc,lt, gte, asc } from "drizzle-orm";
import { db } from "@/utils/dbConfig";
import { BalanceHistory } from "@/utils/schema";
import { get } from "http";

/**
 * Updates the balance history for a given user from a specified date onward.
 * @param createdBy User's email
 * @param date The starting date
 * @param amount The amount to add/deduct
 * @param type Type of transaction ("income" or "expense")
 * @param action Action to perform ("add" or "deduct")
 */

export const createBalanceHistory = async (
  createdBy: string,
  date: string,
  balance: number,
  totalIncome: number,  
  totalExpense: number
) =>{
  try {
    await db
      .insert(BalanceHistory)
      .values({
        createdBy: createdBy,
        date: date,
        totalIncome: totalIncome,
        totalExpense: totalExpense,
        balance: balance,
      })
    } catch (error) {
      console.error("Error updating balance history:", error);
      throw new Error("Failed to update balance history");
    }
}

export const updateBalanceHistory = async (
  createdBy: string,
  date: string,
  balance: number,
  totalIncome: number,
  totalExpense: number
) => {  
  try {
    await db
      .update(BalanceHistory)
      .set({
        totalIncome: totalIncome,
        totalExpense: totalExpense,
        balance: balance,
      })
      .where(and(eq(BalanceHistory.createdBy, createdBy), eq(BalanceHistory.date, date)))
      .returning({ updatedId: BalanceHistory.id })
  } catch (error) { 
    console.error("Error updating balance history:", error);
    throw new Error("Failed to update balance history");
  }
}

export const updateBalanceOnly = async (
  createdBy: string,
  date: string,
) => {  
  try {
    const currentBalanceHistory = await getBalanceByDate(createdBy, date);
    const previousBalance = await getPreviousDateBalance(createdBy, date);
    const balance = previousBalance + currentBalanceHistory.totalIncome - currentBalanceHistory.totalExpense;

    await db
      .update(BalanceHistory)
      .set({
        balance: balance,
      })
      .where(and(eq(BalanceHistory.createdBy, createdBy), eq(BalanceHistory.date, date)))
      .returning({ updatedId: BalanceHistory.id })

  } catch (error) { 
    console.error("Error updating balance history:", error);
    throw new Error("Failed to update balance history");
  }
}

export const upsertSpecificBalanceHistory = async (createdBy: string,
  date: string,
  amount: number,
  type: "income" | "expense",
  action: "add" | "deduct") =>{
  try {
    const currentBalanceHistory = await getBalanceByDate(createdBy, date);
    let total_income = currentBalanceHistory.totalIncome;
    let total_expense = currentBalanceHistory.totalExpense;
    let previousBalance = await getPreviousDateBalance(createdBy, date);
    let balance = previousBalance + currentBalanceHistory.totalIncome - currentBalanceHistory.totalExpense;

    if (type === "income") {
      total_income = action === "add" ? total_income + amount : total_income - amount;
      balance = action === "add" ? balance + amount : balance - amount;
    } else if (type === "expense") {
      total_expense = action === "add" ? total_expense + amount : total_expense - amount;
      balance = action === "add" ? balance - amount : balance + amount;
    }

    if (currentBalanceHistory.id === 0) {
      await createBalanceHistory(createdBy, date, balance, total_income, total_expense);
    }
    else {
      await updateBalanceHistory(createdBy, date, balance, total_income, total_expense);
    }
  } catch (error) {
    console.error("Error recalculating balance history:", error);
    throw new Error("Failed to recalculate balance history");
  }
}

export const recalcBalanceHistoryFromDate = async (
  createdBy: string,
  date: string,
  amount: number,
  type: "income" | "expense",
  action: "add" | "deduct"
) => {
  const update = await upsertSpecificBalanceHistory(createdBy, date, amount, type, action);

  const subsequentBalanceHistory = await getConsecutiveBalanceHistory(createdBy, date);
  for (let i = 0; i < subsequentBalanceHistory.length; i++) {
    await updateBalanceOnly(createdBy, subsequentBalanceHistory[i].date);
  }
};

export const getPreviousDateBalance = async (
  createdBy: string,
  date: string
): Promise<number> => {
  try {
    const result = await db
      .select({ balance: BalanceHistory.balance, date: BalanceHistory.date })
      .from(BalanceHistory)
      .where(and(eq(BalanceHistory.createdBy, createdBy), lt(BalanceHistory.date, date)))
      .orderBy(desc(BalanceHistory.date)) // Get the most recent past date
      .limit(1);
      
    return result.length > 0 ? result[0].balance : 0; // Return balance or 0 if no previous record
  } catch (error) {
    console.error("Error fetching previous balance:", error);
    throw new Error("Failed to retrieve previous balance");
  }
};

export const getConsecutiveBalanceHistory = async (
  createdBy: string,
  date: string
): Promise<{id: number, date: string, balance: number, totalIncome: number, totalExpense: number}[]> => {
  try {
    const result = await db
      .select({ id: BalanceHistory.id, date: BalanceHistory.date, balance: BalanceHistory.balance, totalIncome: BalanceHistory.totalIncome, totalExpense: BalanceHistory.totalExpense })
      .from(BalanceHistory)
      .where(and(eq(BalanceHistory.createdBy, createdBy), gte(BalanceHistory.date, date)))
      .orderBy(asc(BalanceHistory.date))

    return result
  } catch (error) {
    console.error("Error fetching previous balance:", error);
    throw new Error("Failed to retrieve previous balance");
  }
};

export const getBalanceByDate = async (
  createdBy: string,
  date: string
): Promise<{id: number, balance: number, totalIncome: number, totalExpense: number}> => {
  try {
    const result = await db
      .select({ id: BalanceHistory.id, balance: BalanceHistory.balance, totalIncome: BalanceHistory.totalIncome, totalExpense: BalanceHistory.totalExpense })
      .from(BalanceHistory)
      .where(and(eq(BalanceHistory.createdBy, createdBy), eq(BalanceHistory.date, date)))
      .orderBy(desc(BalanceHistory.date)) // Get the most recent past date
      .limit(1);

    return result.length > 0 ? result[0] : { id: 0, balance: 0, totalIncome: 0, totalExpense: 0 }; // Return balance or 0 if no previous record
  } catch (error) {
    console.error("Error fetching previous balance:", error);
    throw new Error("Failed to retrieve previous balance");
  }
};
