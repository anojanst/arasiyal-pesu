import { Loan, LoanRepayment } from '@/app/dashboard/_type/type'
import { Button } from '@/components/ui/button'
import { db } from '@/utils/dbConfig'
import { Incomes, LoanRepayments, Loans } from '@/utils/schema'
import { Trash, View } from 'lucide-react'
import React, { use, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { eq } from 'drizzle-orm'
import { recalcBalanceHistoryFromDate } from '@/utils/recalcBalanceHistoryFromDate'
import { useUser } from '@clerk/nextjs'
import { checkUpcomingPayments, deleteLoan, getLoanSummary, getUpcomingPaymentsForLoan, markRepaymentAsPaid } from '@/utils/loanUtils'
import { check } from 'drizzle-orm/mysql-core'
import { get } from 'http'
import { Badge } from '@/components/ui/badge'
import AddExtraPayment from './AddExtraPayment'

function IncomeItem(props: { loan: Loan, refreshData: () => void }) {
    const { loan, refreshData } = props
    const { user } = useUser()
    const [viewLoan, setViewLoan] = useState(false)
    const [upcomingPayments, setUpcomingPayments] = useState<LoanRepayment[]>([])

    const triggerDeleteLoan = async (loanId: number) => {
        await deleteLoan(loanId, user?.primaryEmailAddress?.emailAddress!)

        refreshData()
        toast(`loan has been deleted.`)
    }
    const fetchUpcomingPayments = async () => {
        const upcomingPayments = await getUpcomingPaymentsForLoan(loan.id)
        setUpcomingPayments(upcomingPayments)
    }
    const triggerPayment = async (repaymentId: number, amount: number, principalAmount: number) => {
        await markRepaymentAsPaid(repaymentId, loan.id, amount, loan.createdBy, principalAmount)
        fetchUpcomingPayments()
    }
    useEffect(() => {
        fetchUpcomingPayments()
    }, [user])
    return (
        <div>
            <div className='flex justify-between p-1 px-5 bg-slate-100 rounded-xl my-1 text-sm'>
                <div className='w-[30%] flex justify-start'>{loan.lender}</div>
                <div className='w-[15%] flex justify-end text-right font-semibold'>${loan.principalAmount}.00</div>
                <div className='w-[15%] flex justify-start'>{loan.tenureMonths} payments</div>
                <div className='w-[20%] flex justify-start'>{loan.nextDueDate}</div>
                <div className='w-[10%] flex justify-end gap-2'>
                    <Button size="icon" className='h-6 w-6 bg-green-700 hover:bg-red-900' onClick={() => setViewLoan(!viewLoan)}>
                        <View size={10} />
                    </Button>
                    <Button size="icon" className='h-6 w-6 bg-red-700 hover:bg-red-900' onClick={() => triggerDeleteLoan(loan.id)}>
                        <Trash size={10} />
                    </Button>
                </div>
            </div>
            {
                viewLoan && (
                    <div className=' ml-5 text-sm'>
                        <AddExtraPayment loanId={loan.id} refreshData={fetchUpcomingPayments} />
                        <div className='w-full p-1 px-4 my-1 flex font-semibold justify-between bg-slate-300 rounded-xl '>
                            <div className='w-[20%]'>Date</div>
                            <div className='w-[20%] text-right'>Total</div>
                            <div className='w-[20%] text-right'>Principal</div>
                            <div className='w-[20%] text-right'>Interest</div>
                            <div className='w-[20%] flex items-end justify-end'>Status</div>
                        </div>
                        {
                            upcomingPayments.map((payment, index) => (
                                <div key={index} className='w-full p-1 px-4 my-1 flex justify-between bg-slate-300 rounded-xl '>
                                    <div className='w-[20%]'>{payment.scheduledDate}</div>
                                    <div className='w-[20%] text-right'>${payment.amount}.00</div>
                                    <div className='w-[20%] text-right'>${payment.principalAmount}.00</div>
                                    <div className='w-[20%] text-right'>${payment.interestAmount}.00</div>
                                    <div className='w-[20%] flex items-end justify-end'>{payment.status === "pending" ? <Button size="icon" className='h-6 px-2 w-24 bg-green-700 hover:bg-red-900' onClick={() => triggerPayment(payment.id, payment.amount, payment.principalAmount)}>Mark as Paid</Button> : <Badge variant="default" className='bg-primary font-light'>Paid</Badge>}</div>
                                </div>
                            ))
                        }
                    </div>
                )
            }

        </div>
    )
}

export default IncomeItem