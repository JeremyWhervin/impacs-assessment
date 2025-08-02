import React from 'react'
import { GlobalPie } from '@/components/line-chart'

interface ThirdRowProps {
  customerLocationData: { location: string; customers: number; fill: string }[]
}

const ThirdRow = ({ customerLocationData }: ThirdRowProps) => {
  return (
    <div>
        <GlobalPie chartData={customerLocationData} />
    </div>
  )
}

export default ThirdRow
