import { useQuery } from "@tanstack/react-query";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

interface MonthlyRevenue {
  month: string;
  reservations: number;
  walkins: number;
}

const chartConfig = {
  reservations: { label: "Reservations", color: "#3b82f6" },
  walkins: { label: "Walk-ins", color: "#10b981" },
} satisfies ChartConfig;

const revenueData: MonthlyRevenue[] = [
  { month: "Jan", reservations: 4200, walkins: 3800 },
  { month: "Feb", reservations: 4500, walkins: 4100 },
  { month: "Mar", reservations: 5200, walkins: 4600 },
  { month: "Apr", reservations: 6100, walkins: 5200 },
  { month: "May", reservations: 6400, walkins: 5500 },
  { month: "Jun", reservations: 7200, walkins: 6100 },
];

const fetchRevenueData = async () => {

  const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        throw new Error("No user found");
      }

      const user = JSON.parse(storedUser);
      const token = user.accessToken;

      if (!token) {
        throw new Error("Unauthorized: No token found");
      }

  const response = await fetch("http://localhost:3000/parking-avenue-owner/revenue-trends", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if(!response.ok) {
    throw new Error(`${response.status}: Failed to fetch stats`);
  }

  const result = await response.json();

  console.log('revenue trend dg',result);

    return result;
  }

const RevenueChart = () => {
  const {data: revenuetrend} = useQuery({
    queryKey: ["revenue-trend"],
    queryFn: fetchRevenueData,
    retry:false,
    staleTime: 5 * 60 * 1000,
  })
  return (
    <div className="py-8">
      <ChartContainer config={chartConfig} className=" h-fit">
        <LineChart
          data={revenuetrend}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(value) => `$${value / 1000}K`}
            axisLine={false}
            tickLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />

          <Line
            type="monotone"
            dataKey="reservations"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="walkins"
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

export default RevenueChart;
