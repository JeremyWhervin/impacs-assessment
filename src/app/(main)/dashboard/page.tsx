import React from 'react'
import { createClient } from '@/utils/supabase/server'
import KPIrow from './_components/KPIrow'
import SecondRow from './_components/SecondRow'
import ThirdRow from './_components/ThirdRow'


async function getOrderCount() {
  const supabase = await createClient()
  
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error(error)
    return 0
  }

  return count || 0
}

async function getCustomerCount() {
  const supabase = await createClient()
  
  const { count, error } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('customer count error', error)
    return 0
  }

  return count || 0
}

async function getOrdersInTransitCount() {
  const supabase = await createClient()
  
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .is('delivery_date', null)

  if (error) {
    console.error('null orders error', error)
    return 0
  }

  return count || 0
}

// async function getToyPopularityData() {
//   const supabase = await createClient()
  

  

//   const { data: orderedToysData, error: orderedToysError } = await supabase
//     .from('ordered_toys')
//     .select('*')
//     .limit(5)

//   if (orderedToysError) {
//     console.error('ordered toys error', orderedToysError.message, orderedToysError.details, orderedToysError.hint)
//     return []
//   }

//   console.log(orderedToysData)

//   const { data: toysData, error: toysError } = await supabase
//     .from('toys')
//     .select('*')
//     .limit(5)

//   if (toysError) {
//     console.error('toy error', toysError.message, toysError.details, toysError.hint)
//     return []
//   }

//   console.log(toysData)


//   const { data, error } = await supabase
//     .from('ordered_toys')
//     .select(`
//       toy_id,
//       toys (
//         name
//       )
//     `)

//   if (error) {
//     console.error('Error details', error.message, error.details, error.hint)
//     return []
//   }

//   // console.log(data)


//   const toyCounts: { [key: string]: number } = {}
  
//   data?.forEach(item => {
//     const toyName = (item.toys as { name: string }[])[0]?.name || 'Unknown Toy'
//     toyCounts[toyName] = (toyCounts[toyName] || 0) + 1
//   })

//   const transformedData = Object.entries(toyCounts).map(([toy, orders]) => ({
//     toy,
//     orders
//   }))

//   console.log('Transformed data', transformedData)
//   return transformedData
// }


async function getToyPopularityData() {
  const supabase = await createClient()

  // Select the toy_id and join with the toys table to get the name.
  const { data, error } = await supabase
    .from('ordered_toys')
    .select(`
      toy_id,
      toys (
        name
      )
    `)

  if (error) {
    console.error('Error details', error.message, error.details, error.hint)
    return []
  }

  // Use a Map for more efficient counting than a plain object.
  const toyCounts = new Map()

  data?.forEach(item => {
    // Access the name property directly.
    const toyName = item.toys?.name || 'Unknown Toy'
    toyCounts.set(toyName, (toyCounts.get(toyName) || 0) + 1)
  })

  // Transform the Map into an array of objects.
  const transformedData = Array.from(toyCounts.entries()).map(([toy, orders]) => ({
    toy,
    orders
  }))

  console.log('Transformed data', transformedData)
  return transformedData
}

async function getWeeklyOrdersData() {
  const supabase = await createClient()
  
  

  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 6)
  

  const startDate = sevenDaysAgo.toISOString().split('T')[0]
  const endDate = today.toISOString().split('T')[0]
  
  // console.log('Fetching orders from', startDate, 'to', endDate)
  

  const { data, error } = await supabase
    .from('orders')
    .select('order_date')
    .gte('order_date', startDate)
    .lte('order_date', endDate)

  if (error) {
    console.error('Error details:', error.message, error.details, error.hint)
    return []
  }

  // console.log(data)

  // Count orders
  const dateCounts: { [key: string]: number } = {}
  
  data?.forEach(order => {
    const orderDate = order.order_date
    if (orderDate) {
      dateCounts[orderDate] = (dateCounts[orderDate] || 0) + 1
    }
  })

  
  const transformedData = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo)
    date.setDate(sevenDaysAgo.getDate() + i)
    const dateString = date.toISOString().split('T')[0]
    
    transformedData.push({
      day: dateString,
      orders: dateCounts[dateString] || 0
    })
  }

  // console.log(transformedData)
  return transformedData
}

async function getCustomerLocationData() {
  const supabase = await createClient()
  
  // console.log('Fetching customer location data...')
  

  const { data, error } = await supabase
    .from('customers')
    .select('delivery_address')

  if (error) {
    console.error('Error details:', error.message, error.details, error.hint)
    return []
  }

  // console.log(data)


  const locationCounts: { [key: string]: number } = {}
  
  data?.forEach(customer => {
    const address = customer.delivery_address
    if (address) {
      // get last word
      const words = address.trim().split(/\s+/)
      const lastWord = words[words.length - 1]?.toLowerCase()
      
      if (lastWord && lastWord.length > 0) {
        const location = lastWord.charAt(0).toUpperCase() + lastWord.slice(1)
        locationCounts[location] = (locationCounts[location] || 0) + 1
      }
      
    }
  })

  const transformedData = Object.entries(locationCounts)
    .map(([location, count]) => ({
      location,
      customers: count,
    }))
    .sort((a, b) => b.customers - a.customers)

  // console.log(transformedData)
  return transformedData
}

export default async function Dashboard() {
  const [totalOrders, totalCustomers, ordersInTransit, toyPopularityData, weeklyOrdersData, customerLocationData] = await Promise.all([
    getOrderCount(),
    getCustomerCount(),
    getOrdersInTransitCount(),
    getToyPopularityData(),
    getWeeklyOrdersData(),
    getCustomerLocationData()
  ])

  return (
    <div className="w-full">
      <div className='px-4 pt-2'>
        <h3 className='font-medium'>Dashboard</h3>
      </div>
      <div className='p-4'>
        <div>
          <KPIrow 
            totalOrders={totalOrders} 
            totalCustomers={totalCustomers}
            ordersInTransit={ordersInTransit}
          />
        </div>
        <div className='py-3'>
          <SecondRow 
            toyPopularityData={toyPopularityData} 
            weeklyOrdersData={weeklyOrdersData}
          />
        </div>
        <div>
          <ThirdRow customerLocationData={customerLocationData} />
        </div>
      </div>
    </div>
  )
}

