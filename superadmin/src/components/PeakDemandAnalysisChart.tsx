import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./ui/chart";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

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

type peakdemandData = {
  time: string;
  reservations: string;
}

const fetchdemandData = async (): Promise<peakdemandData[]> => {

  const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        throw new Error("No user found");
      }

      const user = JSON.parse(storedUser);
      const token = user.accessToken;

      if (!token) {
        throw new Error("Unauthorized: No token found");
      }

  const response = await fetch("http://localhost:3000/admin/reservation-peak-demand", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  console.log(response);

  if(!response.ok) {
    throw new Error(`${response.status}: Failed to fetch stat`);
  }

  const result = await response.json();



    return result;
  }


const PeakDemandAnalysisChart = () => {

  const {data: peakdemand, error} = useQuery({
    queryKey: ["peakdemand"],
    queryFn: fetchdemandData,
    retry:false,
  })

  if(error) {
    toast.error(error.message);
  }

  return (
    <div className=" py-8">
      <ChartContainer config={chartConfig} className="max-h-60 w-full">
        <AreaChart accessibilityLayer data={peakdemand}>
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
