import React from 'react'
import { Separator } from "@/components/ui/separator"
import KPIrow from './_components/KPIrow'
import SecondRow from './_components/SecondRow'
import ThirdRow from './_components/ThirdRow'

export default function Dashboard() {
  return (
    <div className="w-full">
      <div className='px-4 pt-2'>
        <h3 className='font-medium'>Dashboard</h3>
      </div>
      <div className='p-4'>
        <div>
          <KPIrow />
        </div>
        <div className='py-3'>
          <SecondRow />
        </div>
        <div>
          <ThirdRow />
        </div>
      </div>
    </div>
  )
}

// export default Dashboard
