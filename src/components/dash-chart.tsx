"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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

export const description = "A bar chart"

const defaultChartData = [
  { toy: "Toy Trucks", orders: 186 },
  { toy: "LEGO sets", orders: 305 },
  { toy: "Stuffed Animals", orders: 237 },
  { toy: "Dolls", orders: 73 },
  { toy: "Kitchen sets", orders: 209 },
]

const chartConfig = {
  orders: {
    label: "orders",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface PopularityChartProps {
  chartData?: { toy: string; orders: number }[]
}

export function PopularityChart({ chartData = defaultChartData }: PopularityChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Toy Popularity</CardTitle>
        <CardDescription>All time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="toy"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="orders" fill="var(--color-orders)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total orders for each toy from database
        </div>
      </CardFooter>
    </Card>
  )
}
