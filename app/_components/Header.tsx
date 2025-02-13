import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs'
import Link from 'next/link'

function Header() {
    return (
        <div className='p-5 py-3 flex items-center justify-between shadow-md'>
            <Image src="/logo.png" alt="logo" width={200} height={50} />
            <SignedOut>
                <Button className='font-semibold'>
                    {/* @ts-ignore */}
                    <SignInButton displayName="Get Started" />
                </Button>

            </SignedOut>
            <SignedIn>
                <div className='flex items-center gap-5'>
                <Link href="/dashboard" className='font-semibold p-2 px-4 rounded-md border border-primary text-primary hover:bg-primary hover:text-white'>Dashboard</Link>
                <UserButton />
                </div>
            </SignedIn>
        </div>
    )
}

export default Header