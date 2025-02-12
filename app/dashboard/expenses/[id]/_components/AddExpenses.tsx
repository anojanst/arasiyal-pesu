'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { PopoverContent } from '@radix-ui/react-popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Tag } from '@/app/dashboard/_type/type';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

function AddExpenses(props: { refreshData: () => void, tags: Tag[] }) {
    const { refreshData, tags } = props
    const { user } = useUser()
    const [name, setName] = useState('')
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [amount, setAmount] = useState(0)
    const [tagId, setTagId] = useState<number | null>(null)

    const saveExpense = async () => {
        const formattedDate = format(date!, 'yyyy-MM-dd');
        const result = await db.insert(Expenses).values({
            name: name,
            amount: amount,
            createdBy: user?.primaryEmailAddress?.emailAddress!,
            date: formattedDate,
            tagId: tagId

        }).returning({ insertedId: Expenses.id })

        if (result) {
            refreshData()
            toast(`Expense has been created. Budget Id is: ${result[0].insertedId!} `)
            setAmount(0)
            setName('')
            setDate(new Date())
            setTagId(null)
        }
    }

    return (
        <div>
            <div >
                <h2 className='font-semibold'>Add New Budget</h2>
            </div>
            <div className='p-2 border rounded-lg mt-1'>

                <div className='grid grid-cols-2 gap-2'>


                    <div className=' col-span-1'>
                        <Input placeholder='Title - Eg: Groceries' value={name!} className='h-8' onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className=' col-span-1'>
                        <Input placeholder='Amount - Eg: 100' value={amount!} type='number' className='h-8' min={0} onChange={(e) => setAmount(parseInt(e.target.value))} />
                    </div>
                    <div className=' col-span-1'>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full h-8 justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white border border-slate-200 rounded-lg mt-2 z-20" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className=' col-span-1'>
                        <Select onValueChange={(value) => setTagId(parseInt(value))} value={tagId? tagId.toString() : ""}>
                            <SelectTrigger className="w-full h-8">
                                <SelectValue placeholder="Select a Tag" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {tags && tags.map((tag, index) => (
                                        <SelectItem key={index} value={tag.id.toString()}>{tag.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='mt-1 col-span-2'>

                        <Button
                            disabled={!(name && amount && date && tagId)}
                            onClick={() => saveExpense()}
                            className='w-full h-8'>Save Expense</Button>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default AddExpenses