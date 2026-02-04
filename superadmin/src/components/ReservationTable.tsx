import type { Reservation } from "@/types";
import { Clock, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { cn } from "@/lib/utils";

const reservations: Reservation[] = [
  {
    id: "R-10001",
    driver: "Alex Thompson",
    location: "Central Garage - B2",
    provider: "Metro Parking Inc.",
    startTime: "Now",
    duration: "2h 15m",
    status: "active",
    amount: "$8.50",
  },
  {
    id: "R-10002",
    driver: "Maria Garcia",
    location: "Main Street Segment A",
    provider: "CityPark Solutions",
    startTime: "In 30 min",
    duration: "1h",
    status: "upcoming",
    amount: "$4.00",
  },
  {
    id: "R-10003",
    driver: "David Lee",
    location: "Oak Avenue Lot",
    provider: "Downtown Garages",
    startTime: "Now",
    duration: "45m",
    status: "active",
    amount: "$3.00",
  },
  {
    id: "R-10004",
    driver: "Jennifer Smith",
    location: "Harbor Drive Segment",
    provider: "CityPark Solutions",
    startTime: "In 1 hour",
    duration: "3h",
    status: "upcoming",
    amount: "$12.00",
  },
  {
    id: "R-10005",
    driver: "Robert Johnson",
    location: "University Boulevard",
    provider: "Metro Parking Inc.",
    startTime: "2 hours ago",
    duration: "2h",
    status: "completed",
    amount: "$6.00",
  },
  {
    id: "R-10006",
    driver: "Emily White",
    location: "Central Garage - A1",
    provider: "Metro Parking Inc.",
    startTime: "30 min ago",
    duration: "1h",
    status: "cancelled",
    amount: "$0.00",
  },
];

type FilterValue = "All" | "active" | "inactive" | "flagged";

const ReservationTable = () => {
  const [filter, setFilter] = useState<FilterValue>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      const matchesSearch =
        r.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTab =
        filter === "All" || r.status.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesTab;
    });
  }, [searchTerm, filter]);

  const getCount = (status: string) =>
    reservations.filter((r) =>
      status === "all" ? true : r.status.toLowerCase() === status.toLowerCase(),
    ).length;

  const statusStyle: Record<string, string> = {
    Active: "bg-green-100 text-green-500 hover:bg-green-100/80",
    Cancelled: "bg-red-100 text-red-500 hover:bg-red-100/80 ",
    Completed: "bg-gray-100 text-gray-500 hover:bg-gray-100/80",
    Upcoming: "bg-blue-100 text-blue-500 hover:bg-blue-100/80",
  };
  return (
    <div className="rounded-md ">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search wardens..."
          className="pl-10 bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterValue)}>
          <TabsList>
            <TabsTrigger value="All">
              All <Badge variant="outline">{getCount("all")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="active">
              Active<Badge variant="outline">{getCount("active")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed<Badge variant="outline">{getCount("completed")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled<Badge variant="outline">{getCount("cancelled")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming<Badge variant="outline">{getCount("Upcoming")}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Table className="border rounded-xl px-2 bg-card border-border">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-slate-600">
              Reservation
            </TableHead>
            <TableHead className="font-semibold text-slate-600 text-center">
              Location
            </TableHead>
            <TableHead className="font-semibold text-slate-600 text-center">
              Provider
            </TableHead>
            <TableHead className="font-semibold text-slate-600">
              Start Time
            </TableHead>
            <TableHead className="font-semibold text-slate-600">
              Duration
            </TableHead>
            <TableHead className="font-semibold text-slate-600">
              Status
            </TableHead>
            <TableHead className="font-semibold text-slate-600">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <TableRow
                key={reservation.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <TableCell className=" text-left">
                  <div className="flex flex-col justify-center ml-2 gap-1">
                    <span className="font-medium text-slate-900">
                      {reservation.driver}
                    </span>
                    <p className=" text-xs text-gray-500">{reservation.id}</p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {reservation.location}
                </TableCell>
                <TableCell className="text-center">
                  {reservation.provider}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center gap-1">
                    <Clock className=" size-3.5 text-gray-500" />
                    <p className=" text-gray-500">{reservation.startTime}</p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {reservation.duration}
                </TableCell>
                <TableCell>
                  <p
                    className={cn(
                      "px-3 py-1 rounded-2xl w-20 text-xs text-center font-medium",
                      statusStyle[
                        (reservation.status.charAt(0).toUpperCase() +
                          reservation.status.slice(1)) as FilterValue
                      ] || "",
                    )}
                  >
                    {reservation.status}
                  </p>
                </TableCell>
                <TableCell className=" text-center text-gray-500">
                  {reservation.amount}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-32 text-center text-slate-400"
              >
                No providers found matching your criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReservationTable;
