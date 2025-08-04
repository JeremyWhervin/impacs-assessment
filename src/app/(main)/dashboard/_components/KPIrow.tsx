import React from 'react'
import { TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card"


interface KPIrowProps {
  totalOrders: number
  totalCustomers: number
  ordersInTransit: number
}

const KPIrow = ({ totalOrders, totalCustomers, ordersInTransit }: KPIrowProps) => {

  return (
    <div className='sm:flex-row flex flex-col gap-3 w-full'>

      <Card className='flex-1'>
        <CardContent>
            <p className='text-muted-foreground text-sm'>Total Customers</p>
            <p className='font-medium text-4xl mb-4 text-(--chart-1) text-center'>{totalCustomers}</p>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            Growing steadily
          </div>
          <div className="text-muted-foreground leading-none">
            Showing all customers of Big Toy Maker™
          </div>
      </CardFooter>
      </Card>

      <Card className='flex-1'>
        <CardContent>
            <p className=' text-muted-foreground text-sm'>Total Orders</p>
            <p className='font-medium text-4xl mb-4 text-(--chart-1) text-center'>{totalOrders}</p>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            Orders trending up <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Showing total orders for all time
          </div>
      </CardFooter>
      </Card>

      <Card className='flex-1'>
        <CardContent>
            <p className='text-muted-foreground text-sm'>Orders in Transit</p>
            <p className='font-medium text-4xl mb-4 text-(--chart-1) text-center'>{ordersInTransit}</p>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            ETA 2 - 12 weeks
          </div>
          <div className="text-muted-foreground leading-none">
            Packages might never come
          </div>
      </CardFooter>
      </Card>
    </div>
  )
}

export default KPIrow
