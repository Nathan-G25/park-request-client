import LocationStatusCard from "@/components/LocationStatusCard";
import VehicleLogCard from "@/components/VehicleLogCard";
import { cn } from "@/lib/utils";
import type { LocationStatus, VehicleLog } from "@/types";
import { RefreshCcw } from "lucide-react";

const isOnline = true;

const mockData: LocationStatus[] = [
  {
    name: "Edna Mall Parking",
    address: "Bole Road, Addis Ababa",
    type: "Mall",
    status: "Partial",
    occupiedSpots: 312,
    totalSpots: 450,
    lastUpdated: "2 min ago",
    confidence: 67,
  },
  {
    name: "Tikur Anbessa Hospital Garage",
    address: "Churchill Avenue, Addis Ababa",
    type: "Hospital",
    status: "Available",
    occupiedSpots: 45,
    totalSpots: 200,
    lastUpdated: "5 min ago",
    confidence: 87,
  },
];

const logs: VehicleLog[] = [
  {
    plateNumber: "3-AA-12345",
    action: "Entry",
    timestamp: "10:42 AM",
    location: "Edna Mall",
  },
  {
    plateNumber: "2-OR-56789",
    action: "Exit",
    timestamp: "10:40 AM",
    location: "Tikur Anbessa",
    duration: "2h 15m",
  },
  {
    plateNumber: "3-AA-24680",
    action: "Entry",
    timestamp: "10:38 AM",
    location: "Ethio-Telecom",
  },
  {
    plateNumber: "1-AA-13579",
    action: "Exit",
    timestamp: "10:35 AM",
    location: "Friendship Mall",
    duration: "45m",
  },
];

const LiveOpsPage = () => {
  return (
    <div>
      <div className=" flex flex-col gap-1">
        <h1 className=" text-2xl font-bold tracking-tighter">
          Live Operations
        </h1>
        <p className=" text-sm tracking-wide">
          Real-time monitoring of all parking locations
        </p>
      </div>
      <section className=" pt-5 flex items-center justify-between">
        <div className=" flex items-center gap-6">
          <div className=" flex items-center gap-1">
            <span
              className={cn(
                "size-2 rounded-full pt-0.5",
                isOnline ? "bg-green-500" : "bg-red-500",
              )}
            ></span>
            <p className=" font-medium">
              System {isOnline ? "Online" : "Offline"}
            </p>
          </div>
          {/* Need to check this later, it should be dynamic */}
          <p className=" text-gray-500 text-sm text-center pt-0.5 tracking-wider">
            Last sync: Just now
          </p>
        </div>
        <button className=" flex items-center justify-center gap-2 w-30 py-2 font-medium text-center cursor-pointer hover:bg-gray-100 rounded-md outline outline-gray-200">
          <RefreshCcw className=" size-3" />
          <p>Refresh</p>
        </button>
      </section>
      <section className=" pt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <section className=" rounded-lg bg-card p-4 shadow-md hover:shadow-lg">
          <h2 className=" font-semibold pt-1">Location Status</h2>
          <p className=" text-gray-500 text-sm tracking-wide pt-1">
            Real-time availability across all locations
          </p>
          <div className=" pt-1">
            {mockData.map((loc) => (
              <LocationStatusCard key={loc.name} locationStatus={loc} />
            ))}
          </div>
        </section>
        <section className="rounded-lg bg-card p-4 shadow-md hover:shadow-lg">
          <h2 className=" font-semibold pt-1">VehicleLog</h2>
          <p className=" text-gray-500 text-sm tracking-wide pt-1">Recent entries and exits</p>
          <div className=" pt-1">
            {logs.map((log) => (
              <VehicleLogCard key={log.plateNumber} log={log} />
            )) }
          </div>
        </section>
      </section>
    </div>
  );
};

export default LiveOpsPage;
