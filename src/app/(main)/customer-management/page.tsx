import { createClient } from '@/utils/supabase/server'
import { columns, type CustomersTable } from './columns'
import { DataTable } from './data-table'
import { CreateCustomerButton } from './_components/CreateCustomer'

async function getData(): Promise<CustomersTable[]> {

  // god i hate supabase
  const supabase = await createClient()
  // console.log('SUPABASE INSTANCE:', supabase)

  // gimme customers
  const { data: customers, error: customerError } = await supabase
    .from('customers')
    .select('id, name, email')

  if (customerError) {
    console.error(customerError)
    return []
  }

  // orders
  const { data: orders, error: orderError } = await supabase
    .from('orders')
    .select('id, customer_id, order_date, delivery_date')

  if (orderError) {
    console.error(orderError)
    return []
  }

// fusion
  const result: CustomersTable[] = customers.map((customer) => {
    const customerOrders = orders
      .filter(order => order.customer_id === customer.id)
      .sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())

    const mostRecent = customerOrders[0]

    return {
      customerName: customer.name,
      email: customer.email,
      recentOrderDate: mostRecent?.order_date ?? "No orders",
      deliveryDate: mostRecent?.delivery_date ?? "—",
      customerId: customer.id,
    }
  })

  return result
}


export default async function CustomerManager() {

  const data = await getData()

  return (
    <div className="w-full">
      <div className='px-4 pt-2'>
        <div className="flex items-center justify-between">
          <h3 className='font-medium'>Customer Management</h3>
          <CreateCustomerButton />
        </div>
      </div>
      <div className='p-4'>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

// export default CustomerManager
