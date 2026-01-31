import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "./ui/chart"

const chartConfig = {
  desktop: {
    label: "occupancy %",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const weeklyData = [
  { day: "Mon", occupancy: 72 },
  { day: "Tue", occupancy: 68 },
  { day: "Wed", occupancy: 78 },
  { day: "Thu", occupancy: 82 },
  { day: "Fri", occupancy: 92 },
  { day: "Sat", occupancy: 65 },
  { day: "Sun", occupancy: 48 },
]

const WeeklyBarChart = () => {
  return (
    <div className="py-8">
      <ChartContainer config={chartConfig} className="min-h-50 w-full">
        <BarChart accessibilityLayer data={weeklyData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            
          />
          <YAxis
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="occupancy" fill="var(--color-desktop)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export default WeeklyBarChart