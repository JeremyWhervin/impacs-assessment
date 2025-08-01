import React from 'react'
import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ]
}

export default async function CustomerManager() {

  const data = await getData()

  return (
    <div className="w-full">
      <div className='px-4 pt-2'>
        <h3 className='font-medium'>Customer Management</h3>
      </div>
      <div className='p-4'>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

// export default CustomerManager
