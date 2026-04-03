import { Pie, PieChart } from "recharts";
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

const BookingPieChart = ({
  visitorSplit = { reservations: 0, walkIns: 0 },
}: {
  visitorSplit?: { reservations: number; walkIns: number }
}) => {
  const chart = [
    { name: "reservations", visitors: visitorSplit.reservations, fill: "var(--color-reservations)" },
    { name: "walkins", visitors: visitorSplit.walkIns, fill: "var(--color-walkins)" },
  ];

  return (
    <div className="py-8">
      <ChartContainer config={chartConfig} className="h-fit">
        <PieChart>
          <Pie
            data={chart}
            dataKey="visitors"
            nameKey="type"
            innerRadius={60}
            strokeWidth={5}
          />
          <ChartLegend
            content={<ChartLegendContent nameKey="name" />}
            className="-translate-y-2 flex-col items-start gap-2"
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default BookingPieChart;
