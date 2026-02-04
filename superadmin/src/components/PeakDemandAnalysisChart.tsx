import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./ui/chart";

const chartConfig = {
  desktop: {
    label: "Reservations",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const demandData = [
  { time: "6AM", reservations: 120 },
  { time: "8AM", reservations: 450 },
  { time: "10AM", reservations: 380 },
  { time: "12PM", reservations: 520 },
  { time: "2PM", reservations: 410 },
  { time: "4PM", reservations: 580 },
  { time: "6PM", reservations: 620 },
  { time: "8PM", reservations: 340 },
  { time: "10PM", reservations: 180 },
];

const PeakDemandAnalysisChart = () => {
  return (
    <div className=" py-8">
      <ChartContainer config={chartConfig} className="max-h-60 w-full">
        <AreaChart accessibilityLayer data={demandData}>
          <CartesianGrid vertical={true} />
          <XAxis
            dataKey="time"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="fillReservations" x1="0" y1="0" x2="0" y2="1">
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
            dataKey="reservations"
            type="natural"
            fill="url(#fillReservations)"
            fillOpacity={0.4}
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default PeakDemandAnalysisChart;
