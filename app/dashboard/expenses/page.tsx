'use client'
import { Budgets, Expenses, Tags } from '@/utils/schema'
import { useEffect, useState } from 'react'
import { eq, sql, and, desc, asc } from 'drizzle-orm'
import { db } from '@/utils/dbConfig'
import { useUser } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import { Budget, Expense } from '../_type/type'
import ExpenseItem from './[id]/_components/ExpenseItem'
import { Skeleton } from '@/components/ui/skeleton'

function ExpensesScreen() {
  const { user } = useUser()
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    user && fetchData()
  }, [user])

  const fetchData = async () => {
    const expenses = await getExpenses(user?.primaryEmailAddress?.emailAddress!)
    setExpenses(expenses)
  }

  const getExpenses = async ( userEmail: string) => {
    try {
      const expenses = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdBy: Expenses.createdBy,
          date: Expenses.date,
          tagId: Expenses.tagId,
          tagName: Tags.name,
        })
        .from(Expenses)
        .innerJoin(Tags, eq(Expenses.tagId, Tags.id))
        .innerJoin(Budgets, eq(Tags.budgetId, Budgets.id))
        .where(and(eq(Expenses.createdBy, userEmail)))
        .groupBy(Expenses.date)
        .orderBy(asc(Expenses.date));

      return expenses;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw new Error("Failed to fetch expenses");
    }
  }

  return (
    <div className='p-10'>
      <div className='flex justify-between pb-3 border-b-2 border-b-slate-100'>
        <h1 className='font-bold text-3xl'>My Expenses</h1>
      </div>
      
      <div className='grid grid-cols-1 mt-4'>
        <div className='col-span-1'>
          {expenses.length > 0 ? expenses.map((expense, index) => (
            <ExpenseItem key={index} expense={expense} refreshData={() => fetchData()} />
          )) : <Skeleton className='h-10 w-full' />}
        </div>
        
      </div>
    </div>
  )
}

export default ExpensesScreen