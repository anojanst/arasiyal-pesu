'use client'
import React from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Tags } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

function AddTags(props: { refreshData: () => void, budgetId: number }) {
    const { refreshData, budgetId } = props
    const { user } = useUser()
    const [name, setName] = React.useState('')

    const addTag = async () => {
        const result = await db.insert(Tags).values({
            name: name,
            budgetId: budgetId,
            createdBy: user?.primaryEmailAddress?.emailAddress!
        }).returning({ insertedId: Tags.id })

        if (result) {
            refreshData()
            setName('')
            toast(`Tag has been created. Tag Id is: ${result[0].insertedId!} `)
        }
    }

    return (
        <div>
            <div>
                <h2 className='font-semibold'>Add New Tag</h2>
            </div>
            <div className='p-2 border rounded-lg mt-1 h-[133px] flex flex-col justify-between'>
                    <div>
                        <Input value={name} placeholder='Tag Name - Eg: Groceries' className='h-8' onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className='mt-2'>
                        <Button
                            disabled={!(name)}
                            onClick={() => addTag()}
                            className='w-full h-8'>
                            Add Tags
                        </Button>
                    </div>
            </div>
        </div>
    )
}

export default AddTags