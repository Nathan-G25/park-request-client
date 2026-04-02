import NotificationList from "@/components/NotificationList";
import OccupancyChart from "@/components/OccupancyChart";
import { fetchUserProfile } from "@/components/SideBar";
import StatCard from "@/components/StatCard";
import { useLiveActivity } from "@/hooks/useLiveActivity";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Car,
  CheckCircle2,
  Clock,
  Clock2,
  TrendingUp,
  Users,
} from "lucide-react";
import { Navigate } from "react-router";

const stats = {
  totalSpaces: 1248,
  totalChange: 12,
  available: 342,
  occupancy: 27,
  activeReservations: 156,
  reservationChange: 8,
  pending: 23,
  wardensOnDuty: 12,
  wardensOnline: 8,
  wardensOnBreak: 4,
};

const Summary = {
  walkInsToday: 342,
  wallkInsChange: 15,
  time: "4:50 PM",
  avgParkingDuration: "2.4 hr",
  peakOccupancy: "92%",
};

const notifications: Notification[] = [
  {
    type: "reservation",
    title: "New reservation for Edna Mall",
    description: "Spot A-15 • 2 hours",
    timeAgo: "2 min ago",
  },
  {
    type: "walk-in",
    title: "Walk-in entry at Friendship Mall",
    description: "Plate: AA-12345",
    timeAgo: "5 min ago",
  },
  {
    type: "check-in",
    title: "Abebe Kebede clocked in",
    description: "Assigned to Bole Zone",
    timeAgo: "12 min ago",
  },
  {
    type: "capacity",
    title: "Ethio-Telecom Tower reaching capacity",
    description: "92% occupied",
    timeAgo: "18 min ago",
  },
  {
    type: "completed",
    title: "Reservation completed",
    description: "Spot B-8 • Payment received",
    timeAgo: "25 min ago",
  },
];

type Stats = {
  totalSpots: number;
  availableSpotsNow: number;
  activeReservationsCount: number;
  onDutyWardenCount: number;
}

const fetchOverview = async (id: string | undefined): Promise<Stats> => {
  const ownerId = id;

  if(!ownerId) {
    throw new Error("User not found")
  }

  const response = await fetch(`http://localhost:3000/parking-avenue-owner/dashboard/overview?ownerId=${ownerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if(!response.ok) {
    throw new Error(`${response.status}: Failed to fetch stats`);
  }

  const result = await response.json();

  console.log(result);

  return result;
}


const Home = () => {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchUserProfile,
    retry: false,
  });

  const { data: liveActivity } = useLiveActivity(user?.id);

  const { data: stat } = useQuery({
    queryKey: ["overviewStats", user?.id],
    queryFn: () => fetchOverview(user?.id),
    retry: false
  })

  if (error) {
    console.error("Error fetching user profile:", error);
  }

  if (isLoading) {
    return <div>Loading application...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className=" min-h-screen">
      <header className=" flex flex-col gap-1">
        <h1 className=" font-bold tracking-tighter text-2xl">Dashboard</h1>
        <p className=" tracking-wide text-sm">
          Real-time overview of your parking network
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-10">
        <StatCard
          title="Total Spaces"
          value={stat ? stat.totalSpots : stats.totalSpaces}
          description={`Across 4 locations`}
          icon={Car}
          trend={{ value: stats.totalChange, isPositive: true }}
        />

        <StatCard
          title="Available Now"
          value={stat ? stat.availableSpotsNow : stats.occupancy}
          description={`${stats.occupancy}% of total capacity`}
          icon={CheckCircle2}
          variant="success"
        />

        <StatCard
          title="Active Reservations"
          value={ stat ? stat.activeReservationsCount : stats.activeReservations}
          description={`+${stats.pending} pending`}
          icon={Clock}
          trend={{ value: stats.reservationChange, isPositive: true }}
          variant="warning"
        />

        <StatCard
          title="On-Duty Wardens"
          value={stat ? stat.onDutyWardenCount : stats.wardensOnDuty}
          description={`${stats.wardensOnline} online, ${stats.wardensOnBreak} on break`}
          icon={Users}
        />
      </section>
      <div className=" grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-10 mt-10 ">
        {/* Live Notification */}
        <section className="flex flex-col max-h-[250px] justify-start px-5 py-3 rounded-md shadow-lg border overflow-y-auto scroll-smooth border-gray-200 bg-white/90">
          <div className=" flex flex-col gap-1">
            <h2 className=" text-lg text-gray-900 font-medium">
              Live Activity
            </h2>
            <p className=" text-sm text-gray-500">
              Recent updates across your network
            </p>
          </div>
          <div className=" w-full bg-white flex flex-col">
            {liveActivity.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground">
                  No recent activity. Updates will appear here in real-time.
                </p>
              </div>
            ) : (
              <NotificationList
                notification={
                  Array.isArray(liveActivity)
                    ? liveActivity.map((n: any) => ({
                        type:
                          n.type === "RESERVATION"
                            ? "RESERVATION"
                            : n.type === "WALK_IN"
                              ? "WALK_IN"
                              : "WALK_IN", // fallback or adjust as needed
                        message: n.title ?? n.description ?? "",
                        timestamp: new Date(), // Replace with actual timestamp if available
                        metadata: n,
                      }))
                    : []
                }
              />
            )}
          </div>
        </section>
        {/* Today's Occupancy */}
        <section className="flex flex-col justify-center px-5 py-3 rounded-md shadow-md bg-white/90">
          <div className=" flex flex-col gap-1">
            <h2 className=" text-lg text-gray-900 font-medium">
              Today's Occupancy
            </h2>
            <p className=" text-sm text-gray-500">
              Average occupancy rate across all locations
            </p>
            <OccupancyChart />
          </div>
        </section>
      </div>
      <div className=" flex flex-col justify-center rounded-lg bg-white/90 shadow-lg border border-gray-200 px-8 py-5 mt-8 mb-8">
        <h2 className=" font-medium text-gray-900 text-lg">Today's Summary</h2>
        <section className=" grid grid-cols-1 md:grid-cols-3 py-5 gap-x-6 gap-y-4">
          <div className=" bg-neutral-50 shadow-md rounded-md px-4 py-3 flex justify-between gap-x-3 items-center">
            <div className=" flex items-center gap-x-3">
              <div className=" rounded-md bg-green-100 px-3 py-2">
                <TrendingUp className=" size-6 text-green-600" />
              </div>
              <div className=" flex flex-col gap-1 justify-center">
                <h3 className=" text-gray-800 font-medium">Walk-ins Today</h3>
                <p
                  className={cn(
                    "text-gray-500 text-sm",
                    Summary.wallkInsChange > 0
                      ? "text-green-600"
                      : "text-red-400",
                  )}
                >
                  {Summary.wallkInsChange > 0 ? "+" : "-"}
                  {Math.abs(Summary.wallkInsChange)}%{" "}
                  <span className="text-gray-600">from yesterday</span>
                </p>
              </div>
            </div>

            <h3 className=" font-bold text-2xl mr-2">{Summary.walkInsToday}</h3>
          </div>
          <div className=" bg-neutral-50 shadow-md rounded-md px-4 py-3 flex justify-between gap-x-3 items-center">
            <div className=" flex items-center gap-x-3">
              <div className=" rounded-md bg-blue-100 px-3 py-2">
                <Clock2 className=" size-6 text-blue-600" />
              </div>
              <div className=" flex flex-col gap-1 justify-center">
                <h3 className=" text-gray-800 font-medium">
                  Avg.Parking Duration
                </h3>
                <p className={cn("text-gray-500 text-sm")}>
                  Based on today's data
                </p>
              </div>
            </div>

            <h3 className=" font-bold text-2xl mr-2">
              {Summary.avgParkingDuration}
            </h3>
          </div>
          <div className=" bg-neutral-50 shadow-md rounded-md px-4 py-3 flex justify-between gap-x-3 items-center">
            <div className=" flex items-center gap-x-3">
              <div className=" rounded-md bg-orange-100 px-3 py-2">
                <AlertCircle className=" size-6 text-orange-600" />
              </div>
              <div className=" flex flex-col gap-1 justify-center">
                <h3 className=" text-gray-800 font-medium">Peak Occupancy</h3>
                <p className={cn("text-gray-500 text-sm")}>
                  Reached at {Summary.time}
                </p>
              </div>
            </div>

            <h3 className=" font-bold text-2xl mr-2">
              {Summary.peakOccupancy}
            </h3>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
