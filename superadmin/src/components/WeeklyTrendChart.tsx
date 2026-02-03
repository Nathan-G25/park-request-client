import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./ui/chart";

const chartConfig = {
  onStreet: { label: "onStreet", color: "#3b82f6" },
  offStreet: { label: "offStreet", color: "#10b981" },
} satisfies ChartConfig;

const weeklyTrend = [
  { day: "Mon", onStreet: 78, offStreet: 82 },
  { day: "Tue", onStreet: 82, offStreet: 85 },
  { day: "Wed", onStreet: 85, offStreet: 88 },
  { day: "Thu", onStreet: 80, offStreet: 84 },
  { day: "Fri", onStreet: 92, offStreet: 95 },
  { day: "Sat", onStreet: 75, offStreet: 70 },
  { day: "Sun", onStreet: 55, offStreet: 52 },
];

const WeeklyTrendChart = () => {
  return (
    <div className=" py-6">
      <ChartContainer config={chartConfig} className=" min-h-50">
          <LineChart
            data={weeklyTrend}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis
              domain={[0, 100]} 
              axisLine={false}
              tickLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />

            <Line
              type="monotone"
              dataKey="onStreet"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="offStreet"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
      </ChartContainer>
    </div>
  );
};

export default WeeklyTrendChart;
