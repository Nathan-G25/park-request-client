import type { Warden } from "@/types";
import { MapPin, MoreHorizontal, Search, Shield } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { cn } from "@/lib/utils";

const wardens: Warden[] = [
  {
    id: "W-1001",
    name: "John Martinez",
    provider: "CityPark Solutions",
    zone: "Downtown",
    status: "active",
    reliability: 98.5,
    updatesToday: 47,
    lastSeen: "2 min ago",
  },
  {
    id: "W-1002",
    name: "Sarah Chen",
    provider: "Metro Parking Inc.",
    zone: "Business District",
    status: "active",
    reliability: 96.2,
    updatesToday: 38,
    lastSeen: "5 min ago",
  },
  {
    id: "W-1003",
    name: "Michael Brown",
    provider: "Downtown Garages",
    zone: "Waterfront",
    status: "flagged",
    reliability: 72.4,
    updatesToday: 12,
    lastSeen: "45 min ago",
  },
  {
    id: "W-1004",
    name: "Emily Davis",
    provider: "CityPark Solutions",
    zone: "Residential",
    status: "inactive",
    reliability: 89.1,
    updatesToday: 0,
    lastSeen: "3 hours ago",
  },
  {
    id: "W-1005",
    name: "James Wilson",
    provider: "Metro Parking Inc.",
    zone: "Academic",
    status: "active",
    reliability: 94.8,
    updatesToday: 52,
    lastSeen: "1 min ago",
  },
  {
    id: "W-1006",
    name: "Lisa Anderson",
    provider: "ParkEasy Ltd",
    zone: "Airport",
    status: "inactive",
    reliability: 0,
    updatesToday: 0,
    lastSeen: "5 days ago",
  },
];

type FilterValue = "All" | "active" | "inactive" | "flagged";

const WardenTable = () => {
  const [filter, setFilter] = useState<FilterValue>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWardens = useMemo(() => {
    return wardens.filter((w) => {
      const matchesSearch =
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.provider.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTab =
        filter === "All" || w.status.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesTab;
    });
  }, [searchTerm, filter]);

  const getCount = (status: string) =>
    wardens.filter((w) =>
      status === "all" ? true : w.status.toLowerCase() === status.toLowerCase(),
    ).length;

  const statusStyle: Record<string, string> = {
    Active: "bg-green-100 text-green-800 hover:bg-green-100/80",
    Inactive: "bg-red-100 text-red-800 hover:bg-blue-100/80 ",
    Flagged: "bg-orange-100 text-orange-800 hover:bg-gray-100/80",
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
            <TabsTrigger value="inactive">
              Inactive<Badge variant="outline">{getCount("inactive")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="flagged">
              Flagged<Badge variant="outline">{getCount("flagged")}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

    </div>

    <Table className="border rounded-xl px-2 border-gray-200">
      <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-slate-600">
                Warden
              </TableHead>
              <TableHead className="font-semibold text-slate-600 text-center">
                Provider
              </TableHead>
              <TableHead className="font-semibold text-slate-600 text-center">
                Zone
              </TableHead>
              <TableHead className="font-semibold text-slate-600">
                Status
              </TableHead>
              <TableHead className="font-semibold text-slate-600">
                Reliability
              </TableHead>
              <TableHead className="font-semibold text-slate-600">
                Updates Today
              </TableHead>
              <TableHead className="font-semibold text-slate-600">
                Last seen
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWardens.length > 0 ? (
              filteredWardens.map((warden) => (
                <TableRow
                  key={warden.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="flex items-center gap-3 py-4">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <span className="font-medium text-slate-900">
                        {warden.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {warden.provider}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className=" flex items-center gap-1">
                        <MapPin className=" size-4"/>
                        <p>{warden.zone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p
                      className={cn(
                        "px-3 py-1 rounded-2xl w-20 text-xs text-center font-medium",
                        statusStyle[
                          (warden.status.charAt(0).toUpperCase() +
                            warden.status.slice(1)) as FilterValue
                        ] || "",
                      )}
                    >
                      {warden.status}
                    </p>
                  </TableCell>
                  <TableCell className=" text-center">
                    {warden.reliability}
                  </TableCell>
                   <TableCell className="text-center">
                    {warden.updatesToday}
                  </TableCell>
                   <TableCell className=" text-center text-gray-500">
                    {warden.lastSeen}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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

export default WardenTable;
