'use client'
import { Badge } from '@/components/ui/badge'
import { getPendingRepaymentsCount } from '@/utils/loanUtils'
import { UserButton, useUser } from '@clerk/nextjs'
import { Calculator, Landmark, LayoutGrid, PiggyBank, PocketKnife, ReceiptText, ShieldCheck, Wallet } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function SideBar() {
    const {user} = useUser()
    const [count, setCount] = useState(0)

    const fetchPendingRepaymentsCount = async () => {
        const count = await getPendingRepaymentsCount(user?.primaryEmailAddress?.emailAddress!)
        setCount(count)
    }
    useEffect(() => {
       user && fetchPendingRepaymentsCount()
    }, [user])

    const menuList = [
        {
            id: 1,
            name: 'Dashboard',
            icon: LayoutGrid,
            path: '/dashboard',
        },
        {
            id: 2,
            name: 'Budgets',
            icon: PiggyBank,
            path: '/dashboard/budgets',
        },
        {
            id: 3,
            name: 'Expenses',
            icon: ReceiptText,
            path: '/dashboard/expenses',
        },
        {
            id: 4,
            name: 'Incomes',
            icon: Wallet,
            path: '/dashboard/incomes',
        },
        {
            id: 5,
            name: 'Loans',
            icon: Landmark,
            path: '/dashboard/loans',
        },
        {
            id: 6,
            name: 'Upgrade',
            icon: ShieldCheck,
            path: '/dashboard/upgrade',
        },
        {
            id: 7,
            name: 'Toolkits',
            icon: PocketKnife,
            path: '/dashboard/toolkits',
        },
    ]

    const params = usePathname()

    return (
        <div className='h-screen p-5 border shadow-sm'>
            <Image src="/logo.png" alt="logo" width={160} height={50} />
            <div className='mt-10'>
                {menuList.map((item) => (
                    <Link key={item.id} href={item.path}>
                        <div key={item.id} className={`flex items-center rounded-md w-full p-3 mt-1 font-medium cursor-pointer hover:text-primary hover:bg-purple-200 ${params === item.path && 'bg-purple-200 text-primary'}`}>
                            <item.icon className='mr-2 text-xl' />
                            <span className='text-sm'>{item.name} 
                                {(count > 0 && item.name == "Loans") && <Badge className='ml-2 animate-pulse'>{`${count} Pending`}</Badge>}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="fixed bottom-5 flex gap-3 p-5 items-center">
                <UserButton />
                Profile
            </div>
        </div>
    )
}

export default SideBar