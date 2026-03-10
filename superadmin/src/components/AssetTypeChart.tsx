import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./ui/chart";
import { Pie, PieChart } from "recharts";
import { fetchOverallStats } from "@/pages/Overview";
import toast from "react-hot-toast";

const chartConfig = {
  onStreet: { label: "onStreet", color: "hsl(221.2 83.2% 53.3%)" },
  offStreet: { label: "offStreet", color: "hsl(173.4 80.4% 51.4%)" },
} satisfies ChartConfig;

const AssetTypeChart = () => {
  const { data: assetType, error } = useQuery({
    queryKey: ["assetTypeDistribution"],
    queryFn: fetchOverallStats,
    retry: false,
  });

  if (error) {
    toast.error("Failed to load stats. Please try again later.");
    console.error("Error fetching stats:", error);
  }

  const chartData = [
    { type: "onStreet", value: assetType?.onStreetSegments, fill: "var(--color-onStreet)" },
    { name: "offStreet", value: assetType?.offStreetLots, fill: "var(--color-offStreet)" },
  ];
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className=" font-semibold">
          Asset Type Distribution
        </CardTitle>
        <CardDescription className=" text-sm text-gray-500">
          On-street vs Off-street usage
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="type"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-center items-center gap-4 text-sm">
        <div className=" flex gap-2 items-center">
          <div className=" size-4 rounded-md bg-blue-500"></div>
          <p className=" text-lg text-blue-500">On-Street</p>
        </div>
        <div className=" flex gap-2 items-center">
          <div className=" size-4 rounded-lg bg-teal-400"></div>
          <p className=" text-lg text-teal-500">Off-Street</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AssetTypeChart;
