import React from 'react'
// import { TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent
} from "@/components/ui/card"

const KPIrow = () => {
  return (
    <div className='sm:flex-row flex flex-col gap-3 w-full'>

      <Card className='flex-1'>
        <CardContent>
            <p className='text-muted-foreground text-sm'>Total Customers</p>
            <p className='font-medium text-xl mb-4'>30</p>
            <p className='font-medium text-sm'>1 new customer this month</p>
            <p className='text-muted-foreground text-sm'>4 new customers in the past 6 months</p>
        </CardContent>
      </Card>

      <Card className='flex-1'>
        <CardContent>
            <p className=' text-muted-foreground text-sm'>Total Orders</p>
            <p className='font-medium text-xl mb-4'>60?</p>
            <p className='font-medium text-sm'>12 orders this month</p>
            <p className=' text-muted-foreground text-sm'>112 orders in the past 6 months</p>
        </CardContent>
      </Card>

      <Card className='flex-1'>
        <CardContent>
            <p className='text-muted-foreground text-sm'>Orders in Transit</p>
            <p className='font-medium text-xl mb-4'>10?</p>
            <p className='font-medium text-sm'>Delivery speed slowing down</p>
            <p className='text-muted-foreground text-sm'>man idk</p>
        </CardContent>
      </Card>

      <Card className='flex-1'>
        <CardContent>
            <p className='text-muted-foreground text-sm'>Late Orders</p>
            <p className='font-medium text-xl mb-4'>1</p>
            <p className='font-medium text-sm'>Speed improving</p>
            <p className='text-muted-foreground text-sm'>figure this out</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default KPIrow
