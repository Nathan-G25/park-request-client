import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "./ui/chart";

const chartConfig = {
  desktop: {
    label: "Occupancy %",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const chartData = [
  { time: "6 AM", occupancy: 15 },
  { time: "8 AM", occupancy: 45 },
  { time: "10 AM", occupancy: 70 },
  { time: "12 PM", occupancy: 88 },
  { time: "2 PM", occupancy: 78 },
  { time: "4 PM", occupancy: 85 },
  { time: "6 PM", occupancy: 60 },
  { time: "8 PM", occupancy: 35 },
  { time: "10 PM", occupancy: 20 },
];

const OccupancyChart = () => {
  return (
    <div className=" py-8">
      <ChartContainer config={chartConfig} className="min-h-50 w-full">
        <AreaChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <defs>
            <linearGradient id="fillOccupancy" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-desktop)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-desktop)"
                stopOpacity={0.1}
              />
            </linearGradient>
            
          </defs>
          <Area
            dataKey="occupancy"
            type="natural"
            fill="url(#fillOccupancy)"
            fillOpacity={0.4}
          
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default OccupancyChart;
