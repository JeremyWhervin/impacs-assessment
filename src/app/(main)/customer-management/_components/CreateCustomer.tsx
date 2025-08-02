"use client"

import { useState } from "react"
import { Plus, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CustomerFormData {
  name: string
  email: string
  phone: string
  delivery_address: string
  order_date: Date | undefined
  delivery_date: Date | undefined
  toy_id: string
  quantity: number
}

export function CreateCustomerButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    delivery_address: '',
    order_date: undefined,
    delivery_date: undefined,
    toy_id: '',
    quantity: 1
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      // Create customer
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          delivery_address: formData.delivery_address
        })
        .select()
        .single()

      if (customerError) {
        console.error('Error creating customer:', customerError)
        alert('Failed to create customer')
        return
      }

      console.log('Customer created successfully:', customer)

      // Create order if order date is provided
      if (formData.order_date && customer) {
        const orderDate = formData.order_date.toISOString().split('T')[0]
        const deliveryDate = formData.delivery_date?.toISOString().split('T')[0] || null

        console.log('Creating order with:', {
          customer_id: customer.id,
          order_date: orderDate,
          delivery_date: deliveryDate
        })

        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            customer_id: customer.id,
            order_date: orderDate,
            delivery_date: deliveryDate,
            delivery_address: formData.delivery_address || customer.delivery_address
          })
          .select()
          .single()

        if (orderError) {
          console.error('Error creating order:', orderError)
          console.error('Order error details:', {
            message: orderError.message,
            details: orderError.details,
            hint: orderError.hint
          })
          alert(`Customer created but failed to create order: ${orderError.message}`)
          return
        }

        console.log('Order created successfully:', order)

        // Create ordered_toy if toy is selected
        if (formData.toy_id && order) {
          console.log('Creating ordered toy with:', {
            order_id: order.id,
            toy_id: formData.toy_id,
            quantity: formData.quantity
          })

          const { error: orderedToyError } = await supabase
            .from('ordered_toys')
            .insert({
              order_id: order.id,
              toy_id: formData.toy_id,
              quantity: formData.quantity
            })

          if (orderedToyError) {
            console.error('Error creating ordered toy:', orderedToyError)
            console.error('Toy error details:', {
              message: orderedToyError.message,
              details: orderedToyError.details,
              hint: orderedToyError.hint
            })
            alert(`Customer and order created but failed to add toy: ${orderedToyError.message}`)
            return
          }

          console.log('Ordered toy created successfully')
        }
      }

      alert('Customer created successfully!')
      setOpen(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        delivery_address: '',
        order_date: undefined,
        delivery_date: undefined,
        toy_id: '',
        quantity: 1
      })

      window.location.reload()
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create customer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] max-h-[80vh] overflow-y-auto p-4 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Heading */}
          <div>
            <h4 className="font-medium text-base leading-none">Customer Info</h4>
            <p className="text-sm text-muted-foreground">Basic details about the customer</p>
          </div>

          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Phone */}
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Address */}
          <div className="grid gap-2">
            <Label htmlFor="address">Delivery Address</Label>
            <Input
              id="address"
              value={formData.delivery_address}
              onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
            />
          </div>

          {/* Order Details Section */}
          <div>
            <h4 className="font-medium text-base leading-none">Order Info (Optional)</h4>
            <p className="text-sm text-muted-foreground">Add order and toy if available</p>
          </div>

          {/* Order Date */}
          <div className="grid gap-2">
            <Label>Order Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.order_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.order_date ? format(formData.order_date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.order_date}
                  onSelect={(date) => setFormData({ ...formData, order_date: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Delivery Date */}
          <div className="grid gap-2">
            <Label>Delivery Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.delivery_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.delivery_date ? format(formData.delivery_date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.delivery_date}
                  onSelect={(date) => setFormData({ ...formData, delivery_date: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Toy Select */}
          <div className="grid gap-2">
            <Label htmlFor="toy">Toy</Label>
            <Select value={formData.toy_id} onValueChange={(value) => setFormData({ ...formData, toy_id: value })}>
              <SelectTrigger id="toy">
                <SelectValue placeholder="Select a toy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12fab815-5aad-4aa3-8aad-f54e7036442f">Truck</SelectItem>
                <SelectItem value="3844adb8-c7c5-4e7c-aaa5-06909e0c0a89">LEGO set</SelectItem>
                <SelectItem value="1c2f1674-2e16-4fcd-be33-19f1473e8ca0">Stuffed Animal</SelectItem>
                <SelectItem value="0a443113-d7c2-4aa1-b1a2-5811a562d707">Doll</SelectItem>
                <SelectItem value="ce3da778-bfc8-4935-a518-2bb9034615f4">Kitchen set</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) || 1 })}
              min="1"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
