"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Edit, Trash2, Check, X } from "lucide-react"
import Link from "next/link"
import { createClient } from '@/utils/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type CustomersTable = {
  customerName: string
  email: string
  recentOrderDate: string
  deliveryDate: string
  customerId: string
}

interface EditCustomerDialogProps {
  customer: CustomersTable
}

function EditCustomerDialog({ customer }: EditCustomerDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: customer.customerName,
    email: customer.email,
    phone: '',
    delivery_address: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('customers')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          delivery_address: formData.delivery_address
        })
        .eq('id', customer.customerId)

      if (error) {
        console.error('Error updating customer:', error)
        alert('Failed to update customer')
        return
      }

      alert('Customer updated successfully!')
      window.location.reload()
      setOpen(false)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to update customer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start font-normal px-2 py-1 rounded-sm">
          Edit details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Customer Details</DialogTitle>
          <DialogDescription>
            Make changes to the customer information here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                value={formData.delivery_address}
                onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface EditableCellProps {
  value: string
  customerId: string
  column: "customerName" | "email"
}

function EditableCell({ value, customerId, column }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentValue, setCurrentValue] = useState(value)
  const [originalValue] = useState(value)

  const handleSave = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('customers')
        .update({ [column === "customerName" ? "name" : "email"]: currentValue })
        .eq('id', customerId)

      if (error) {
        console.error('Error updating customer:', error)
        alert(`Failed to update customer ${column}`)
        setCurrentValue(originalValue)
        return
      }

      setIsEditing(false)
    } catch (error) {
      console.error('Error:', error)
      alert(`Failed to update customer ${column}`)
      setCurrentValue(originalValue)
    }
  }

  const handleCancel = () => {
    setCurrentValue(originalValue)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          className="h-8 w-full max-w-[180px]"
          autoFocus
        />
        <Button size="sm" variant="ghost" onClick={handleSave} className="h-6 w-6 p-0">
          <Check className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="ghost" onClick={handleCancel} className="h-6 w-6 p-0">
          <X className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 group">
      <span>{currentValue}</span>
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={() => setIsEditing(true)} 
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit className="h-3 w-3" />
      </Button>
    </div>
  )
}

export const columns: ColumnDef<CustomersTable>[] = [
  {
    accessorKey: "customerName",
    header: "Name",
    cell: ({ row }) => (
      <EditableCell 
        value={row.getValue("customerName")} 
        customerId={row.original.customerId}
        column="customerName"
      />
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <EditableCell 
        value={row.getValue("email")} 
        customerId={row.original.customerId}
        column="email"
      />
    ),
  },
  {
    accessorKey: "recentOrderDate",
    header: "Recent Order"
  },
  {
    accessorKey: "deliveryDate",
    header: "Delivery date"
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original

      const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
          return
        }

        try {
          const supabase = createClient()
          
          const { data: orders } = await supabase
            .from('orders')
            .select('id')
            .eq('customer_id', customer.customerId)

          if (orders && orders.length > 0) {
            const orderIds = orders.map(order => order.id)
            
            const { error: toyError } = await supabase
              .from('ordered_toys')
              .delete()
              .in('order_id', orderIds)

            if (toyError) {
              console.error('Error deleting ordered toys:', toyError)
            }

            const { error: orderError } = await supabase
              .from('orders')
              .delete()
              .eq('customer_id', customer.customerId)

            if (orderError) {
              console.error('Error deleting orders:', orderError)
            }
          }

          const { error: customerError } = await supabase
            .from('customers')
            .delete()
            .eq('id', customer.customerId)

          if (customerError) {
            alert('Failed to delete customer')
            return
          }

          alert('Customer deleted successfully!')
          window.location.reload()
        } catch (error) {
          alert('Failed to delete customer')
          console.log(error)
        }
      }
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="flex justify-self-end">
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/customer/${customer.customerId}`}>
                View customer details
              </Link>
            </DropdownMenuItem> 
            <DropdownMenuItem asChild>
              <EditCustomerDialog customer={customer} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4 text-red-600" />
              Delete customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]