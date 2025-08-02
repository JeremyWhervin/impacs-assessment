"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CustomersTable = {
  customerName: string
  email: string
  recentOrderDate: string
  deliveryDate: string
  customerId: string
}

export const columns: ColumnDef<CustomersTable>[] = [
  {
    accessorKey: "customerName",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email"
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(customer.customerName)}>
              Copy customer name
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/customer/${customer.customerId}`}>
                View customer details
              </Link>
              
            </DropdownMenuItem> 
            <DropdownMenuItem>Edit order details</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Delete customer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]