"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"

export const description = "A pie chart with a legend"

const defaultChartData = [
  { location: "City", customers: 275, fill: "#8884d8" },
  { location: "Town", customers: 200, fill: "#82ca9d" },
  { location: "Village", customers: 187, fill: "#ffc658" },
  { location: "District", customers: 173, fill: "#ff7300" },
  { location: "Other", customers: 90, fill: "#ff0000" },
]

const chartConfig = {
  customers: {
    label: "Customers",
  },
} satisfies ChartConfig

interface GlobalPieProps {
  chartData?: { location: string; customers: number; fill: string }[]
}

export function GlobalPie({ chartData = defaultChartData }: GlobalPieProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Customer Location Distribution</CardTitle>
        <CardDescription>Based on delivery addresses</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie 
              data={chartData} 
              dataKey="customers" 
              nameKey="location"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
            />
          </PieChart>
        </ChartContainer>
        
        {/* Custom Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="h-4 w-4 rounded-full" 
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm font-medium">
                {item.location} ({item.customers})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
