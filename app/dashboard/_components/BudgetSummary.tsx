'use client'
import { db } from '@/utils/dbConfig'
import { Budgets, Tags, Expenses } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { eq, sql } from 'drizzle-orm'
import { PiggyBank, Receipt, Wallet } from 'lucide-react'

function BudgetSummary() {

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
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-7'>
                <div className='col-span-1 border rounded-lg p-4 flex gap-2 items-center justify-between'>
                    <div>
                        <p>Total Budget</p>
                        <h2 className='font-semibold text-3xl'>$ {total_budget_amount}.00</h2>
                    </div>
                    <div>
                        <PiggyBank size={16} className='bg-primary text-white p-3 h-12 w-12 rounded-full' />
                    </div>
                </div>
                <div className='col-span-1 border rounded-lg p-4 flex gap-2 items-center justify-between'>
                    <div>
                        <p>Total Spent</p>
                        <h2 className='font-semibold text-3xl'>$ {total_amount_spent}.00</h2>
                    </div>
                    <div>
                        <Wallet size={16} className='bg-primary text-white p-3 h-12 w-12 rounded-full' />
                    </div>
                </div>
                <div className='col-span-1 border rounded-lg p-4 flex gap-2 items-center justify-between'>
                    <div>
                        <p>Total Transactions</p>
                        <h2 className='font-semibold text-3xl'>{total_expense_count}</h2>
                    </div>
                    <div>
                        <Receipt size={16} className='bg-primary text-white p-3 h-12 w-12 rounded-full' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BudgetSummary