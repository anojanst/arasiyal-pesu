import React from 'react'
import { Budget } from '../../_type/type'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

function BudgetItem(props: { budget: Budget }) {
    const { budget } = props

    const getPercentage = () => {
        return (budget.totalSpent / budget.amount) * 100
    }

    return (
        <Link href={`/dashboard/expenses/${budget.id}`} className={`border p-2 rounded-lg hover:shadow-md cursor-pointer ${getPercentage()>100 && 'bg-red-100 border-red-600 border-2 animate-pulse'}`}>
            <div className="flex gap-2 items-center justify-between">
                <div className='flex gap-2 items-center'>
                    <h2 className='p-3 text-2xl bg-slate-100 rounded-full'>{budget.icon}</h2>

                    <div className="flex flex-col">
                        <div className="text-xl font-bold">{budget.name}</div>
                        <div className="text-sm text-black">{budget.expenseCount ? `${budget.expenseCount} Expenses` : 'No Expenses'}</div>
                    </div>
                </div>
                <div className='gap-2 items-center'>
                    <div className="text-lg font-semibold text-primary">$ {budget.amount}</div>
                </div>
            </div>
            <div className={`w-full mt-3 text-md`}>
                <div className='flex gap-2 items-center justify-between text-gray-500 text-sm font-medium'>
                    <p>{`$${budget.totalSpent} spent`}</p>
                    <p>{`$${budget.amount - budget.totalSpent} remaining`}</p>
                </div>
                <Progress value={getPercentage()<100? getPercentage() : 100} className='h-2 mt-1' />
            </div>
        </Link>
    )
}

export default BudgetItem