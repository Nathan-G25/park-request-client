import type { Reservation } from "@/types";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Filter } from "lucide-react";
import ReservationItem from "./ReservationItem";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/table";

const mockReservations: Reservation[] = [
  {
    id: "res-001",
    customerName: "Selamawit Tadesse",
    vehicleModel: "Toyota Corolla",
    plateNumber: "3-AA-12345",
    location: "Edna Mall",
    spot: "Spot A-15",
    timeRange: "2:00 PM - 4:00 PM",
    timeLabel: "Today",
    status: "Active",
    amount: "ETB 200",
  },
  {
    id: "res-002",
    customerName: "Bereket Asfaw",
    vehicleModel: "Suzuki Vitara",
    plateNumber: "2-OR-67890",
    location: "Tikur Anbessa Hospital",
    spot: "Spot B-22",
    timeRange: "3:30 PM - 5:00 PM",
    timeLabel: "Today",
    status: "Upcoming",
    amount: "ETB 150",
  },
  {
    id: "res-003",
    customerName: "Meron Alemu",
    vehicleModel: "Hyundai Tucson",
    plateNumber: "3-AA-24680",
    location: "Ethio-Telecom Tower",
    spot: "Spot C-08",
    timeRange: "1:00 PM - 3:00 PM",
    timeLabel: "Today",
    status: "Active",
    amount: "ETB 200",
  },
  {
    id: "res-004",
    customerName: "Kidus Gebremedhin",
    vehicleModel: "Nissan X-Trail",
    plateNumber: "1-AA-13579",
    location: "Friendship Mall",
    spot: "Spot D-31",
    timeRange: "9:00 AM - 12:00 PM",
    timeLabel: "Tomorrow",
    status: "Upcoming",
    amount: "ETB 300",
  },
  {
    id: "res-005",
    customerName: "Frehiwot Desta",
    vehicleModel: "Kia Sportage",
    plateNumber: "3-AA-97531",
    location: "Edna Mall",
    spot: "Spot A-42",
    timeRange: "10:00 AM - 12:00 PM",
    timeLabel: "Today",
    status: "Completed",
    amount: "ETB 200",
  },
  {
    id: "res-006",
    customerName: "Yohannes Kebede",
    vehicleModel: "Volkswagen Tiguan",
    plateNumber: "4-AA-11223",
    location: "Bole Medhanealem",
    spot: "Spot E-07",
    timeRange: "11:30 AM - 1:30 PM",
    timeLabel: "Today",
    status: "Active",
    amount: "ETB 250",
  },
];

type FilterValue = "All" | "Active" | "Upcoming" | "Completed";

const ReservationsTable = () => {
  const [filter, setFilter] = useState<FilterValue>("All");
  const [isMobile, setIsMobile] = useState(false);

  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredData = mockReservations.filter((item) =>
    filter === "All" ? true : item.status === filter,
  );

  if (isMobile) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as FilterValue)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="All">All</TabsTrigger>
              <TabsTrigger value="Active">Active</TabsTrigger>
              <TabsTrigger value="Upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="Completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {filteredData.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No reservations found in this category.
          </div>
        ) : (
          filteredData.map((res) => (
            <ReservationItem key={res.id} reservation={res} variant="card" />
          ))
        )}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <Tabs value={filter} onValueChange={v => setFilter(v as FilterValue)}>
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Active">Active</TabsTrigger>
            <TabsTrigger value="Upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="Completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {filteredData.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">
          No reservations match the selected filter.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CUSTOMER</TableHead>
              <TableHead>VEHICLE</TableHead>
              <TableHead>LOCATION</TableHead>
              <TableHead>TIME</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>AMOUNT</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map(res => (
              <ReservationItem key={res.id} reservation={res} variant="table" />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
};

export default ReservationsTable;
