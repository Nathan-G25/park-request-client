import { Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "./ui/chart";

const chartConfig = {
  reservations: { label: "Reservations", color: "hsl(221.2 83.2% 53.3%)" },
  walkins: { label: "Walk-ins", color: "hsl(173.4 80.4% 51.4%)" },
} satisfies ChartConfig;

const chartData = [
  { type: "reservations", visitors: 62, fill: "var(--color-reservations)" },
  { type: "walkins", visitors: 38, fill: "var(--color-walkins)" },
];

const BookingPieChart = () => {
  return (
    <div className="py-8">
      <ChartContainer config={chartConfig} className=" min-h-50">
        <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="visitors"
            nameKey="type"
            innerRadius={60}
            strokeWidth={5}
          />
          <ChartLegend
            content={<ChartLegendContent nameKey="type" />}
            className="-translate-y-2 flex-col items-start gap-2"
          />
        </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default BookingPieChart;
