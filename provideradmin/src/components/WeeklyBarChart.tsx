import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "./ui/chart"
import { useQuery } from "@tanstack/react-query";

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

const fetchweeklyData = async () => {

  const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        throw new Error("No user found");
      }

      const user = JSON.parse(storedUser);
      const token = user.accessToken;

      if (!token) {
        throw new Error("Unauthorized: No token found");
      }

  const response = await fetch("http://localhost:3000/parking-avenue-owner/occupancy-by-day", {
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

  console.log('week by day dg',result);

    return result;
  }

const WeeklyBarChart = () => {
  const {data: apiweekdata} = useQuery({
    queryKey: ["weekly-occupancy"],
    queryFn: fetchweeklyData,
    retry:false,
  })
  return (
    <div className="py-8">
      <ChartContainer config={chartConfig} className="h-fit w-full">
        <BarChart accessibilityLayer data={apiweekdata}>
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