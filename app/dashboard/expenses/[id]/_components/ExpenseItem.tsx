import { Expense } from '@/app/dashboard/_type/type'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { db } from '@/utils/dbConfig'
import { Expenses } from '@/utils/schema'
import { Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import { eq } from 'drizzle-orm'

function ExpenseItem(props: { expense: Expense, refreshData: () => void }) {
    const { expense, refreshData } = props

    const deleteExpense = async (expenseId: number) => {
        const result = await db.delete(Expenses).where(eq(Expenses.id, expenseId)).returning()
        if (result) {
            refreshData()
            toast(`Expense has been deleted.`)
        }
    }
    return (
        <div className='flex justify-between p-3 px-5 bg-slate-100 rounded-xl my-1'>
            <div className='w-[40%] flex justify-start'>{expense.name}</div>
            <div className='w-[20%] flex justify-end font-semibold'>${expense.amount}.00</div>
            <div className='w-[20%] flex justify-center'>{expense.date}</div>
            <div className='w-[15%] flex justify-center'><Badge variant="default" className='bg-primary font-light'>{expense.tagName}</Badge></div>
            <div className='w-[5%] flex justify-end'>
                <Button size="icon" className='h-6 w-6 bg-red-700 hover:bg-red-900' onClick={() => deleteExpense(expense.id)}>
                    <Trash size={10} />
                </Button>
            </div>
        </div>
    )
}

export default ExpenseItem