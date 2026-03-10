// import type { ProviderMock } from "@/types";
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
import { useQuery } from "@tanstack/react-query";
import { providerSchema, type Provider } from "@/schema";
import z, { ZodError } from "zod";
import ProviderTableSkeleton from "@/utils/skeletons/ProviderTableSkeleton";

// const providers: ProviderMock[] = [
//   {
//     id: 1,
//     name: "Addis Parking Solutions",
//     email: "admin@addisparking.et",
//     locations: 45,
//     spaces: 2340,
//     status: "approved",
//   },
//   {
//     id: 2,
//     name: "Meskel Square Garages",
//     email: "contact@meskelgarages.et",
//     locations: 23,
//     spaces: 1250,
//     status: "approved",
//   },
//   {
//     id: 3,
//     name: "Bole Parking PLC",
//     email: "hello@boleparking.et",
//     locations: 10,
//     spaces: 50,
//     status: "pending",
//   },
//   {
//     id: 4,
//     name: "Piassa Auto Park",
//     email: "ops@piassapark.et",
//     locations: 12,
//     spaces: 680,
//     status: "rejected",
//   },
//   {
//     id: 5,
//     name: "Kazanchis Parking",
//     email: "info@kazanchispark.et",
//     locations: 8,
//     spaces: 920,
//     status: "approved",
//   },
//   {
//     id: 6,
//     name: "Merkato Smart Park",
//     email: "support@merkatopark.et",
//     locations: 10,
//     spaces: 100,
//     status: "pending",
//   },
// ];

type FilterValue = "all" | "approved" | "rejected" | "underreview";

const fetchProviders = async (): Promise<Provider[]> => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    throw new Error("No user found");
  }

  const user = JSON.parse(storedUser);
  const token = user.accessToken;

  if (!token) {
    throw new Error("No accesstoken found");
  }

  const response = await fetch(
    "http://localhost:3000/admin/ownerverificationstatus",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Session expired. Please login again.");
    }
    throw new Error("Could not fetch profile");
  }
  try {
    const parsedData = z.array(providerSchema).parse(result);
    return parsedData;
  } catch (err) {
    if (err instanceof ZodError) {
      console.error("Zod validation failed on API response:", err.message);
    }
    return [];
  }
};

const ProviderTable = () => {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: provider,error, isLoading, refetch} = useQuery({
    queryKey: ["provider"],
    queryFn: fetchProviders,
    retry: false,
  });

  // const filteredData = provider?.filter((item) =>
  //   filter === "all" ? true : item.isVerified.toLowerCase() === filter,
  // );

  const filteredProviders = useMemo(() => {
    return provider?.filter((p) => {
      const matchesSearch =
        p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTab =
        filter === "all" || p.isVerified.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesTab;
    });
  }, [provider, searchTerm, filter]);

  const getCount = (status: string) =>
    provider?.filter((p) =>
      status === "all"
        ? true
        : p.isVerified.toLowerCase() === status.toLowerCase(),
    ).length;
  const statusStyle: Record<string, string> = {
    APPROVED: "bg-green-100 text-green-800 hover:bg-green-100/80",
    REJECTED: "bg-red-100 text-red-800 hover:bg-blue-100/80 ",
    UNDERREVIEW: "bg-orange-100 text-orange-800 hover:bg-gray-100/80",
  };

  if (isLoading) {
    return <ProviderTableSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-md border p-6 text-center">
        <p className="text-muted-foreground mb-4">
          Failed to load providers: {error.message}
        </p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

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
            <TabsTrigger value="all">
              All <Badge variant="outline">{getCount("all")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved<Badge variant="outline">{getCount("approved")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected<Badge variant="outline">{getCount("rejected")}</Badge>
            </TabsTrigger>
            {/* <TabsTrigger value="suspended">
              Suspended<Badge variant="outline">{getCount("suspended")}</Badge>
            </TabsTrigger> */}
          </TabsList>
        </Tabs>

        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {filteredProviders && filteredProviders.length === 0 ? (
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
            {filteredProviders && filteredProviders.length > 0 ? (
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
                        {provider.firstName} {provider.lastName}
                      </span>
                      <span className="text-xs text-slate-500">
                        {provider.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">20</TableCell>
                  <TableCell className="text-center">400</TableCell>
                  <TableCell>
                    <p
                      className={cn(
                        "px-3 py-1 rounded-2xl w-fit text-xs lowercase text-center font-medium",
                        statusStyle[
                          (provider.isVerified.charAt(0).toUpperCase() +
                            provider.isVerified.slice(1)) as FilterValue
                        ] || "",
                      )}
                    >
                      {provider.isVerified}
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
