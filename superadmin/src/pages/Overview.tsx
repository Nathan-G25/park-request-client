import NotificationList from "@/components/NotificationList";
import StatCard from "@/components/StatCard";
import WeeklyTrendChart from "@/components/WeeklyTrendChart";
import type { Notification } from "@/types";
import {
  Activity,
  Building2,
  CalendarCheck,
  MapPin,
  ParkingSquare,
  ShieldCheck,
  Spline,
  Users,
} from "lucide-react";

const notifications: Notification[] = [
  {
    type: "newApplication",
    title: "New Provider Application",
    description: "CityPark Solutions submi...",
    timeAgo: "2 min ago",
  },
  {
    type: "checkIn",
    title: "Warden Check-in",
    description: "15 wardens started shift ...",
    timeAgo: "5 min ago",
  },
  {
    type: "surge",
    title: "Reservation Surge",
    description: "45% increase in bookin...",
    timeAgo: "12 min ago",
  },
  {
    type: "capacity",
    title: "Capacity Alert",
    description: "Lot #A-127 reached 95...",
    timeAgo: "18 min ago",
  },
  {
    type: "approval",
    title: "Provider Approved",
    description: "Metro Parking Inc. activ...",
    timeAgo: "25 min ago",
  },
  {
    type: "inactivity",
    title: "Inactivity Alert",
    description: "Warden #W-2341 no u...",
    timeAgo: "32 min ago",
  },
];

const Overview = () => {
  return (
    <main className=" min-h-screen">
      <header className=" flex flex-col gap-1">
        <h1 className=" font-bold tracking-tighter text-2xl">
          Global Overview
        </h1>
        <p className=" tracking-wide text-sm">
          Real-time system state and key performance indicators
        </p>
      </header>
      <section className=" mt-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <StatCard
          title="Total Providers"
          value={48}
          icon={Building2}
          trend={{ value: 8, label: "vs last week" }}
        />

        <StatCard
          title="Active Locations"
          value="1,284"
          icon={MapPin}
          trend={{ value: 12, label: "vs last week" }}
        />

        <StatCard
          title="On-street Segments"
          value={847}
          description="Across 23 zones"
          icon={Spline}
          className="lg:col-span-2 xl:col-span-1"
        />

        <StatCard
          title="Off-street Lots"
          value={437}
          icon={ParkingSquare}
          description="12,450 total spaces"
        />
        <StatCard
          title="Active Wardens"
          value={312}
          icon={ShieldCheck}
          trend={{ value: 5, label: "vs week" }}
        />

        <StatCard
          title="Active Drivers"
          value="24.8K"
          icon={Users}
          trend={{ value: 18, label: "vs last week" }}
        />

        <StatCard
          title="Live Reservations"
          value="1,847"
          icon={CalendarCheck}
          trend={{ value: 23, label: "vs last week" }}
        />

        <StatCard
          title="Utilization Rate"
          value="78%"
          icon={Activity}
          trend={{ value: 3, label: "vs last week" }}
        />
      </section>
      <section className=" mt-10 grid grid-cols-1 md:grid-cols-3 items-start gap-10 pb-10">
        {/* Chart */}
        <section className=" md:col-span-2 flex flex-col justify-center px-5 py-3 rounded-md shadow-lg border border-gray-200 bg-white/90">
          <div className=" flex flex-col gap-1">
            <h2 className=" text-lg text-gray-900 font-medium">
              Weekly Utilization Trend
            </h2>
            <p className=" text-sm text-gray-500">
              On-street vs Off-street comparison
            </p>
          </div>
          <WeeklyTrendChart/>
        </section>
        {/* Live notfication */}
        <section className="flex flex-col justify-center px-5 py-3 rounded-md shadow-lg border border-gray-200 bg-white/90">
          <div className=" flex flex-col gap-1">
            <h2 className=" text-lg text-gray-900 font-medium">
              Live Activity
            </h2>
            <p className=" text-sm text-gray-500">
              Recent updates across your network
            </p>
          </div>
          <div className=" w-full bg-white flex flex-col">
            <NotificationList notification={notifications} />
          </div>
        </section>
      </section>
    </main>
  );
};

export default Overview;
