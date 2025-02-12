import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function BudgetItemSkeleton() {
    return (
        <div className='m-2 border p-2 rounded-lg hover:shadow-md cursor-pointer'>
            <div className="flex gap-2 items-center justify-between">
                <div className='flex gap-2 items-center'>
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex flex-col">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-[100px]" />
                    </div>
                </div>
                <div className='gap-2 items-center'>
                    <Skeleton className="h-4 w-[100px]" />
                </div>
            </div>
            <div className='w-full mt-3 text-md'>
                <div className='flex gap-2 items-center justify-between text-gray-500 text-sm font-medium'>
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[100px]" />
                </div>
                <Skeleton className="h-2 w-full mt-1" />
            </div>
        </div>
    )
}

export default BudgetItemSkeleton