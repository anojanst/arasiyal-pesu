import { Input } from '@/components/ui/input'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

function DashboardHeader() {
  return (
    <div className='p-2 border-bottom flex items-center justify-between shadow-md w-full'>
      <Input type="text" placeholder="Search..." className='md:w-64' />
      <UserButton />
    </div>
  )
}

export default DashboardHeader