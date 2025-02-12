import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs'

function Header() {
    return (
        <div className='p-5 py-3 flex items-center justify-between shadow-md'>
            <Image src="/logo.png" alt="logo" width={200} height={50} />
            <SignedOut>
                <Button className='font-semibold'>
                    <SignInButton displayName="Get Started" />
                </Button>

            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    )
}

export default Header