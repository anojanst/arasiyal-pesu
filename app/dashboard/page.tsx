'use client'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import BudgetSummary from './_components/BudgetSummary'
import SummaryChart from './_components/SummaryChart'
import BudgetPieChart from './_components/BudgetPieChart'
import BudgetComparisonChart from './_components/BudgetComparisonChart'

function Dashboard() {
  const { user } = useUser()
  return (
    <div className='p-10'>
      <h1 className='font-semibold text-3xl'>Hi, {user?.fullName} 👋</h1>
      <p className='text-gray-500'>Track Smart, Spend Wise, Save More!</p>
      <BudgetSummary />
      <div className='grid grid-cols-1 md:grid-cols-7 gap-5 mt-5'>
        <div className='col-span-3 border rounded-lg p-2 flex gap-2 items-center justify-between'>
          <SummaryChart />
        </div>
        <div className='col-span-2 border rounded-lg p-2 py-5'>
          <BudgetPieChart />
        </div>
        <div className='col-span-2 border rounded-lg p-2 py-5'>
          <BudgetComparisonChart />
        </div>
      </div>
    </div>
  )
}

export default Dashboard