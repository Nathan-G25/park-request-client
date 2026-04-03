import AnalyticsStatCard from "@/components/AnalyticsStatCard";
import BookingPieChart from "@/components/BookingPieChart";
import PeakHourOccupancyChart from "@/components/PeakHourOccupancyChart";
import RevenueChart from "@/components/RevenueChart";
import WeeklyBarChart from "@/components/WeeklyBarChart";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, TrendingUp, Users } from "lucide-react";
import toast from "react-hot-toast";

const statdata = {
  avgOccupancy: "76%",
  totalVisitors: "12,486",
  avgDuration: "2.4h",
  revenue: "48.6K",
};

type kpiStat = {
  averageOccupancyRate: number;
  totalVisitors: number;
  averageStayDurationHours: number;
  totalRevenue: number;
  visitorsSplit: {
    reservations: number;
    walkIns: number;
  }
}

const fetchKPI = async (): Promise<kpiStat> => {

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

  console.log(response);

  if(!response.ok) {
    throw new Error(`${response.status}: Failed to fetch stat`);
  }

  const result = await response.json();



    return result;
  }


const AnalyticsPage = () => {
  const {data: kpi, error} = useQuery({
    queryKey: ["analyticsKpi"],
    queryFn: fetchKPI,
    retry:false,
  })

  if(error) {
    toast.error(error.message);
  }
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
          value={kpi ? kpi.averageOccupancyRate : 0}
          color="accent"
        />
        <AnalyticsStatCard
          icon={Users}
          label="Total Visitors"
          value={kpi ? kpi.totalVisitors : 0}
          color="success"
        />
        <AnalyticsStatCard
          icon={Clock}
          label="Avg.Duration"
          value={kpi ? kpi.averageStayDurationHours : 0}
          color="warning"
        />
        <AnalyticsStatCard
          icon={TrendingUp}
          label="Revenue"
          value={`$${kpi?.totalRevenue}`}
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
            <BookingPieChart visitorSplit={kpi ? kpi.visitorsSplit : {reservations: 0, walkIns: 0}} />
          </div>
        </section>
      </section>
    </div>
  );
};

export default AnalyticsPage;
