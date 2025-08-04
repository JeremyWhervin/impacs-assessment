import React from 'react'

import { PopularityChart } from '@/components/dash-chart'
import { WeeklyOrdersChart } from '@/components/weekly-orders'

interface SecondRowProps {
  toyPopularityData: { toy: string; orders: number }[]
  weeklyOrdersData: { day: string; orders: number }[]
}

const SecondRow = ({ toyPopularityData, weeklyOrdersData }: SecondRowProps) => {

  return (
    <div className='sm:flex-row flex flex-col gap-3'>

      <div className='flex-1'>
        <WeeklyOrdersChart chartData={weeklyOrdersData} />
      </div>

      <div className='flex-1'>
          <PopularityChart chartData={toyPopularityData} />
      </div>
    </div>
  )
}

export default SecondRow
