import { Expense, Income } from '@/app/dashboard/_type/type'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { db } from '@/utils/dbConfig'
import { Incomes } from '@/utils/schema'
import { Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import { eq } from 'drizzle-orm'

function IncomeItem(props: { income: Income, refreshData: () => void }) {
    const { income, refreshData } = props

    const deleteIncome = async (incomeId: number) => {
        const result = await db.delete(Incomes).where(eq(Incomes.id, incomeId)).returning()
        if (result) {
            refreshData()
            toast(`Income has been deleted.`)
        }
    }
    return (
        <div className='flex justify-between p-1 px-5 bg-slate-100 rounded-xl my-1'>
            <div className='w-[50%] flex justify-start'>{income.name}</div>
            <div className='w-[15%] flex justify-end font-semibold'>${income.amount}.00</div>
            <div className='w-[15%] flex justify-end'>{income.date}</div>
            <div className='w-[10%] flex justify-end'>
                <Button size="icon" className='h-6 w-6 bg-red-700 hover:bg-red-900' onClick={() => deleteIncome(income.id)}>
                    <Trash size={10} />
                </Button>
            </div>
        </div>
    )
}

export default IncomeItem