import AnalyticsCard from "@/components/AnalyticsCard";
import AssetTypeChart from "@/components/AssetTypeChart";
import PredictiveInsightsCard from "@/components/PredictiveInsightsCard";
import ZoneUtilizationChart from "@/components/ZoneUtilizationChart";
import { useQuery } from "@tanstack/react-query";
import { ChartColumn, Clock, MapPin, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

// const analytics= {
//     avgUtilization: "78%",
//     revenueGrowth: "12%",
//     peakHours: "2 PM - 4 PM",
//     hottestZones: "Business"
// }

type adminKpi = {
  wardensOnDuty: number;
  activeCheckIns: number;
  confirmedReservations: number;
  overallUtilizationRate: number;
};

type DetailedAnalyticsDto = {
  averageUtilization: number;
  revenueGrowth: number;
  hottestZone: {
    subCity: string;
    utilization: number;
  };
  zoneUtilization: Array<{ label: string; value: number }>;
  peakHours: Array<{ label: string; value: number }>;
  parkingDistribution: Array<{ label: string; value: number }>;
};

const fetchDetailedAnalytics = async (): Promise<DetailedAnalyticsDto> => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    throw new Error("No user found");
  }

  const user = JSON.parse(storedUser);
  const token = user.accessToken;

  if (!token) {
    throw new Error("Unauthorized: No token found");
  }

  const response = await fetch(
    "http://localhost:3000/admin/detailed-analytics",
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) throw new Error("Failed to fetch detailed analytics");
  return response.json();
};

const Analytics = () => {
  const { data: analytics, error } = useQuery({
    queryKey: ["detailedAnalytics"],
    queryFn: fetchDetailedAnalytics,
    retry: false,
  });

  if (error) {
    toast.error(error.message);
  }

  return (
    <main>
      <header className=" flex flex-col gap-1">
        <h1 className=" font-bold tracking-tighter text-2xl">
          AI-Driven Analytics
        </h1>
        <p className=" tracking-wide text-sm">
          Data-driven insights and predictive analysis
        </p>
      </header>
      <section className=" mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center gap-6">
        <AnalyticsCard
          icon={TrendingUp}
          color="trend"
          label="Avg Utilization"
          value={analytics?.averageUtilization ?? ""}
        />
        <AnalyticsCard
          icon={ChartColumn}
          color="graph"
          label="Revenue Growth"
          value={analytics?.revenueGrowth ?? ""}
        />
        <AnalyticsCard
          icon={Clock}
          color="clock"
          label="Peak Hours"
          value={analytics?.peakHours ?? ""}
        />
        <AnalyticsCard
          icon={MapPin}
          color="mappin"
          label="Hottest Zones"
          value={analytics?.hottestZone?.subCity ?? ""}
        />
      </section>
      <section className=" mt-10 grid grid-cols-1 md:grid-cols-2 items-start gap-8">
        <ZoneUtilizationChart
          {
            ...(analytics?.zoneUtilization
              ? analytics.zoneUtilization.map(({ label, value }) => ({
                  zone: label,
                  utilization: value,
                }))
              : [])
          }
        />
        <AssetTypeChart />
      </section>
      <section className=" my-10 w-full">
        <PredictiveInsightsCard />
      </section>
    </main>
  );
};

export default Analytics;
