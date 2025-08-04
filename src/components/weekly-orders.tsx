"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A horizontal bar chart"

// const defaultChartData = [
//   { day: "day 1", orders: 186 },
//   { day: "2025-07-29", orders: 305 },
//   { day: "2025-07-30", orders: 237 },
//   { day: "2025-07-31", orders: 73 },
//   { day: "2025-08-01", orders: 209 },
//   { day: "day 6", orders: 214 },
//   { day: "day 7", orders: 214 },
// ]

const chartConfig = {
  orders: {
    label: "Orders",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface WeeklyOrdersChartProps {
  chartData?: { day: string; orders: number }[]
}

export function WeeklyOrdersChart({ chartData }: WeeklyOrdersChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Orders</CardTitle>
        <CardDescription>Past 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <XAxis type="number" dataKey="orders" hide />
            <YAxis
              dataKey="day"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="orders" fill="var(--color-orders)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          More orders than usual <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total orders by date
        </div>
      </CardFooter>
    </Card>
  )
}
