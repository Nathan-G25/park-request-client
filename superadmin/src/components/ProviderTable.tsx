import type { Provider } from "@/types";
import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Building2, Filter, MoreHorizontal, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const providers: Provider[] = [
  {
    id: 1,
    name: "Addis Parking Solutions",
    email: "admin@addisparking.et",
    locations: 45,
    spaces: 2340,
    status: "approved",
  },
  {
    id: 2,
    name: "Meskel Square Garages",
    email: "contact@meskelgarages.et",
    locations: 23,
    spaces: 1250,
    status: "approved",
  },
  {
    id: 3,
    name: "Bole Parking PLC",
    email: "hello@boleparking.et",
    locations: 10,
    spaces: 50,
    status: "pending",
  },
  {
    id: 4,
    name: "Piassa Auto Park",
    email: "ops@piassapark.et",
    locations: 12,
    spaces: 680,
    status: "rejected",
  },
  {
    id: 5,
    name: "Kazanchis Parking",
    email: "info@kazanchispark.et",
    locations: 8,
    spaces: 920,
    status: "approved",
  },
  {
    id: 6,
    name: "Merkato Smart Park",
    email: "support@merkatopark.et",
    locations: 10,
    spaces: 100,
    status: "pending",
  },
];

type FilterValue = "All" | "Approved" | "Rejected" | "Pending";

const ProviderTable = () => {
  const [filter, setFilter] = useState<FilterValue>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = providers.filter((item) =>
    filter === "All" ? true : item.status === filter,
  );

  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTab =
        filter === "All" || p.status.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesTab;
    });
  }, [searchTerm, filter]);

  const getCount = (status: string) =>
    providers.filter((p) =>
      status === "all" ? true : p.status.toLowerCase() === status.toLowerCase(),
    ).length;
  const statusStyle: Record<string, string> = {
    "Approved": "bg-green-100 text-green-800 hover:bg-green-100/80",
    "Rejected": "bg-red-100 text-red-800 hover:bg-blue-100/80 ",
    "Pending": "bg-orange-100 text-orange-800 hover:bg-gray-100/80",
  };

  return (
    <div className="rounded-md border">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search providers..."
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
            <TabsTrigger value="approved">
              Approved<Badge variant="outline">{getCount("approved")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected<Badge variant="outline">{getCount("rejected")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="suspended">
              Suspended<Badge variant="outline">{getCount("suspended")}</Badge>
            </TabsTrigger>
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
              <TableHead className="font-semibold text-slate-600">
                Provider
              </TableHead>
              <TableHead className="font-semibold text-slate-600 text-center">
                Locations
              </TableHead>
              <TableHead className="font-semibold text-slate-600 text-center">
                Spaces
              </TableHead>
              <TableHead className="font-semibold text-slate-600">
                Status
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProviders.length > 0 ? (
              filteredProviders.map((provider) => (
                <TableRow
                  key={provider.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="flex items-center gap-3 py-4">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">
                        {provider.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {provider.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {provider.locations}
                  </TableCell>
                  <TableCell className="text-center">
                    {provider.spaces.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <p className={cn(
                      "px-3 py-1 rounded-2xl w-20 text-xs text-center font-medium",
                      statusStyle[provider.status.charAt(0).toUpperCase() + provider.status.slice(1) as FilterValue] || ""
                    )}>
                      {provider.status}
                    </p>
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
                  colSpan={7}
                  className="h-32 text-center text-slate-400"
                >
                  No providers found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
export default ProviderTable;
