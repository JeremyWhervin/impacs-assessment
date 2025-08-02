"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart showing customer location distribution"

const defaultChartData = [
  { location: "City", customers: 275 },
  { location: "Town", customers: 200 },
  { location: "Village", customers: 187 },
  { location: "District", customers: 173 },
  { location: "Other", customers: 90},
]

const chartConfig = {
  customers: {
    label: "Total Locations",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface GlobalPieProps {
  chartData?: { location: string; customers: number}[]
}

export function GlobalPie({ chartData = defaultChartData }: GlobalPieProps) {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("customers")

  const total = React.useMemo(
    () => ({
      customers: chartData.length,
    }),
    [chartData]
  )

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Customer Location Distribution</CardTitle>
          <CardDescription>
            Based on delivery addresses
          </CardDescription>
        </div>
        <div className="flex">
          <button
            data-active={activeChart === "customers"}
            className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:px-8 sm:py-6"
            onClick={() => setActiveChart("customers")}
          >
            <span className="text-muted-foreground text-xs">
              {chartConfig.customers.label}
            </span>
            <span className="text-lg leading-none font-bold sm:text-3xl">
              {total.customers.toLocaleString()}
            </span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="location"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="customers"
                />
              }
            />
            <Bar 
              dataKey={activeChart} 
              fill="var(--color-customers)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
