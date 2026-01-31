import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "./ui/chart"

const chartConfig = {
  desktop: {
    label: "Occupancy %",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const peakHoursData = [
  { hour: "6 AM", rate: 18 },
  { hour: "8 AM", rate: 52 },
  { hour: "10 AM", rate: 78 },
  { hour: "12 PM", rate: 92 },
  { hour: "2 PM", rate: 88 },
  { hour: "4 PM", rate: 76 },
  { hour: "6 PM", rate: 42 },
  { hour: "8 PM", rate: 22 },
]



const PeakHourOccupancyChart = () => {
  return (
    <div className=" py-8">
      <ChartContainer config={chartConfig} className="min-h-50 w-full">
        <AreaChart accessibilityLayer data={peakHoursData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="hour"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip  content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <defs>
            <linearGradient id="fillOccupancy" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-custom)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-custom)"
                stopOpacity={0.1}
              />
            </linearGradient>
            
          </defs>
          <Area
            dataKey="rate"
            type="natural"
            fill="url(#fillOccupancy)"
            fillOpacity={0.4}
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

export default PeakHourOccupancyChart