import AnalyticsStatCard from "@/components/AnalyticsStatCard";
import BookingPieChart from "@/components/BookingPieChart";
import PeakHourOccupancyChart from "@/components/PeakHourOccupancyChart";
import RevenueChart from "@/components/RevenueChart";
import WeeklyBarChart from "@/components/WeeklyBarChart";
import { Calendar, Clock, TrendingUp, Users } from "lucide-react";

const statdata = {
  avgOccupancy: "76%",
  totalVisitors: "12,486",
  avgDuration: "2.4h",
  revenue: "48.6K",
};

const AnalyticsPage = () => {
  return (
    <div className=" min-h-screen">
      <div className=" flex flex-col gap-1 justify-center">
        <h1 className=" text-2xl font-bold tracking-tighter">Analytics</h1>
        <p className=" text-sm tracking-wide">
          AI-driven insights and performance metrics
        </p>
      </div>
      <div className=" flex items-center gap-2 mt-6">
        <Calendar className=" size-5" />
        <span className=" text-gray-500 font-medium text-sm">Last 30 days</span>
      </div>
      <section className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center gap-5 mt-10">
        <AnalyticsStatCard
          icon={TrendingUp}
          label="Avg.Occupancy"
          value={statdata.avgOccupancy}
          color="accent"
        />
        <AnalyticsStatCard
          icon={Users}
          label="Total Visitors"
          value={statdata.totalVisitors}
          color="success"
        />
        <AnalyticsStatCard
          icon={Clock}
          label="Avg.Duration"
          value={statdata.avgDuration}
          color="warning"
        />
        <AnalyticsStatCard
          icon={TrendingUp}
          label="Revenue"
          value={`$${statdata.revenue}`}
          color="success"
          className=" last:text-green-600"
        />
      </section>
      <section className=" mt-10 grid grid-cols-1 md:grid-cols-2 items-start gap-10">
        <section className="flex flex-col justify-center px-5 py-3 rounded-md shadow-md bg-white/90">
          <div className=" flex flex-col gap-1">
            <h2 className=" text-lg text-gray-900 font-medium">
              Weekly Occupancy Trend
            </h2>
            <p className=" text-sm text-gray-500">
              Average occupancy rate by day
            </p>
            <WeeklyBarChart />
          </div>
        </section>
        <section className="flex flex-col justify-center px-5 py-3 rounded-md shadow-md bg-white/90">
          <div className=" flex flex-col gap-1">
            <h2 className=" text-lg text-gray-900 font-medium">
              Peak Hour Analysis
            </h2>
            <p className=" text-sm text-gray-500">
              Average occupancy rate across all locations
            </p>
            <PeakHourOccupancyChart />
          </div>
        </section>
      </section>
      <section className=" mt-10 grid grid-cols-1  md:grid-cols-2 pb-10 items-start gap-10">
        <section className=" flex flex-col justify-center px-5 py-3 rounded-md shadow-md bg-white/90">
          <div className=" flex flex-col gap-1">
            <h2 className=" text-lg text-gray-900 font-medium">
              Revenue: Reservations vs Walk-ins
            </h2>
            <p className=" text-sm text-gray-500">
              Monthly comparison over 6 months
            </p>
            <RevenueChart />
          </div>
        </section>
        <section className=" flex flex-col justify-center px-5 py-3 rounded-md shadow-md bg-white/90">
          <div className=" flex flex-col gap-1">
            <h2 className=" text-lg text-gray-900 font-medium">
              Booking Breakdown
            </h2>
            <p className=" text-sm text-gray-500">
              Reservations vs walk-ins
            </p>
            <BookingPieChart />
          </div>
        </section>
      </section>
    </div>
  );
};

export default AnalyticsPage;
