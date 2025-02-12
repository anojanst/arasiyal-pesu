'use client'
import React from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Budgets } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

function CreateBudget(props: { refreshData: () => void }) {
    const { refreshData } = props
    const { user } = useUser()
    const [emojiIcon, setEmojiIcon] = React.useState('😀')
    const [openEmojiPicker, setOpenEmojiPicker] = React.useState(false)
    const [name, setName] = React.useState('')
    const [amount, setAmount] = React.useState(0)
    const createBudget = async () => {
        const result = await db.insert(Budgets).values({
            name: name,
            amount: amount,
            icon: emojiIcon,
            createdBy: user?.primaryEmailAddress?.emailAddress!
        }).returning({ insertedId: Budgets.id })

        if (result) {
            refreshData()
            toast(`Budget has been created. Budget Id is: ${result[0].insertedId!} `)
            setAmount(0)
            setName('')
        }
    }
    return (
        <Dialog>
            <DialogTrigger>
                <div className='bg-slate-100 p-10 py-7 max-h-[150px] rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-lg'>
                    <h2 className='text-2xl'>+</h2>
                    <h2>Create New Budget</h2>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Budget!</DialogTitle>
                    <div>
                        <Button variant="outline" className='text-xl mt-2'
                            onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                            {emojiIcon}
                        </Button>

                        <div className='absolute z-20 py-3'>
                            <EmojiPicker
                                open={openEmojiPicker}
                                onEmojiClick={(e) => {
                                    setEmojiIcon(e.emoji)
                                    setOpenEmojiPicker(false)
                                }} />
                        </div>

                        <div className='mt-2'>
                            <h2 className="font-semibold my-1">Budget Title</h2>
                            <Input placeholder='Eg: Groceries' onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className='mt-2'>
                            <h2 className="font-semibold my-1">Budget Amount</h2>
                            <Input placeholder='Eg: 100' type='number' min={0} onChange={(e) => setAmount(parseInt(e.target.value))} />
                        </div>
                        <div className='mt-2'>

                        </div>

                    </div>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button
                            disabled={!(name && amount)}
                            onClick={() => createBudget()}
                            className='w-full'>Create Budget</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateBudget