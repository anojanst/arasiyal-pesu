'use client'
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import BudgetSummary from './_components/BudgetSummary'
import SummaryChart from './_components/SummaryChart'
import BudgetPieChart from './_components/BudgetPieChart'
import BudgetComparisonChart from './_components/BudgetComparisonChart'
import { db } from '@/utils/dbConfig'
import { Budgets, Tags, Expenses } from '@/utils/schema'
import { eq, sql } from 'drizzle-orm'

function Dashboard() {
  const { user } = useUser()
    const [total_amount_spent, setTotalAmountSpent] = useState<number>(0)
    const [total_budget_amount, setTotalBudgetAmount] = useState<number>(0)
    const [total_expense_count, setTotalExpenseCount] = useState<number>(0)

    const getAllBudgetSummaryByUser = async (userEmail: string) => {
        try {
            const totalBudget = await db
                .select({
                    totalBudgetAmount: sql<number>`COALESCE(SUM(${Budgets.amount}), 0)`.as("total_budget_amount"),
                })
                .from(Budgets)
                .where(eq(Budgets.createdBy, userEmail));
    
            const totals = await db
                .select({
                    totalAmountSpent: sql<number>`COALESCE(SUM(${Expenses.amount}), 0)`.as("total_amount_spent"),
                    totalExpenseCount: sql<number>`COUNT(${Expenses.id})`.as("total_expense_count"),
                })
                .from(Budgets)
                .leftJoin(Tags, eq(Tags.budgetId, Budgets.id))
                .leftJoin(Expenses, eq(Expenses.tagId, Tags.id))
                .where(eq(Budgets.createdBy, userEmail));
                
            setTotalBudgetAmount(totalBudget[0].totalBudgetAmount);
            setTotalAmountSpent(totals[0].totalAmountSpent);
            setTotalExpenseCount(totals[0].totalExpenseCount);
    
            return { ...totalBudget[0], ...totals[0] };
        } catch (error) {
            console.error("Error fetching budgets:", error);
            throw new Error("Failed to fetch budgets");
        }
    };
    

    const fetchTotals = async () => {
        const totals = await getAllBudgetSummaryByUser(user?.primaryEmailAddress?.emailAddress!)
        console.log(totals)
    }

    useEffect(() => {
        user && fetchTotals()
    }, [user])

  return (
    <div className='p-10'>
      <h1 className='font-semibold text-3xl'>Hi, {user?.fullName} 👋</h1>
      <p className='text-gray-500'>Track Smart, Spend Wise, Save More!</p>
      <BudgetSummary total_amount_spent={total_amount_spent} total_budget_amount={total_budget_amount} total_expense_count={total_expense_count} />
      {total_expense_count > 0 && (
      <div className='grid grid-cols-1 md:grid-cols-7 gap-5 mt-5'>
        <div className='col-span-3 border rounded-lg p-2 flex gap-2 items-center justify-between'>
          <SummaryChart />
        </div>
        <div className='col-span-2 border rounded-lg p-2 py-5'>
          <BudgetPieChart />
        </div>
        <div className='col-span-2 border rounded-lg p-2 py-5'>
          <BudgetComparisonChart />
        </div>
      </div>)}
    </div>
  )
}

export default Dashboard