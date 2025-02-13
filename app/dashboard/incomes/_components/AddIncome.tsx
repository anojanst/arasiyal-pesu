'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Incomes } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { format } from "date-fns";

function AddIncome(props: { refreshData: () => void }) {
    const { refreshData } = props;
    const { user } = useUser();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

    const saveIncome = async () => {
        const result = await db.insert(Incomes).values({
            name: name,
            amount: amount,
            createdBy: user?.primaryEmailAddress?.emailAddress!,
            date: date
        }).returning({ insertedId: Incomes.id });

        if (result) {
            refreshData();
            toast(`Income has been added. Income Id is: ${result[0].insertedId!}`);
            setName('');
            setAmount(0);
            setDate(format(new Date(), 'yyyy-MM-dd'));
        }
    };

    return (
        <div>
            <div className='p-3 border rounded-lg'>
                <h2 className='font-semibold mb-4'>Add New Income</h2>
                <div className='grid grid-cols-1 gap-2'>
                    <div className='col-span-1'>
                        <h1 className='text-sm font-semibold'>Source Name</h1>
                        <Input placeholder='Source - Eg: Salary' value={name} className='h-8' onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className='col-span-1'>
                        <h1 className='text-sm font-semibold'>Amount</h1>
                        <Input placeholder='Amount - Eg: 1000' value={amount} type='number' className='h-8' min={0} onChange={(e) => setAmount(parseInt(e.target.value))} />
                    </div>
                    <div className='col-span-1'>
                        <h1 className='text-sm font-semibold'>Date</h1>
                        <Input placeholder='date' value={date} type='date' className='h-8' onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className='mt-1 col-span-1'>
                        <Button
                            disabled={!(name && amount && date)}
                            onClick={saveIncome}
                            className='w-full h-8'>Save Income</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddIncome;