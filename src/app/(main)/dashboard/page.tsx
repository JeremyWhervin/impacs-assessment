import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { Separator } from "@/components/ui/separator"
import KPIrow from './_components/KPIrow'
import SecondRow from './_components/SecondRow'
import ThirdRow from './_components/ThirdRow'

async function getOrderCount() {
  const supabase = await createClient()
  
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error fetching order count:', error)
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
    console.error('Error fetching customer count:', error)
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
    console.error('Error fetching orders in transit count:', error)
    return 0
  }

  return count || 0
}

async function getToyPopularityData() {
  const supabase = await createClient()
  
  console.log('Fetching toy popularity data...')
  
  // First, let's test if the ordered_toys table exists and get its structure
  const { data: orderedToysData, error: orderedToysError } = await supabase
    .from('ordered_toys')
    .select('*')
    .limit(5)

  if (orderedToysError) {
    console.error('Error fetching ordered_toys table:', orderedToysError)
    console.error('Error details:', orderedToysError.message, orderedToysError.details, orderedToysError.hint)
    return []
  }

  console.log('ordered_toys table structure:', orderedToysData)

  // Now let's test the toys table
  const { data: toysData, error: toysError } = await supabase
    .from('toys')
    .select('*')
    .limit(5)

  if (toysError) {
    console.error('Error fetching toys table:', toysError)
    console.error('Error details:', toysError.message, toysError.details, toysError.hint)
    return []
  }

  console.log('toys table structure:', toysData)

  // Get all ordered_toys data with toy information
  const { data, error } = await supabase
    .from('ordered_toys')
    .select(`
      toy_id,
      toys (
        name
      )
    `)

  if (error) {
    console.error('Error fetching toy popularity data with join:', error)
    console.error('Error details:', error.message, error.details, error.hint)
    return []
  }

  console.log('Raw data from Supabase with join:', data)

  // Count orders for each toy
  const toyCounts: { [key: string]: number } = {}
  
  data?.forEach(item => {
    const toyName = (item.toys as any)?.name || 'Unknown Toy'
    toyCounts[toyName] = (toyCounts[toyName] || 0) + 1
  })

  const transformedData = Object.entries(toyCounts).map(([toy, orders]) => ({
    toy,
    orders
  }))

  console.log('Transformed data:', transformedData)
  return transformedData
}

async function getWeeklyOrdersData() {
  const supabase = await createClient()
  
  console.log('Fetching weekly orders data...')
  
  // Get the last 7 days
  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 6) // 7 days including today
  
  // Format dates to YYYY-MM-DD
  const startDate = sevenDaysAgo.toISOString().split('T')[0]
  const endDate = today.toISOString().split('T')[0]
  
  console.log('Fetching orders from', startDate, 'to', endDate)
  
  // Get all orders within the last 7 days
  const { data, error } = await supabase
    .from('orders')
    .select('order_date')
    .gte('order_date', startDate)
    .lte('order_date', endDate)

  if (error) {
    console.error('Error fetching orders data:', error)
    console.error('Error details:', error.message, error.details, error.hint)
    return []
  }

  console.log('Raw orders data:', data)

  // Count orders for each date
  const dateCounts: { [key: string]: number } = {}
  
  data?.forEach(order => {
    const orderDate = order.order_date
    if (orderDate) {
      dateCounts[orderDate] = (dateCounts[orderDate] || 0) + 1
    }
  })

  // Generate array for last 7 days with counts (including days with 0 orders)
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

  console.log('Transformed weekly orders data:', transformedData)
  return transformedData
}

async function getCustomerLocationData() {
  const supabase = await createClient()
  
  console.log('Fetching customer location data...')
  
  // Get all customers with their delivery addresses
  const { data, error } = await supabase
    .from('customers')
    .select('delivery_address')

  if (error) {
    console.error('Error fetching customer location data:', error)
    console.error('Error details:', error.message, error.details, error.hint)
    return []
  }

  console.log('Raw customer location data:', data)

  // Extract last word from each address and count occurrences
  const locationCounts: { [key: string]: number } = {}
  
  data?.forEach(customer => {
    const address = customer.delivery_address
    if (address) {
      // Split address by spaces and get the last word
      const words = address.trim().split(/\s+/)
      const lastWord = words[words.length - 1]?.toLowerCase()
      
      if (lastWord && lastWord.length > 0) {
        // Capitalize first letter for display
        const location = lastWord.charAt(0).toUpperCase() + lastWord.slice(1)
        locationCounts[location] = (locationCounts[location] || 0) + 1
      }
    }
  })

  // Convert to array format expected by pie chart
  const colors = [
    "#8884d8", // purple
    "#82ca9d", // green
    "#ffc658", // yellow
    "#ff7300", // orange
    "#ff0000", // red
    "#00ff00", // lime
    "#0000ff", // blue
    "#ff00ff", // magenta
    "#00ffff", // cyan
    "#800080"  // purple
  ]

  const transformedData = Object.entries(locationCounts)
    .map(([location, count], index) => ({
      location,
      customers: count,
      fill: colors[index % colors.length]
    }))
    .sort((a, b) => b.customers - a.customers) // Sort by count descending

  console.log('Transformed location data:', transformedData)
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

