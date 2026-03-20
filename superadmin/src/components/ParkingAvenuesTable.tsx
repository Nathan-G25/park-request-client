// import type { ProviderMock } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Building2, Clock, Filter, MoreHorizontal, Search } from "lucide-react";
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
import { parkingAvenueSchema, type ParkingAvenue } from "@/schema";
import z, { ZodError } from "zod";
import ProviderTableSkeleton from "@/utils/skeletons/ProviderTableSkeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Controller, useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useUpdateAvenueStatus } from "@/hooks/useUpdateAvenueStatus";
import { toast } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";

type FilterValue = "all" | "approved" | "rejected" | "underreview";
type UpdateAvenueStatus = {
  id: string;
  approvalStatus: string;
};

const fetchProviders = async (): Promise<ParkingAvenue[]> => {
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
    "http://localhost:3000/admin/avenueapprovalstatus",
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
    const parsedData = z.array(parkingAvenueSchema).parse(result);
    return parsedData;
  } catch (err) {
    if (err instanceof ZodError) {
      console.error("Zod validation failed on API response:", err.message);
    }
    return [];
  }
};

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_ID;

const ParkingAvenuesTable = () => {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [openStatus, setOpenStatus] = useState(false);
  const [selectedAvenue, setSelectedAvenue] = useState<ParkingAvenue | null>();
  const [openInfo, setOpenInfo] = useState(false);
  const [selectedAvenueInfo, setSelectedAvenueInfo] =
    useState<ParkingAvenue | null>();

  const { control, reset, register, handleSubmit } =
    useForm<UpdateAvenueStatus>({
      defaultValues: {
        id: "",
        approvalStatus: "",
      },
    });

  const {
    data: locations,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchProviders,
    retry: false,
  });

  const { mutate, isPending } = useUpdateAvenueStatus();

  const onUpdateSubmit = (data: UpdateAvenueStatus) => {
    mutate(
      {
        id: data.id,
        approvalStatus: data.approvalStatus,
      },
      {
        onSuccess: () => {
          toast.success("Parking avenue status updated");
          setOpenStatus(false);
          refetch();
        },
        onError: (err) => {
          toast.error(`Failed to update status: ${err.message}`);
        },
      },
    );
  };
  useEffect(() => {
    if (selectedAvenue) {
      reset({
        id: selectedAvenue.id,
        approvalStatus: selectedAvenue.approvalStatus.toUpperCase(),
      });
    }
  }, [selectedAvenue, reset]);

  const filteredParkingAvenues = useMemo(() => {
    return locations?.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTab =
        filter === "all" ||
        p.approvalStatus.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesTab;
    });
  }, [locations, searchTerm, filter]);

  const getCount = (status: string) =>
    locations?.filter((p) =>
      status === "all"
        ? true
        : p.approvalStatus.toLowerCase() === status.toLowerCase(),
    ).length;
  const statusStyle: Record<string, string> = {
    APPROVED: "bg-green-100 text-green-800 hover:bg-green-100/80",
    REJECTED: "bg-red-100 text-red-800 hover:bg-blue-100/80 ",
    UNDERREVIEW: "bg-orange-100 text-orange-800 hover:bg-gray-100/80",
  };

  const getFullImagePath = (path: string | null | undefined) => {
    if (!path) return "";

    const cleanPath = path.replace(/\\/g, "/");
    return `http://localhost:3000/${cleanPath}`;
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
            <TabsTrigger value="underreview">
              Under Review
              <Badge variant="outline">{getCount("underreview")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected<Badge variant="outline">{getCount("rejected")}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {filteredParkingAvenues && filteredParkingAvenues.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">
          No reservations match the selected filter.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-slate-600">
                Parking Avenue
              </TableHead>
              <TableHead className=" text-center font-semibold text-slate-600">
                Total Spots
              </TableHead>
              <TableHead className=" font-semibold text-slate-600 text-center">
                Working Hours
              </TableHead>
              <TableHead className="font-semibold text-slate-600 text-center">
                Hourly Rate
              </TableHead>
              <TableHead className="font-semibold text-slate-600 text-center">
                Type
              </TableHead>
              <TableHead className="font-semibold text-slate-600">
                Status
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParkingAvenues && filteredParkingAvenues.length > 0 ? (
              filteredParkingAvenues.map((avenue) => (
                <TableRow
                  key={avenue.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="flex items-center gap-3 py-4">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">
                        {avenue.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {avenue.address}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {avenue.totalSpots}
                  </TableCell>
                  <TableCell className="text-center flex gap-1 items-center justify-center">
                    <Clock className=" size-3" />
                    <span>{avenue.workingHrs}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {avenue.hourlyRate} Birr
                  </TableCell>
                  <TableCell className="text-center lowercase">
                    {avenue.type}
                  </TableCell>
                  <TableCell>
                    <p
                      className={cn(
                        "px-3 py-1 rounded-2xl w-fit text-xs lowercase text-center font-medium",
                        statusStyle[
                          (avenue.approvalStatus.charAt(0).toUpperCase() +
                            avenue.approvalStatus.slice(1)) as FilterValue
                        ] || "",
                      )}
                    >
                      {avenue.approvalStatus}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {/* Triggers the dialog*/}
                        <DropdownMenuItem
                          onClick={() => {
                            setOpenInfo(true);
                            setSelectedAvenueInfo(avenue);
                          }}
                        >
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setOpenStatus(true);
                            setSelectedAvenue(avenue);
                          }}
                        >
                          Update status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
      <Dialog open={openInfo} onOpenChange={setOpenInfo}>
        <DialogContent className=" max-w-sm">
          <DialogHeader>
            <DialogTitle>Provider's Info</DialogTitle>
            <DialogDescription>
              Complete details about {selectedAvenueInfo?.name}
            </DialogDescription>
          </DialogHeader>
          <div className=" flex flex-col no-scrollbar max-h-[70vh] overflow-y-auto text-justify justify-center">
            <div className=" w-full ">
              <p className=" text-sm text-muted-foreground font-medium mb-1">
                Legal Document:
              </p>
              <div className=" w-full rounded-lg">
                <img
                  src={getFullImagePath(selectedAvenueInfo?.legalDoc)}
                  alt="personalID"
                  className=" w-full h-48 object-center object-cover"
                />
              </div>
            </div>
            <div className=" w-full flex items-center gap-5 mt-2 mb-3">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                {" "}
                Address:
              </p>
              <p className=" text-sm">{selectedAvenueInfo?.address}</p>
            </div>
            <div className=" w-full flex items-center gap-5 mb-3">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                {" "}
                Hourly Rate:
              </p>
              <p className=" text-sm">{selectedAvenueInfo?.hourlyRate} Birr</p>
            </div>
            <div className=" w-full flex items-center gap-5 mb-3">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                {" "}
                Total Spots:
              </p>
              <p className=" text-sm">{selectedAvenueInfo?.totalSpots}</p>
            </div>
            <div className=" w-full flex items-center gap-5 mb-3">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                Status:
              </p>
              <p className=" text-sm">{selectedAvenueInfo?.status}</p>
            </div>
            <div className=" w-full flex items-center gap-5 mb-3">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                {" "}
                Approval Status:
              </p>
              <p className=" text-sm">{selectedAvenueInfo?.approvalStatus}</p>
            </div>
            <div className=" w-full mb-3">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                {" "}
                Location:
              </p>
              <div className=" h-30">
                <APIProvider apiKey={API_KEY}>
                  <Map
                    defaultZoom={30}
                    defaultCenter={{
                      lat: selectedAvenueInfo?.latitude,
                      lng: selectedAvenueInfo?.longitude,
                    }}
                    mapId={MAP_ID}
                    disableDefaultUI
                  >
                    <AdvancedMarker
                      position={{
                        lat: selectedAvenueInfo?.latitude,
                        lng: selectedAvenueInfo?.longitude,
                      }}
                    >
                      <Pin
                        background={"#000"}
                        glyphColor={"#fff"}
                        borderColor={"#000"}
                      />
                    </AdvancedMarker>
                  </Map>
                </APIProvider>
              </div>
            </div>
            <div className=" w-full flex items-center gap-5 mb-3">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                {" "}
                Created At:
              </p>
              <p className=" text-sm">{selectedAvenueInfo?.createdAt}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={openStatus} onOpenChange={setOpenStatus}>
        <DialogContent className=" max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Parking Avenue Status</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <form onSubmit={handleSubmit(onUpdateSubmit)}>
              <Controller
                name="approvalStatus"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid gap-3"
                  >
                    <Label
                      htmlFor="APPROVED"
                      className="w-full flex flex-1 cursor-pointer items-center justify-between font-normal"
                    >
                      <div className="w-full flex items-center space-x-3 space-y-0 rounded-md border p-3 hover:bg-accent transition-colors">
                        <RadioGroupItem value="APPROVED" id="APPROVED" />
                        <span>Approved</span>
                      </div>
                    </Label>

                    <div className="flex items-center space-x-3 space-y-0 rounded-md border p-3 hover:bg-accent transition-colors">
                      <RadioGroupItem value="UNDERREVIEW" id="underreview" />
                      <Label
                        htmlFor="underreview"
                        className="flex flex-1 cursor-pointer items-center justify-between font-normal"
                      >
                        <span>Under Review</span>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 space-y-0 rounded-md border p-3 hover:bg-accent transition-colors">
                      <RadioGroupItem value="REJECTED" id="rejected" />
                      <Label
                        htmlFor="rejected"
                        className="flex flex-1 cursor-pointer items-center justify-between font-normal"
                      >
                        <span>Rejected</span>
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
              <Input type="hidden" {...register("id")} />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpenStatus(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Updating..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ParkingAvenuesTable;
