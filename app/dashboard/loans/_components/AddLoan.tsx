'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from '@/utils/dbConfig';
import { Loans } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { format, set } from "date-fns";
import { addLoanWithRepayments } from '@/utils/loanUtils';

function AddLoan(props: { refreshData: () => void }) {
    const { refreshData } = props;
    const { user } = useUser();
    
    const [lender, setLender] = useState('');
    const [amount, setAmount] = useState(0);
    const [interestRate, setInterestRate] = useState(0);
    const [tenure, setTenure] = useState(12); // Default: 12 months
    const [repaymentFrequency, setRepaymentFrequency] = useState<string>("monthly");
    const [nextDueDate, setNextDueDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

    const saveLoan = async () => {
        if (!user?.primaryEmailAddress?.emailAddress) return;

        await addLoanWithRepayments(
            user.primaryEmailAddress.emailAddress,
            lender,
            amount,
            interestRate,
            tenure,
            repaymentFrequency as "monthly" | "bimonthly" | "weekly",
            nextDueDate
        );

        refreshData();
        toast(`Loan has been added.`);
        
        // Reset fields
        setLender('');
        setAmount(0);
        setInterestRate(0);
        setTenure(12);
        setRepaymentFrequency("monthly");
        setNextDueDate(format(new Date(), 'yyyy-MM-dd'));
    };

    return (
        <div>
            <div className='p-3 border rounded-lg'>
                <h2 className='font-semibold mb-4'>Add New Loan</h2>
                <div className='grid grid-cols-1 gap-2'>
                    <div className='col-span-1'>
                        <h1 className='text-sm font-semibold mb-2'>Lender Name</h1>
                        <Input placeholder='Lender - Eg: Bank XYZ' value={lender} className='h-8' onChange={(e) => setLender(e.target.value)} />
                    </div>
                    <div className='col-span-1'>
                        <h1 className='text-sm font-semibold mb-2'>Loan Amount</h1>
                        <Input placeholder='Amount - Eg: 5000' value={amount} type='number' className='h-8' min={0} onChange={(e) => setAmount(parseInt(e.target.value))} />
                    </div>
                    <div className='col-span-1'>
                        <h1 className='text-sm font-semibold mb-2'>Interest Rate (%)</h1>
                        <Input placeholder='Eg: 5.5' value={interestRate} type='number' className='h-8' min={0} step="0.1" onChange={(e) => setInterestRate(parseFloat(e.target.value))} />
                    </div>
                    <div className='col-span-1'>
                        <h1 className='text-sm font-semibold mb-2'>Tenure (Months)</h1>
                        <Input placeholder='Eg: 24' value={tenure} type='number' className='h-8' min={1} onChange={(e) => setTenure(parseInt(e.target.value))} />
                    </div>
                    <div className='col-span-1'>
                        <h1 className='text-sm font-semibold mb-2'>Repayment Frequency</h1>
                        <Select value={repaymentFrequency} onValueChange={setRepaymentFrequency}>
                            <SelectTrigger className="h-8">
                                <SelectValue placeholder="Select repayment frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="bimonthly">Bimonthly</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='col-span-1'>
                        <h1 className='text-sm font-semibold mb-2'>Next Due Date</h1>
                        <Input placeholder='Start Date' value={nextDueDate} type='date' className='h-8' onChange={(e) => setNextDueDate(e.target.value)} />
                    </div>
                    <div className='mt-1 col-span-1'>
                        <Button
                            disabled={!(lender && amount && interestRate && tenure && nextDueDate && repaymentFrequency)}
                            onClick={saveLoan}
                            className='w-full h-8'>Save Loan</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddLoan;
