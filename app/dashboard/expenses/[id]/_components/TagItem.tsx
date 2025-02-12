import { Tag } from '@/app/dashboard/_type/type'
import { Badge } from '@/components/ui/badge'
import React from 'react'

function TagItem(props: { tag: Tag }) {
    const { tag } = props
    return (
        <div className='flex gap-2 items-center justify-between bg-slate-100 p-2 rounded-lg my-2'>
            <div className='flex gap-2 items-center'>
                <div className=" w-full">
                    <h1 className="font-semibold">
                        {tag.name}
                        {tag.expenseCount>0 && <Badge variant="default" className='mx-2 bg-primary font-light'>{`${tag.expenseCount} Expenses`}</Badge>}
                        {tag.totalSpent>0 && <Badge variant="default" className='bg-primary font-light'>{`$${tag.totalSpent} Spent`}</Badge>}
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default TagItem