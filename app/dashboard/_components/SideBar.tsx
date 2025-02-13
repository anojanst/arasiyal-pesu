'use client'
import { UserButton } from '@clerk/nextjs'
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, Wallet } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function SideBar() {
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
            name: 'Upgrade',
            icon: ShieldCheck,
            path: '/dashboard/upgrade',
        },
    ]

    const params = usePathname()

    return (
        <div className='h-screen p-5 border shadow-sm'>
            <Image src="/logo.png" alt="logo" width={160} height={50} />
            <div className='mt-10'>
                {menuList.map((item) => (
                    <Link key={item.id} href={item.path}>
                        <div key={item.id} className={`flex items-center rounded-md w-full p-4 mt-2 font-medium cursor-pointer hover:text-primary hover:bg-purple-200 ${params === item.path && 'bg-purple-200 text-primary'}`}>
                            <item.icon className='mr-2 text-xl' />
                            <span className='text-sm'>{item.name}</span>
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