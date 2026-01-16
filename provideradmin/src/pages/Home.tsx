import NotificationList from "@/components/NotificationList";
import StatCard from "@/components/StatCard";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";
import { Car, CheckCircle2, Clock, Users } from "lucide-react";

const stats = {
  totalSpaces: 1248,
  totalChange: 12,
  available: 342,
  occupancy: 27, // or calculate: Math.round((1 - available/total)*100)
  activeReservations: 156,
  reservationChange: 8,
  pending: 23,
  wardensOnDuty: 12,
  wardensOnline: 8,
  wardensOnBreak: 4,
};

const notifications : Notification[] = [
  {
    id: "1",
    type: "reservation",
    title: "New reservation for Edna Mall",
    description: "Spot A-15 • 2 hours",
    timeAgo: "2 min ago",
  },
  {
    id: "2",
    type: "walk-in",
    title: "Walk-in entry at Friendship Mall",
    description: "Plate: AA-12345",
    timeAgo: "5 min ago",
  },
  {
    id: "3",
    type: "check-in",
    title: "Abebe Kebede clocked in",
    description: "Assigned to Bole Zone",
    timeAgo: "12 min ago",
  },
  {
    id: "4",
    type: "capacity",
    title: "Ethio-Telecom Tower reaching capacity",
    description: "92% occupied",
    timeAgo: "18 min ago",
  },
  {
    id: "5",
    type: "completed",
    title: "Reservation completed",
    description: "Spot B-8 • Payment received",
    timeAgo: "25 min ago",
  },
];

const Home = () => {
  return (
    <div className=" min-h-screen">
      <header className=" flex flex-col gap-1">
        <h1 className=" font-bold tracking-tighter text-3xl">Dashboard</h1>
        <p>Real-time overview of your parking network</p>
      </header>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-10">
        <StatCard
          title="Total Spaces"
          value={stats.totalSpaces.toLocaleString()}
          description={`Across 4 locations`}
          icon={Car}
          trend={{ value: stats.totalChange, isPositive: true }}
        />

        <StatCard
          title="Available Now"
          value={stats.available}
          description={`${stats.occupancy}% of total capacity`}
          icon={CheckCircle2}
          variant="success"
        />

        <StatCard
          title="Active Reservations"
          value={stats.activeReservations}
          description={`+${stats.pending} pending`}
          icon={Clock}
          trend={{ value: stats.reservationChange, isPositive: true }}
          variant="warning"
        />

        <StatCard
          title="On-Duty Wardens"
          value={stats.wardensOnDuty}
          description={`${stats.wardensOnline} online, ${stats.wardensOnBreak} on break`}
          icon={Users}
        />
      </section>
      <div className=" grid grid-cols-1 lg:grid-cols-2 gap-x-10 mt-10 ">
        <section className="flex flex-col justify-center px-5 py-3 rounded-md shadow-lg border border-gray-200 bg-white/90">
          <div className=" flex flex-col gap-1">
            <h1 className=" text-lg text-gray-900 font-medium">
              Live Activity
            </h1>
            <p className=" text-sm text-gray-500">
              Recent updates across your network
            </p>
          </div>
          <div className=" w-full bg-white flex flex-col">
            <NotificationList notification={notifications} />
          </div>
        </section>
        <section className="flex flex-col justify-center px-5 py-3 rounded-md shadow-md bg-white/90"></section>
      </div>
    </div>
  );
};

export default Home;
