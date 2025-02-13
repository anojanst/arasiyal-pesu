'use client'
import { useUser } from '@clerk/nextjs'
import { Star } from 'lucide-react'
import React from 'react'

function Upgrade() {
  const { user } = useUser()
  return (
    <div className='p-10'>
      <h1 className='font-semibold text-3xl'>Hi, {user?.fullName} 👋</h1>

      <div className='mt-5 text-center p-12 py-24 border-dashed border-4 rounded-3xl'>
        <h1 className='text-2xl font-semibold'>Exciting AI Features</h1>
        <h1 className='text-5xl font-bold text-primary'>Coming Soon!</h1>
        <p className='text-gray-500 mt-5'>Lots of cool AI Features are coming soon. Get ready to make best out of you earnings!</p>
        {/* list of features */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mt-7'>
          <div className='col-span-1 bg-slate-100 text-semibold rounded-full p-4 flex gap-2 items-center '>
            <Star size={16} className='bg-primary text-white p-2 h-10 w-10 rounded-full' />
            <div>
              <p>AI Spend Analysis</p>
            </div>
          </div>
          <div className='col-span-1 bg-slate-100 text-semibold rounded-full p-4 flex gap-2 items-center '>
            <Star size={16} className='bg-primary text-white p-2 h-10 w-10 rounded-full' />
            <div>
              <p>Subscription Tracker</p>
            </div>
          </div>
          <div className='col-span-1 bg-slate-100 text-semibold rounded-full p-4 flex gap-2 items-center '>
            <Star size={16} className='bg-primary text-white p-2 h-10 w-10 rounded-full' />
            <div>
              <p>Expense Prediction & Forecasting</p>
            </div>
          </div>
          <div className='col-span-1 bg-slate-100 text-semibold rounded-full p-4 flex gap-2 items-center '>
            <Star size={16} className='bg-primary text-white p-2 h-10 w-10 rounded-full' />
            <div>
              <p>Smart Receipt Scanner</p>
            </div>
          </div>

          <div className='col-span-1 bg-slate-100 text-semibold rounded-full p-4 flex gap-2 items-center '>
            <Star size={16} className='bg-primary text-white p-2 h-10 w-10 rounded-full' />
            <div>
              <p>Collaborative Budgeting</p>
            </div>
          </div>

          <div className='col-span-1 bg-slate-100 text-semibold rounded-full p-4 flex gap-2 items-center '>
            <Star size={16} className='bg-primary text-white p-2 h-10 w-10 rounded-full' />
            <div>
              <p>Financial Goals & Challenges</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Upgrade