import AnalyticsCard from "@/components/AnalyticsCard";
import AssetTypeChart from "@/components/AssetTypeChart";
import PredictiveInsightsCard from "@/components/PredictiveInsightsCard";
import ZoneUtilizationChart from "@/components/ZoneUtilizationChart";
import { ChartColumn, Clock, MapPin, TrendingUp } from "lucide-react";

const analytics= {
    avgUtilization: "78%",
    revenueGrowth: "12%",
    peakHours: "2 PM - 4 PM",
    hottestZones: "Business"
}

const Analytics = () => {
  
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
        <AnalyticsCard icon={TrendingUp} color="trend" label="Avg Utilization" value={analytics.avgUtilization}/>
        <AnalyticsCard icon={ChartColumn} color="graph" label="Revenue Growth" value={analytics.revenueGrowth}/>
        <AnalyticsCard icon={Clock} color="clock" label="Peak Hours" value={analytics.peakHours}/>
        <AnalyticsCard icon={MapPin} color="mappin" label="Hottest Zones" value={analytics.hottestZones}/>
      </section>
      <section className=" mt-10 grid grid-cols-1 md:grid-cols-2 items-start gap-8">
        <ZoneUtilizationChart/>
        <AssetTypeChart/>
      </section>
      <section className=" my-10 w-full">
        <PredictiveInsightsCard/>
      </section>
    </main>
  );
};

export default Analytics;
