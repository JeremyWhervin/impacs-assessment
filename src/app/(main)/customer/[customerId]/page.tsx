import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { ExportPDFButton } from '../_components/ExportBTn'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CustomerDetailPageProps {
  params: {
    customerId: string
  }
}

async function getCustomerData(customerId: string) {
  const supabase = await createClient()
  
  
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .single()

  if (customerError || !customer) {
    console.error('Error fetching customer', customerError)
    return null
  }

  
  
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', customerId)
    .order('order_date', { ascending: false })

  if (ordersError) {
    console.error('Error fetching orders', ordersError)
  }

  
  
  const { data: orderedToys, error: toysError } = await supabase
    .from('ordered_toys')
    .select(`
      toy_id,
      toys (
        name
      )
    `)
    .in('order_id', orders?.map(order => order.id) || [])

  if (toysError) {
    console.error('Error fetching ordered toys', toysError)
  }

  return {
    customer,
    orders: orders || [],
    orderedToys: orderedToys || []
  }
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const data = await getCustomerData(params.customerId)

  if (!data) {
    notFound()
  }

  const { customer, orders, orderedToys } = data

  
  
  const uniqueToys = new Set(orderedToys.map(toy => (toy.toys as any)?.name)).size

  return (
    <div className="w-full">
      <div className='px-4 pt-2 flex items-center justify-between'>
        <h3 className='font-medium'>Customer Details</h3>
        <ExportPDFButton customerName={customer.name} />
      </div>
      <div className='p-4 space-y-3 whereToGet'>
        
        
        

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Personal and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Name</h4>
                <p className="text-lg">{customer.name}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Email</h4>
                <p className="text-lg">{customer.email}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Phone</h4>
                <p className="text-lg">{customer.phone || 'Not provided'}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Delivery Address</h4>
                <p className="text-lg">{customer.delivery_address || 'Not provided'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        
        

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Unique Toys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueToys}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Orders in Transit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter(order => !order.delivery_date).length}
              </div>
            </CardContent>
          </Card>
        </div>

        
        

        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>Complete order timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {order.delivery_date 
                        ? new Date(order.delivery_date).toLocaleDateString()
                        : 'Pending'
                      }
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.delivery_date 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.delivery_date ? 'Delivered' : 'In Transit'}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{order.id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        
        



        <Card>
          <CardHeader>
            <CardTitle>Toy Preferences</CardTitle>
            <CardDescription>Toys ordered by this customer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(orderedToys.map(toy => (toy.toys as any)?.name))).map((toyName, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {toyName}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 